/**
 * `cloneDeep` es la política común de inmutabilidad.
 *
 * Era un alias directo de `structuredClone`, así que cualquier valor no
 * estructurable lo hacía lanzar. `SisadPdfmeGlobalConfig.events` acepta
 * callbacks del host por contrato, de modo que una configuración legal
 * reventaba en `migrate` y en `ConfigService.update` (RTP-435).
 */
import { describe, expect, it } from 'vitest';
import { cloneDeep } from '../../../../../src/sisad-pdfme/common/helper';

describe('cloneDeep', () => {
  it('clona en profundidad los valores estructurables', () => {
    const source = { a: 1, nested: { list: [1, 2, { deep: true }] } };
    const copy = cloneDeep(source);
    expect(copy).toEqual(source);
    expect(copy.nested).not.toBe(source.nested);
    expect(copy.nested.list).not.toBe(source.nested.list);
  });

  it('no lanza ante funciones y conserva su referencia', () => {
    const handler = () => 'ok';
    const source = { events: { onSave: handler }, runtime: { readonly: true } };
    const copy = cloneDeep(source);
    expect(copy.events.onSave).toBe(handler);
    expect(copy.events).not.toBe(source.events);
    expect(copy.runtime.readonly).toBe(true);
  });

  it('soporta referencias circulares en el camino de fallback', () => {
    const source: Record<string, unknown> = { fn: () => undefined };
    source.self = source;
    const copy = cloneDeep(source) as Record<string, unknown>;
    expect(copy.self).toBe(copy);
  });

  it('conserva por referencia lo que no es objeto plano', () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const date = new Date(0);
    const copy = cloneDeep({ fn: () => undefined, bytes, date });
    expect(copy.bytes).toBe(bytes);
    expect(copy.date).toBe(date);
  });
});
