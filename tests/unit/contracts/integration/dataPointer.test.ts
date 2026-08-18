/**
 * Contrato del DataPointer (RTP-480).
 *
 * Lo crítico: `0`, `false`, `''`, `null` y `[]` son valores legítimos y NO
 * pueden confundirse con «ausente». Y no se evalúa código bajo ninguna
 * sintaxis: una plantilla no confiable no debe poder ejecutar nada.
 */
import { describe, expect, it } from 'vitest';
import {
  detectPointerKind,
  resolveCollectionPointer,
  resolveDataPointer,
  resolveScalarPointer,
} from '../../../../src/sisad-pdfme/integration/data/dataPointer';

const RESPONSE = {
  count: 0,
  activo: false,
  nombre: '',
  nulo: null,
  vacia: [],
  results: [
    { name: 'bulbasaur', url: '/pokemon/1', stats: { hp: 45 } },
    { name: 'ivysaur', url: '/pokemon/2', stats: { hp: 60 } },
  ],
  'clave/rara': { 'con~tilde': 'ok' },
};

describe('detección de sintaxis', () => {
  it('distingue JSONPath de JSON Pointer', () => {
    expect(detectPointerKind('$.results[*].name')).toBe('json-path');
    expect(detectPointerKind('/results/0/name')).toBe('json-pointer');
  });
});

describe('valores que no son ausencia', () => {
  it('conserva 0, false, cadena vacía, null y lista vacía', () => {
    expect(resolveDataPointer(RESPONSE, '/count')).toMatchObject({ kind: 'scalar', value: 0 });
    expect(resolveDataPointer(RESPONSE, '/activo')).toMatchObject({ kind: 'scalar', value: false });
    expect(resolveDataPointer(RESPONSE, '/nombre')).toMatchObject({ kind: 'scalar', value: '' });
    expect(resolveDataPointer(RESPONSE, '/nulo')).toMatchObject({ kind: 'scalar', value: null });
    expect(resolveDataPointer(RESPONSE, '/vacia')).toMatchObject({ kind: 'array', value: [] });
  });

  it('sólo la ruta inexistente es missing', () => {
    expect(resolveDataPointer(RESPONSE, '/no-existe').kind).toBe('missing');
    expect(resolveDataPointer(RESPONSE, '/results/99').kind).toBe('missing');
    expect(resolveDataPointer(RESPONSE, '/count/mas').kind).toBe('missing');
  });

  it('el índice cero es un índice válido, no una ausencia', () => {
    expect(resolveDataPointer(RESPONSE, '/results/0/name')).toMatchObject({ value: 'bulbasaur' });
    expect(resolveDataPointer(RESPONSE, '$.results[0].name')).toMatchObject({ value: 'bulbasaur' });
  });
});

describe('JSON Pointer', () => {
  it('resuelve rutas anidadas', () => {
    expect(resolveScalarPointer(RESPONSE, '/results/1/stats/hp')).toBe(60);
  });

  it('la raíz devuelve el documento completo', () => {
    expect(resolveDataPointer(RESPONSE, '').kind).toBe('object');
    expect(resolveDataPointer(RESPONSE, '/').kind).toBe('object');
  });

  it('desescapa ~0 y ~1', () => {
    expect(resolveScalarPointer(RESPONSE, '/clave~1rara/con~0tilde')).toBe('ok');
  });

  it('una ruta sin barra inicial no resuelve', () => {
    expect(resolveDataPointer(RESPONSE, 'results/0').kind).toBe('missing');
  });

  it('no atraviesa el prototipo', () => {
    expect(resolveDataPointer(RESPONSE, '/constructor').kind).toBe('missing');
    expect(resolveDataPointer(RESPONSE, '/__proto__').kind).toBe('missing');
  });
});

describe('JSONPath', () => {
  it('resuelve muchos con wildcard', () => {
    const result = resolveDataPointer(RESPONSE, '$.results[*].name');
    expect(result.kind).toBe('array');
    expect(result.value).toEqual(['bulbasaur', 'ivysaur']);
  });

  it('un wildcard con una sola coincidencia sigue siendo colección', () => {
    // La cardinalidad la fija la ruta, no el resultado.
    const result = resolveDataPointer({ results: [{ name: 'solo' }] }, '$.results[*].name');
    expect(result.kind).toBe('array');
    expect(result.value).toEqual(['solo']);
  });

  it('un wildcard sin coincidencias es colección vacía, no missing', () => {
    expect(resolveDataPointer({ results: [] }, '$.results[*].name')).toMatchObject({
      kind: 'array',
      value: [],
    });
  });

  it('soporta notación de corchete con comillas', () => {
    expect(resolveScalarPointer(RESPONSE, "$['clave/rara']['con~tilde']")).toBe('ok');
  });

  it('la raíz sola devuelve el documento', () => {
    expect(resolveDataPointer(RESPONSE, '$').kind).toBe('object');
  });

  it('recorre los valores de un objeto con wildcard', () => {
    expect(resolveDataPointer({ a: 1, b: 2 }, '$.*')).toMatchObject({ kind: 'array', value: [1, 2] });
  });
});

describe('no se evalúa código', () => {
  it('rechaza filtros y expresiones en vez de interpretarlos', () => {
    ['$.results[?(@.name=="x")]', '$.results[(@.length-1)]', '$..name'].forEach((pointer) => {
      expect(resolveDataPointer(RESPONSE, pointer).kind, pointer).toBe('missing');
    });
  });

  it('una sintaxis desconocida no lanza', () => {
    expect(() => resolveDataPointer(RESPONSE, '%%%')).not.toThrow();
    expect(resolveDataPointer(RESPONSE, null).kind).toBe('missing');
    expect(resolveDataPointer(RESPONSE, undefined).kind).toBe('missing');
  });
});

describe('helpers de cardinalidad', () => {
  it('la colección envuelve un valor único', () => {
    expect(resolveCollectionPointer(RESPONSE, '/count')).toEqual([0]);
    expect(resolveCollectionPointer(RESPONSE, '$.results[*].name')).toEqual(['bulbasaur', 'ivysaur']);
    expect(resolveCollectionPointer(RESPONSE, '/no-existe')).toEqual([]);
  });

  it('el escalar no devuelve colecciones', () => {
    expect(resolveScalarPointer(RESPONSE, '$.results[*].name')).toBeUndefined();
  });
});
