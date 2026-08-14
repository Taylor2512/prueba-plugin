/**
 * DataPointer — resolución declarativa de valores dentro de una respuesta.
 *
 * ## Por qué es un resolver puro y declarativo
 *
 * Mapear una respuesta arbitraria a valores de schema exige navegar
 * estructuras que el core no conoce. La vía fácil sería permitir una expresión
 * JavaScript en la plantilla, y eso convierte cualquier plantilla no confiable
 * en ejecución de código arbitrario. Aquí **no hay `eval`**, ni funciones
 * serializadas, ni expresiones evaluables: sólo dos sintaxis de ruta.
 *
 * - **JSON Pointer** (RFC 6901): `/results/0/name`, con `~0`/`~1` escapados.
 * - **JSONPath** (subconjunto): `$.results[*].name`, `$.a.b`, `$[0]`.
 *
 * ## Ausente no es vacío
 *
 * `0`, `false`, `''`, `null` y `[]` son valores legítimos y se conservan tal
 * cual. Sólo la ruta que no existe produce `missing`. Confundirlos haría que
 * un `0` remoto se leyera como «campo sin rellenar».
 */

export type DataPointerKind = 'json-pointer' | 'json-path';

export type DataPointerResultKind = 'missing' | 'scalar' | 'object' | 'array';

export type DataPointerResult<T = unknown> =
  | { kind: 'missing'; value: undefined; matches: [] }
  | { kind: 'scalar'; value: T; matches: [T] }
  | { kind: 'object'; value: T; matches: [T] }
  | { kind: 'array'; value: T[]; matches: T[] };

const MISSING: DataPointerResult<never> = { kind: 'missing', value: undefined, matches: [] };

/** Detecta la sintaxis del puntero. Una ruta vacía apunta a la raíz. */
export const detectPointerKind = (pointer: string): DataPointerKind =>
  pointer.trim().startsWith('$') ? 'json-path' : 'json-pointer';

const unescapeToken = (token: string): string => token.replace(/~1/g, '/').replace(/~0/g, '~');

const isRecordLike = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

/**
 * Lee un segmento.
 *
 * Devuelve `{ found: false }` en vez de `undefined` porque `undefined` es
 * también un valor almacenable: hay que distinguir «existe y vale undefined»
 * de «no existe».
 */
const readSegment = (input: unknown, token: string): { found: boolean; value: unknown } => {
  if (!isRecordLike(input)) return { found: false, value: undefined };
  if (Array.isArray(input)) {
    if (!/^-?\d+$/.test(token)) return { found: false, value: undefined };
    const index = Number(token);
    if (index < 0 || index >= input.length) return { found: false, value: undefined };
    return { found: true, value: input[index] };
  }
  if (!Object.prototype.hasOwnProperty.call(input, token)) return { found: false, value: undefined };
  return { found: true, value: (input as Record<string, unknown>)[token] };
};

const classify = <T>(value: unknown): DataPointerResult<T> => {
  if (Array.isArray(value)) {
    return { kind: 'array', value: value as T[], matches: value as T[] };
  }
  if (value !== null && typeof value === 'object') {
    return { kind: 'object', value: value as T, matches: [value as T] };
  }
  return { kind: 'scalar', value: value as T, matches: [value as T] };
};

const resolveJsonPointer = <T>(root: unknown, pointer: string): DataPointerResult<T> => {
  const trimmed = pointer.trim();
  if (trimmed === '' || trimmed === '/') return classify<T>(root);
  if (!trimmed.startsWith('/')) return MISSING as DataPointerResult<T>;

  let current: unknown = root;
  for (const rawToken of trimmed.slice(1).split('/')) {
    const segment = readSegment(current, unescapeToken(rawToken));
    if (!segment.found) return MISSING as DataPointerResult<T>;
    current = segment.value;
  }
  return classify<T>(current);
};

type PathToken = { type: 'key'; value: string } | { type: 'index'; value: number } | { type: 'wildcard' };

/** Tokeniza el subconjunto de JSONPath soportado. `null` si no es analizable. */
const tokenizeJsonPath = (path: string): PathToken[] | null => {
  const trimmed = path.trim();
  if (!trimmed.startsWith('$')) return null;
  const tokens: PathToken[] = [];
  let cursor = 1;

  while (cursor < trimmed.length) {
    const char = trimmed[cursor];
    if (char === '.') {
      cursor += 1;
      // `..` (descenso recursivo) no está soportado: se rechaza en vez de
      // interpretarse como otra cosa.
      if (trimmed[cursor] === '.') return null;
      let key = '';
      while (cursor < trimmed.length && !'.['.includes(trimmed[cursor])) {
        key += trimmed[cursor];
        cursor += 1;
      }
      if (!key) return null;
      tokens.push(key === '*' ? { type: 'wildcard' } : { type: 'key', value: key });
      continue;
    }
    if (char === '[') {
      const end = trimmed.indexOf(']', cursor);
      if (end === -1) return null;
      const inner = trimmed.slice(cursor + 1, end).trim();
      cursor = end + 1;
      if (inner === '*') {
        tokens.push({ type: 'wildcard' });
        continue;
      }
      if (/^-?\d+$/.test(inner)) {
        tokens.push({ type: 'index', value: Number(inner) });
        continue;
      }
      const quoted = /^'(.*)'$/.exec(inner) ?? /^"(.*)"$/.exec(inner);
      if (quoted) {
        tokens.push({ type: 'key', value: quoted[1] });
        continue;
      }
      // Filtros y expresiones no se soportan: no se evalúa nada.
      return null;
    }
    return null;
  }
  return tokens;
};

const resolveJsonPath = <T>(root: unknown, path: string): DataPointerResult<T> => {
  const tokens = tokenizeJsonPath(path);
  if (!tokens) return MISSING as DataPointerResult<T>;
  if (tokens.length === 0) return classify<T>(root);

  let hadWildcard = false;
  let current: unknown[] = [root];

  for (const token of tokens) {
    const next: unknown[] = [];
    for (const node of current) {
      if (token.type === 'wildcard') {
        hadWildcard = true;
        if (Array.isArray(node)) next.push(...node);
        else if (isRecordLike(node)) next.push(...Object.values(node as Record<string, unknown>));
        continue;
      }
      const key = token.type === 'index' ? String(token.value) : token.value;
      const segment = readSegment(node, key);
      if (segment.found) next.push(segment.value);
    }
    current = next;
    if (!current.length) break;
  }

  // Un wildcard SIEMPRE devuelve colección, aunque haya casado una sola vez:
  // la cardinalidad la fija la ruta, no el resultado. Si no, un `[*]` con un
  // único elemento se leería como escalar y el consumidor rompería.
  if (hadWildcard) return { kind: 'array', value: current as T[], matches: current as T[] };
  if (!current.length) return MISSING as DataPointerResult<T>;
  return classify<T>(current[0]);
};

/** Resuelve un puntero contra una respuesta. Nunca lanza ni evalúa código. */
export const resolveDataPointer = <T = unknown>(
  root: unknown,
  pointer: string | null | undefined,
): DataPointerResult<T> => {
  if (pointer === null || pointer === undefined) return MISSING as DataPointerResult<T>;
  return detectPointerKind(pointer) === 'json-path'
    ? resolveJsonPath<T>(root, pointer)
    : resolveJsonPointer<T>(root, pointer);
};

/** Valor escalar del puntero, o `undefined` si no existe o es colección. */
export const resolveScalarPointer = (root: unknown, pointer?: string | null): unknown => {
  const result = resolveDataPointer(root, pointer);
  return result.kind === 'scalar' || result.kind === 'object' ? result.value : undefined;
};

/** Colección del puntero. Un valor único se envuelve; ausente da `[]`. */
export const resolveCollectionPointer = (root: unknown, pointer?: string | null): unknown[] => {
  const result = resolveDataPointer(root, pointer);
  if (result.kind === 'missing') return [];
  if (result.kind === 'array') return result.value;
  return [result.value];
};
