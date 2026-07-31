/**
 * COREUX-007 — Puente hub interno → catálogo canónico.
 *
 * El Designer emite con `type: string` heredado; el contrato público es la
 * unión discriminada. El puente traduce sin perder nada: lo que no tiene
 * equivalente viaja como `custom:<type>`.
 */
import { describe, expect, it, vi } from 'vitest';
import { createDesignerRuntimeEventHub } from '@/sisad-pdfme/ui/components/Designer/shared/designerExtensions';
import { createInstanceEventDispatcher } from '@/sisad-pdfme/runtime/instanceEventDispatcher';
import {
  RUNTIME_EVENT_TO_DOMAIN_EVENT,
  LEGACY_TYPE_TO_CANONICAL,
  bridgeRuntimeEventHub,
} from '@/sisad-pdfme/runtime/runtimeEventBridge';
import { isSisadPdfmeEventName } from '@/sisad-pdfme/contracts/events';

const setup = () => {
  const hub = createDesignerRuntimeEventHub();
  const dispatcher = createInstanceEventDispatcher({ instanceId: 'inst-bridge' });
  const received: Array<{ name: string; payload: unknown }> = [];
  dispatcher.subscribe((event) => received.push({ name: event.name, payload: event.payload }));
  const unsubscribe = bridgeRuntimeEventHub(hub, dispatcher, 'inst-bridge');
  return { hub, received, unsubscribe };
};

describe('mapa runtime → dominio', () => {
  it('solo apunta a nombres del catálogo', () => {
    Object.values(RUNTIME_EVENT_TO_DOMAIN_EVENT).forEach((name) => {
      expect(isSisadPdfmeEventName(name)).toBe(true);
    });
  });
});

describe('traducción', () => {
  it('convierte la selección heredada en selection.changed', () => {
    const { hub, received } = setup();

    hub.emit({
      type: 'designer.selection.changed',
      schemaIds: ['a', 'b'],
      pageIndex: 1,
      details: { mode: 'add', documentId: 'doc-1' },
    });

    expect(received).toHaveLength(1);
    expect(received[0].name).toBe('selection.changed');
    expect(received[0].payload).toEqual({
      ids: ['a', 'b'],
      mode: 'add',
      documentId: 'doc-1',
      pageNumber: 2,
    });
  });

  it('normaliza schemaId suelto a lista de ids', () => {
    const { hub, received } = setup();

    hub.emit({ type: 'designer.selection.changed', schemaId: 'solo' });

    expect((received[0].payload as { ids: string[] }).ids).toEqual(['solo']);
  });

  it('mapea las dos variantes de zoom al mismo evento canónico', () => {
    const { hub, received } = setup();

    hub.emit({ type: 'designer.view.zoom.changed', details: { previous: 1, current: 2 } });
    hub.emit({ type: 'runtime.view.zoom.changed', details: { previous: 2, current: 3 } });

    expect(received.map((event) => event.name)).toEqual(['zoom.changed', 'zoom.changed']);
    expect(received[1].payload).toMatchObject({ previous: 2, current: 3 });
  });

  it('traduce lock/unlock a schema.updated conservando la causa', () => {
    const { hub, received } = setup();

    hub.emit({ type: 'schema.locked', schemaId: 's1', patch: { readOnly: true } });

    expect(received[0].name).toBe('schema.updated');
    expect(received[0].payload).toMatchObject({
      schemaId: 's1',
      patch: { readOnly: true },
      cause: 'schema.locked',
    });
  });

  it('no emite cuando faltan datos mínimos', () => {
    const { hub, received } = setup();

    // schema.updated sin schemaId: preferimos no emitir a inventar payload.
    hub.emit({ type: 'designer.schema.change' });

    expect(received).toHaveLength(0);
  });
});

describe('eventos sin equivalente canónico', () => {
  it('viajan como extensión custom en lugar de perderse', () => {
    const { hub, received } = setup();

    hub.emit({ type: 'sidebar.list.search.changed', value: 'texto' });

    expect(received).toHaveLength(1);
    expect(received[0].name).toBe('custom:sidebar.list.search.changed');
    expect(received[0].payload).toEqual({ sourceType: 'sidebar.list.search.changed' });
  });
});

describe('entrega y orden', () => {
  it('una emisión del hub produce exactamente un evento canónico', () => {
    const { hub, received } = setup();

    hub.emit({ type: 'designer.selection.changed', schemaIds: ['a'] });

    expect(received).toHaveLength(1);
  });

  it('preserva el orden de emisión', () => {
    const { hub, received } = setup();

    hub.emit({ type: 'designer.view.page.changed', details: { previous: 1, current: 2, total: 5 } });
    hub.emit({ type: 'designer.selection.changed', schemaIds: ['a'] });
    hub.emit({ type: 'designer.view.zoom.changed', details: { previous: 1, current: 2 } });

    expect(received.map((event) => event.name)).toEqual([
      'page.changed',
      'selection.changed',
      'zoom.changed',
    ]);
  });

  it('deja de traducir tras cancelar la suscripción', () => {
    const { hub, received, unsubscribe } = setup();

    unsubscribe();
    hub.emit({ type: 'designer.selection.changed', schemaIds: ['a'] });

    expect(received).toHaveLength(0);
  });

  it('un hub ausente no rompe el cableado', () => {
    const dispatcher = createInstanceEventDispatcher({ instanceId: 'x' });

    expect(() => bridgeRuntimeEventHub(null, dispatcher, 'x')()).not.toThrow();
  });
});
