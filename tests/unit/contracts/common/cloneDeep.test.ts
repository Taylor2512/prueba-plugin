/**
 * Caracterización de `cloneDeep` (RTP-435, revisado).
 *
 * `cloneDeep` era `structuredClone` a secas y lanzaba ante cualquier valor no
 * estructurable. `SisadPdfmeGlobalConfig.events` acepta callbacks del host
 * **por contrato de tipos**, así que una configuración legal reventaba en
 * `migrate` y en `ConfigService.update`.
 *
 * El cambio es global, así que hay que demostrar dos cosas:
 *
 * 1. **Nada de lo que antes funcionaba cambia.** El fallback SÓLO se activa
 *    cuando `structuredClone` lanza; para todo lo demás la vía rápida es la
 *    de siempre.
 * 2. **El camino de fallback no introduce aliasing.** Basta con que un objeto
 *    contenga una función en cualquier rama para caer al clon estructural, y
 *    ahí `Date`/`Map`/`Set`/TypedArray deben clonarse de verdad — pasarlos por
 *    referencia haría que mutar el clon mutara el original.
 */
import { describe, expect, it } from 'vitest';
import { cloneDeep } from '../../../../src/sisad-pdfme/common/helper';

/** Objeto que fuerza el camino de fallback por contener una función. */
const conFuncion = <T extends Record<string, unknown>>(payload: T) => ({
  ...payload,
  onEvent: () => undefined,
});

describe('vía rápida: valores estructurables', () => {
  it('clona en profundidad objetos planos y arrays', () => {
    const source = { a: 1, nested: { list: [1, 2, { deep: true }] } };
    const copy = cloneDeep(source);
    expect(copy).toEqual(source);
    expect(copy.nested).not.toBe(source.nested);
    expect(copy.nested.list).not.toBe(source.nested.list);
  });

  it('clona Date, Map, Set, RegExp y TypedArray sin aliasing', () => {
    const source = {
      date: new Date(1700000000000),
      map: new Map([['k', { v: 1 }]]),
      set: new Set([1, 2]),
      regexp: /abc/gi,
      bytes: new Uint8Array([1, 2, 3]),
      buffer: new ArrayBuffer(8),
    };
    const copy = cloneDeep(source);

    expect(copy.date).not.toBe(source.date);
    expect(copy.date.getTime()).toBe(source.date.getTime());
    expect(copy.map).not.toBe(source.map);
    expect(copy.map.get('k')).toEqual({ v: 1 });
    expect(copy.set).not.toBe(source.set);
    expect([...copy.set]).toEqual([1, 2]);
    expect(copy.regexp.source).toBe('abc');
    expect(copy.regexp.flags).toBe('gi');
    expect(copy.bytes).not.toBe(source.bytes);
    expect([...copy.bytes]).toEqual([1, 2, 3]);
    expect(copy.buffer.byteLength).toBe(8);
  });

  it('conserva undefined, null y valores falsy', () => {
    const source = { u: undefined, n: null, cero: 0, falso: false, vacio: '' };
    expect(cloneDeep(source)).toEqual(source);
  });

  it('soporta referencias circulares', () => {
    const source: Record<string, unknown> = { a: 1 };
    source.self = source;
    const copy = cloneDeep(source) as Record<string, unknown>;
    expect(copy.self).toBe(copy);
    expect(copy).not.toBe(source);
  });

  it('clona un objeto de schema realista', () => {
    const schema = {
      name: 'campo',
      type: 'text',
      position: { x: 10, y: 20 },
      width: 30,
      height: 5,
      options: [{ label: 'A', value: 0 }, { label: 'B', value: false }],
    };
    const copy = cloneDeep(schema);
    expect(copy).toEqual(schema);
    expect(copy.position).not.toBe(schema.position);
    expect(copy.options[0]).not.toBe(schema.options[0]);
    // Los valores falsy de opción sobreviven.
    expect(copy.options[0].value).toBe(0);
    expect(copy.options[1].value).toBe(false);
  });
});

describe('camino de fallback: valores con funciones', () => {
  it('no lanza y conserva la función por referencia', () => {
    const handler = () => 'ok';
    const source = { events: { onSave: handler }, runtime: { readonly: true } };
    const copy = cloneDeep(source);
    expect(copy.events.onSave).toBe(handler);
    expect(copy.events).not.toBe(source.events);
    expect(copy.runtime.readonly).toBe(true);
  });

  it('una función en cualquier rama NO provoca aliasing del resto', () => {
    // Éste es el riesgo concreto: basta una función para caer al camino
    // estructural, y ahí todo lo demás debe seguir clonándose de verdad.
    const source = conFuncion({
      date: new Date(1700000000000),
      map: new Map([['k', 1]]),
      set: new Set([1]),
      bytes: new Uint8Array([9, 9]),
      nested: { list: [1, 2] },
    });
    const copy = cloneDeep(source);

    expect(copy.date).not.toBe(source.date);
    expect(copy.date.getTime()).toBe(source.date.getTime());
    expect(copy.map).not.toBe(source.map);
    expect(copy.set).not.toBe(source.set);
    expect(copy.bytes).not.toBe(source.bytes);
    expect(copy.nested).not.toBe(source.nested);

    // Mutar el clon no puede tocar el original.
    copy.date.setTime(0);
    copy.map.set('k', 99);
    copy.nested.list.push(3);
    expect(source.date.getTime()).toBe(1700000000000);
    expect(source.map.get('k')).toBe(1);
    expect(source.nested.list).toEqual([1, 2]);
  });

  it('soporta ciclos también en el camino de fallback', () => {
    const source: Record<string, unknown> = { fn: () => undefined };
    source.self = source;
    const copy = cloneDeep(source) as Record<string, unknown>;
    expect(copy.self).toBe(copy);
  });

  it('una instancia de clase se conserva por referencia', () => {
    // No se puede reconstruir sin conocer su constructor; aliasar es más
    // honesto que fabricar un objeto plano con la misma forma.
    class Servicio {
      constructor(public readonly id: string) {}
    }
    const servicio = new Servicio('a');
    const copy = cloneDeep(conFuncion({ servicio }));
    expect(copy.servicio).toBe(servicio);
  });
});

describe('equivalencia con el comportamiento previo', () => {
  it('para todo valor estructurable el resultado coincide con structuredClone', () => {
    const casos: unknown[] = [
      { a: 1 },
      [1, 2, 3],
      new Date(0),
      new Map([['a', 1]]),
      new Set([1]),
      new Uint8Array([1]),
      null,
      undefined,
      0,
      false,
      '',
      { anidado: { profundo: { valor: [1, { x: null }] } } },
    ];
    casos.forEach((caso, index) => {
      expect(cloneDeep(caso), `caso ${index}`).toEqual(structuredClone(caso));
    });
  });
});
