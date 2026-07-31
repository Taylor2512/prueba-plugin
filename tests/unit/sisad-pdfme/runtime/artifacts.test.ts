/**
 * COREUX-019 — Lifecycle de exportación y artifacts.
 *
 * Criterios: sin object URL huérfana, los errores llegan al dispatcher, y el
 * estado se comunica con motivo.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  ARTIFACT_EVENT_NAMES,
  artifactStatusToExportEvent,
} from '@/sisad-pdfme/runtime/artifactEvents';
import { createInstanceEventDispatcher } from '@/sisad-pdfme/runtime/instanceEventDispatcher';
import { isSisadPdfmeEventName } from '@/sisad-pdfme/contracts/events';
import { createObjectUrl, revokeObjectUrls } from '@/sisad-pdfme/browser/objectUrls';

describe('traducción a eventos de exportación', () => {
  it('solo produce nombres del catálogo', () => {
    ARTIFACT_EVENT_NAMES.forEach((name) => {
      expect(isSisadPdfmeEventName(name)).toBe(true);
    });
  });

  it('mapea inicio, éxito y error de generación', () => {
    expect(artifactStatusToExportEvent({ type: 'generate-start' })).toEqual({
      name: 'export.started',
      payload: { format: 'pdf' },
    });

    expect(artifactStatusToExportEvent({ type: 'generate-success' }, { size: 2048 })).toEqual({
      name: 'export.succeeded',
      payload: { format: 'pdf', size: 2048 },
    });

    const failed = artifactStatusToExportEvent({
      type: 'generate-error',
      message: 'fuente no encontrada',
    });
    expect(failed?.name).toBe('export.failed');
    expect(failed?.payload).toMatchObject({
      format: 'pdf',
      error: { code: 'generate-error', message: 'fuente no encontrada', recoverable: true },
    });
  });

  it('distingue el formato por familia de artifact', () => {
    expect(artifactStatusToExportEvent({ type: 'pdf2img-start' })?.payload).toEqual({
      format: 'images',
    });
    expect(artifactStatusToExportEvent({ type: 'pdf2size-start' })?.payload).toEqual({
      format: 'sizes',
    });
  });

  it('ignora estados que no son de exportación', () => {
    // `validation-error` pertenece al dominio de validación, no al de artifacts.
    expect(artifactStatusToExportEvent({ type: 'validation-error' })).toBeNull();
    expect(artifactStatusToExportEvent({ type: '' })).toBeNull();
    expect(artifactStatusToExportEvent({ type: 'ready' })).toBeNull();
  });

  it('usa un mensaje por defecto cuando el error no lo trae', () => {
    const failed = artifactStatusToExportEvent({ type: 'pdf2img-error' });
    expect((failed?.payload as { error: { message: string } }).error.message).toBeTruthy();
  });

  it('tamaño ausente no produce NaN', () => {
    const ok = artifactStatusToExportEvent({ type: 'generate-success' });
    expect((ok?.payload as { size: number }).size).toBe(0);
  });
});

describe('los errores llegan al dispatcher', () => {
  it('un fallo de exportación viaja como evento canónico', () => {
    const dispatcher = createInstanceEventDispatcher({ instanceId: 'inst-art' });
    const received: string[] = [];
    dispatcher.subscribe((event) => received.push(event.name));

    const exportEvent = artifactStatusToExportEvent({
      type: 'generate-error',
      message: 'boom',
    });
    if (exportEvent) dispatcher.emit(exportEvent.name, exportEvent.payload as never);

    expect(received).toEqual(['export.failed']);
  });

  it('encadena inicio y resultado con correlationId', () => {
    const dispatcher = createInstanceEventDispatcher({ instanceId: 'inst-art' });
    const events: Array<{ name: string; correlationId?: string }> = [];
    dispatcher.subscribe((event) => events.push({ name: event.name, correlationId: event.correlationId }));

    const correlationId = 'export-1';
    dispatcher.emit('export.started', { format: 'pdf' }, { correlationId });
    dispatcher.emit('export.succeeded', { format: 'pdf', size: 10 }, { correlationId });

    expect(events).toHaveLength(2);
    expect(events[0].correlationId).toBe(correlationId);
    expect(events[1].correlationId).toBe(correlationId);
  });
});

describe('object URLs sin huérfanas', () => {
  it('cada URL creada se revoca', () => {
    const created: string[] = [];
    const revoked: string[] = [];
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;

    URL.createObjectURL = vi.fn(() => {
      const url = `blob:test-${created.length}`;
      created.push(url);
      return url;
    }) as never;
    URL.revokeObjectURL = vi.fn((url: string) => {
      revoked.push(url);
    }) as never;

    try {
      const first = createObjectUrl(new Uint8Array([1]), 'application/pdf');
      const second = createObjectUrl(new Uint8Array([2]), 'image/png');
      revokeObjectUrls([first, second]);

      expect(created).toHaveLength(2);
      expect(revoked).toEqual(created);
    } finally {
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
    }
  });

  it('revocar tolera nulos y vacíos sin lanzar', () => {
    expect(() => revokeObjectUrls([null, undefined, '', 'blob:x'])).not.toThrow();
  });

  it('sin API de URL devuelve cadena vacía en vez de romper', () => {
    const original = URL.createObjectURL;
    // @ts-expect-error simulamos un entorno sin la API
    URL.createObjectURL = undefined;

    try {
      expect(createObjectUrl(new Uint8Array([1]), 'application/pdf')).toBe('');
    } finally {
      URL.createObjectURL = original;
    }
  });
});
