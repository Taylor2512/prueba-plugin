/**
 * COREUX-007 — El hub de runtime queda conectado.
 *
 * La auditoría COREUX-003 encontró que `resolveSisadPdfmeConfig` creaba un
 * `eventHub` que nadie leía, mientras `Designer/index.tsx` buscaba el hub en
 * `designerEngine.extensions.events`; con los dos desconectados, toda emisión
 * interna era un no-op silencioso.
 *
 * Conectarlos exigió antes dejar de tratar las OPCIONES del runtime como
 * configuración (`configFromRuntimeOptions`): el ConfigService las clona con
 * `structuredClone` y cualquier función dentro de `designerEngine` hacía
 * fallar el montaje con DataCloneError.
 */
import { describe, expect, it, vi } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';

describe('event hub de la config resuelta', () => {
  it('existe y es funcional como transporte', () => {
    const resolved = createSisadPdfmeConfig({});
    const listener = vi.fn();

    const unsubscribe = resolved.eventHub.subscribe(listener);
    resolved.eventHub.emit({ type: 'designer.selection.changed' });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(typeof listener.mock.calls[0][0].timestamp).toBe('number');
    unsubscribe();
  });

  it('cada config resuelta tiene su propio hub', () => {
    expect(createSisadPdfmeConfig({}).eventHub).not.toBe(createSisadPdfmeConfig({}).eventHub);
  });

  it('expone la MISMA instancia en extensions.events y en eventHub', () => {
    const resolved = createSisadPdfmeConfig({});

    expect(resolved.designerEngine.extensions?.events).toBeDefined();
    expect(resolved.designerEngine.extensions?.events).toBe(resolved.eventHub);
  });

  it('una emisión por designerEngine llega a quien escucha el eventHub', () => {
    const resolved = createSisadPdfmeConfig({});
    const listener = vi.fn();

    resolved.eventHub.subscribe(listener);
    resolved.designerEngine.extensions?.events?.emit({ type: 'designer.selection.changed' });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('demuestra por qué no se puede colgar una función en la config', () => {
    const hostHub = { emit: vi.fn(), subscribe: vi.fn(), clear: vi.fn() };

    expect(() =>
      createSisadPdfmeConfig({ designerEngine: { extensions: { events: hostHub } } } as never),
    ).toThrow(/could not be cloned/);
  });
});
