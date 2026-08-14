/**
 * Contrato de los codecs de valor (RTP-480).
 *
 * El contrato de campaña es explícito: `0`, `false`, `[]`, `''`, `null` y
 * `undefined` tienen semántica ESPECÍFICA DEL CODEC. Ningún codec puede
 * decidir vacío por truthiness.
 */
import { describe, expect, it } from 'vitest';
import {
  SCHEMA_CODEC_IDS,
  getSchemaValueCodec,
} from '../../../../../src/sisad-pdfme/schemas/values/schemaValueCodec';
import { getBuiltInFields } from '../../../../../src/sisad-pdfme/schemas';
import { buildSchemaRuntimeManifest } from '../../../../../src/sisad-pdfme/runtime/schemaManifest';

describe('cobertura de codecs', () => {
  it('todo tipo del registry tiene un codec resoluble', () => {
    buildSchemaRuntimeManifest(getBuiltInFields()).forEach((entry) => {
      expect(() => getSchemaValueCodec(entry.codec), entry.type).not.toThrow();
    });
  });

  it('un codec desconocido lanza en vez de devolver un default', () => {
    expect(() => getSchemaValueCodec('inventado' as never)).toThrow();
  });

  it('todo codec trata null y undefined como vacío', () => {
    SCHEMA_CODEC_IDS.forEach((id) => {
      const codec = getSchemaValueCodec(id);
      expect(codec.isEmpty(null), id).toBe(true);
      expect(codec.isEmpty(undefined), id).toBe(true);
    });
  });
});

describe('codec number', () => {
  const codec = getSchemaValueCodec('number');

  it('cero está rellenado', () => {
    expect(codec.isEmpty(0)).toBe(false);
    expect(codec.isEmpty('0')).toBe(false);
    expect(codec.decode('0')).toBe(0);
  });

  it('la cadena vacía y lo no numérico están vacíos', () => {
    expect(codec.isEmpty('')).toBe(true);
    expect(codec.isEmpty('abc')).toBe(true);
    expect(codec.decode('abc')).toBeNull();
  });

  it('la igualdad es numérica, no textual', () => {
    expect(codec.equals('1.50', 1.5)).toBe(true);
    expect(codec.equals(0, '0')).toBe(true);
    expect(codec.equals(0, null)).toBe(false);
  });
});

describe('codec boolean', () => {
  const codec = getSchemaValueCodec('boolean');

  it('false es una respuesta, no una ausencia', () => {
    expect(codec.isEmpty(false)).toBe(false);
    expect(codec.decode(false)).toBe(false);
  });

  it('sólo la ausencia vacía', () => {
    expect(codec.isEmpty(null)).toBe(true);
    expect(codec.isEmpty('')).toBe(true);
  });

  it('acepta representaciones textuales sin confundirlas con vacío', () => {
    expect(codec.decode('false')).toBe(false);
    expect(codec.decode('true')).toBe(true);
    expect(codec.equals('false', false)).toBe(true);
    expect(codec.equals('true', 1)).toBe(true);
  });
});

describe('codec array', () => {
  const codec = getSchemaValueCodec('array');

  it('la lista vacía es una selección vacía aunque sea truthy', () => {
    expect(codec.isEmpty([])).toBe(true);
    expect(codec.isEmpty(['a'])).toBe(false);
  });

  it('el orden de selección no es información', () => {
    expect(codec.equals(['a', 'b'], ['b', 'a'])).toBe(true);
    expect(codec.equals(['a'], ['a', 'b'])).toBe(false);
  });

  it('distingue lista vacía de ausencia', () => {
    expect(codec.equals([], null)).toBe(false);
    expect(codec.decode([])).toEqual([]);
    expect(codec.decode(null)).toBeNull();
  });

  it('acepta JSON serializado y valores sueltos', () => {
    expect(codec.decode('["a","b"]')).toEqual(['a', 'b']);
    expect(codec.decode('a')).toEqual(['a']);
  });
});

describe('codec string', () => {
  const codec = getSchemaValueCodec('string');

  it('sólo espacios cuenta como vacío', () => {
    expect(codec.isEmpty('   ')).toBe(true);
    expect(codec.isEmpty('a')).toBe(false);
  });

  it('cadena vacía y null coinciden en vacío pero no en igualdad', () => {
    expect(codec.isEmpty('')).toBe(true);
    expect(codec.isEmpty(null)).toBe(true);
    expect(codec.equals('', null)).toBe(false);
  });
});

describe('codec date', () => {
  const codec = getSchemaValueCodec('date');

  it('mismo instante en distinta representación es el mismo valor', () => {
    expect(codec.equals('2026-08-14T00:00:00.000Z', new Date(Date.UTC(2026, 7, 14)))).toBe(true);
    expect(codec.equals('2026-08-14T00:00:00.000Z', '2026-08-15T00:00:00.000Z')).toBe(false);
  });

  it('una fecha inválida está vacía', () => {
    expect(codec.isEmpty('no-es-fecha')).toBe(true);
    expect(codec.isEmpty('2026-08-14')).toBe(false);
  });
});

describe('codec opaque', () => {
  const codec = getSchemaValueCodec('opaque');

  it('la igualdad es por contenido, no por identidad', () => {
    expect(codec.equals({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(codec.equals({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('un contenedor vacío está vacío', () => {
    expect(codec.isEmpty({})).toBe(true);
    expect(codec.isEmpty([])).toBe(true);
    expect(codec.isEmpty(new Uint8Array())).toBe(true);
    expect(codec.isEmpty(new Uint8Array([1]))).toBe(false);
  });

  it('soporta estructuras circulares sin lanzar', () => {
    const value: Record<string, unknown> = { a: 1 };
    value.self = value;
    expect(() => codec.equals(value, value)).not.toThrow();
  });
});
