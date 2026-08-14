/**
 * SchemaValueCodec — semántica de valor por familia de schema.
 *
 * ## Por qué existe
 *
 * La completitud se decidía por truthiness. Eso es incorrecto para casi todas
 * las familias:
 *
 * - `0` es un número perfectamente rellenado, pero es falsy;
 * - `false` es una respuesta válida de una casilla, pero es falsy;
 * - `[]` es una selección VACÍA, pero es truthy;
 * - `''` y `null` significan cosas distintas: «borrado explícito» frente a
 *   «nunca tocado», y el runtime necesita distinguirlos para no marcar como
 *   `dirty` un campo que el host acaba de inicializar.
 *
 * Cada codec declara su propio vacío y su propia igualdad. `equals` es
 * **semántico**: dos selecciones con el mismo contenido en distinto orden son
 * iguales; dos fechas con distinta representación textual pero mismo instante
 * son iguales. Es la operación que el merge canónico usa para decidir si dos
 * ejecuciones realmente divergen (RTP-495).
 */
import type { SchemaCodecId } from '../schemaRuntimeMetadata.js';

export type SchemaValueCodec<T = unknown> = {
  id: SchemaCodecId;
  /** Normaliza una entrada cruda a la representación canónica del codec. */
  decode(raw: unknown): T | null;
  /** Representación transportable. `null` para «sin valor». */
  encode(value: T | null): unknown;
  /** ¿Este valor cuenta como «sin rellenar»? NO es `!value`. */
  isEmpty(raw: unknown): boolean;
  /** Igualdad semántica, no estructural. */
  equals(left: unknown, right: unknown): boolean;
};

const isNullish = (value: unknown): boolean => value === null || value === undefined;

const asTrimmedString = (value: unknown): string | null => {
  if (isNullish(value)) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
};

const stringCodec: SchemaValueCodec<string> = {
  id: 'string',
  decode: (raw) => asTrimmedString(raw),
  encode: (value) => (isNullish(value) ? null : value),
  // Una cadena de sólo espacios no es contenido; una cadena vacía tampoco.
  // `null` y `''` coinciden en «vacío» pero NO en `equals`.
  isEmpty: (raw) => {
    const value = asTrimmedString(raw);
    return value === null || value.trim() === '';
  },
  equals: (left, right) => asTrimmedString(left) === asTrimmedString(right),
};

const numberCodec: SchemaValueCodec<number> = {
  id: 'number',
  decode: (raw) => {
    if (isNullish(raw) || raw === '') return null;
    const numeric = typeof raw === 'number' ? raw : Number(String(raw).trim());
    return Number.isFinite(numeric) ? numeric : null;
  },
  encode: (value) => (isNullish(value) ? null : value),
  // `0` está rellenado. Sólo la ausencia y lo no numérico están vacíos.
  isEmpty: (raw) => numberCodec.decode(raw) === null,
  equals: (left, right) => {
    const a = numberCodec.decode(left);
    const b = numberCodec.decode(right);
    if (a === null || b === null) return a === b;
    return a === b;
  },
};

const booleanCodec: SchemaValueCodec<boolean> = {
  id: 'boolean',
  decode: (raw) => {
    if (typeof raw === 'boolean') return raw;
    if (isNullish(raw) || raw === '') return null;
    const text = String(raw).trim().toLowerCase();
    if (text === 'true' || text === '1' || text === 'on' || text === 'yes') return true;
    if (text === 'false' || text === '0' || text === 'off' || text === 'no') return false;
    return null;
  },
  encode: (value) => (isNullish(value) ? null : value),
  // `false` es una respuesta, no una ausencia. Sólo `null`/`undefined`/'' vacían.
  isEmpty: (raw) => booleanCodec.decode(raw) === null,
  equals: (left, right) => booleanCodec.decode(left) === booleanCodec.decode(right),
};

const toArray = (raw: unknown): string[] | null => {
  if (isNullish(raw)) return null;
  if (Array.isArray(raw)) return raw.map((entry) => String(entry ?? '')).filter((entry) => entry !== '');
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed === '') return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) return parsed.map((entry) => String(entry ?? '')).filter((entry) => entry !== '');
      } catch {
        // Una cadena que empieza por '[' pero no es JSON se trata como valor único.
      }
    }
    return [trimmed];
  }
  return [String(raw)];
};

const arrayCodec: SchemaValueCodec<string[]> = {
  id: 'array',
  decode: (raw) => toArray(raw),
  encode: (value) => (isNullish(value) ? null : [...value]),
  // `[]` es una selección vacía aunque sea truthy.
  isEmpty: (raw) => {
    const value = toArray(raw);
    return value === null || value.length === 0;
  },
  // El orden de selección no es información: {a,b} == {b,a}.
  equals: (left, right) => {
    const a = toArray(left);
    const b = toArray(right);
    if (a === null || b === null) return a === b;
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((entry, index) => entry === sortedB[index]);
  },
};

const toTimestamp = (raw: unknown): number | null => {
  if (isNullish(raw) || raw === '') return null;
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw.getTime();
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const parsed = Date.parse(String(raw).trim());
  return Number.isNaN(parsed) ? null : parsed;
};

const dateCodec: SchemaValueCodec<string> = {
  id: 'date',
  decode: (raw) => {
    const timestamp = toTimestamp(raw);
    return timestamp === null ? null : new Date(timestamp).toISOString();
  },
  encode: (value) => (isNullish(value) ? null : value),
  isEmpty: (raw) => toTimestamp(raw) === null,
  // Mismo instante = misma fecha, aunque la representación textual difiera.
  equals: (left, right) => {
    const a = toTimestamp(left);
    const b = toTimestamp(right);
    if (a === null || b === null) return a === b;
    return a === b;
  },
};

/**
 * Valores opacos: firmas, adjuntos, imágenes.
 *
 * El runtime no interpreta su contenido, pero sí necesita saber si hay algo y
 * si dos ejecuciones entregaron lo mismo. La igualdad se hace sobre una
 * serialización estable, no sobre identidad de objeto: dos lecturas del mismo
 * adjunto son el mismo valor.
 */
const stableSerialize = (value: unknown, seen = new WeakSet<object>()): string => {
  if (isNullish(value)) return 'null';
  if (typeof value !== 'object') return `${typeof value}:${String(value)}`;
  const objectValue = value as object;
  if (seen.has(objectValue)) return '[circular]';
  seen.add(objectValue);
  if (Array.isArray(value)) return `[${value.map((entry) => stableSerialize(entry, seen)).join(',')}]`;
  if (value instanceof Uint8Array) return `bytes:${value.length}:${Array.from(value.slice(0, 64)).join('.')}`;
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${key}=${stableSerialize((value as Record<string, unknown>)[key], seen)}`)
    .join(',')}}`;
};

const opaqueCodec: SchemaValueCodec<unknown> = {
  id: 'opaque',
  decode: (raw) => (isNullish(raw) || raw === '' ? null : raw),
  encode: (value) => (isNullish(value) ? null : value),
  isEmpty: (raw) => {
    if (isNullish(raw) || raw === '') return true;
    if (Array.isArray(raw)) return raw.length === 0;
    if (raw instanceof Uint8Array) return raw.length === 0;
    if (typeof raw === 'object') return Object.keys(raw as Record<string, unknown>).length === 0;
    return false;
  },
  equals: (left, right) => stableSerialize(left) === stableSerialize(right),
};

const CODECS: Record<SchemaCodecId, SchemaValueCodec> = {
  string: stringCodec as SchemaValueCodec,
  number: numberCodec as SchemaValueCodec,
  boolean: booleanCodec as SchemaValueCodec,
  array: arrayCodec as SchemaValueCodec,
  date: dateCodec as SchemaValueCodec,
  opaque: opaqueCodec,
};

/** Codec de un id. Un id desconocido es un error de programación, no un default. */
export const getSchemaValueCodec = (codecId: SchemaCodecId): SchemaValueCodec => {
  const codec = CODECS[codecId];
  if (!codec) {
    throw new Error(`SchemaValueCodec desconocido: ${String(codecId)}`);
  }
  return codec;
};

export const SCHEMA_CODEC_IDS = Object.keys(CODECS) as SchemaCodecId[];
