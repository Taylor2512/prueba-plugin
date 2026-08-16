/**
 * Compilador de configuración de SISAD-PDFME.
 *
 * Pipeline canónico (RTP-435):
 *
 * ```text
 * raw JSON
 *   -> migrate      (alias deprecados a rutas canónicas)
 *   -> validate     (issues, sin abortar)
 *   -> normalize    (defaults + expansión de perfil)
 *   -> identidad    (revision monotónica + hash semántico)
 *   -> ResolvedConfig inmutable
 *   -> superficies
 * ```
 *
 * Antes, `createSisadPdfmeConfig` era un alias directo de
 * `resolveSisadPdfmeConfig` y el resultado era mutable: cualquier superficie
 * podía escribir dentro de `config`/`visibility` y quedarse con una vista que
 * ninguna otra compartía. Tampoco había forma de saber si dos referencias a
 * «la configuración» eran la misma versión.
 *
 * El hash es SEMÁNTICO: no depende del orden de claves ni de la identidad de
 * objetos, sólo del contenido. Dos compilaciones del mismo input producen el
 * mismo hash y, por tanto, conservan la misma revisión.
 */
import { resolveSisadPdfmeConfig } from '@sisad-pdfme/config/resolveSisadPdfmeConfig';
import { normalizeSisadPdfmeConfig, type SisadPdfmeConfigNormalizationIssue } from '@sisad-pdfme/config/configNormalizer';
import { validateSisadPdfmeConfig, type SisadPdfmeConfigIssue } from '@sisad-pdfme/config/configValidation';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';

/** Identidad de una configuración resuelta. */
export type ResolvedConfigIdentity = {
  /**
   * Revisión monotónica. Sólo avanza cuando el hash semántico cambia: dos
   * compilaciones equivalentes NO consumen revisión.
   */
  revision: number;
  /** Hash del contenido normalizado. Estable ante reordenación de claves. */
  hash: string;
};

export type CompiledSisadPdfmeConfig = ResolvedSisadPdfmeConfig &
  ResolvedConfigIdentity & {
    issues: SisadPdfmeConfigIssue[];
    normalizationIssues: SisadPdfmeConfigNormalizationIssue[];
  };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Serialización canónica: claves ordenadas y valores no serializables
 * reducidos a un marcador de tipo.
 *
 * Las funciones (handlers de `events`, adapters del host) no forman parte de
 * la identidad semántica: dos configuraciones que sólo difieren en la
 * identidad de una closure son la misma política.
 */
const canonicalize = (value: unknown, seen = new WeakSet<object>()): unknown => {
  if (value === null || value === undefined) return null;
  const type = typeof value;
  if (type === 'function') return '[function]';
  if (type === 'symbol') return '[symbol]';
  if (type !== 'object') return value;

  const objectValue = value as object;
  if (seen.has(objectValue)) return '[circular]';
  seen.add(objectValue);

  if (Array.isArray(value)) {
    return value.map((entry) => canonicalize(entry, seen));
  }
  if (!isPlainObject(value)) {
    // Map, Set, Date, instancias de clase: se reducen a su etiqueta de tipo
    // más su forma serializable, sin intentar recorrer internals.
    return `[${Object.prototype.toString.call(value)}]`;
  }
  return Object.keys(value)
    .sort()
    .reduce<Record<string, unknown>>((accumulator, key) => {
      accumulator[key] = canonicalize((value as Record<string, unknown>)[key], seen);
      return accumulator;
    }, {});
};

/** FNV-1a de 32 bits en hexadecimal. Suficiente para detectar cambios. */
const fnv1a = (input: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
};

/**
 * Hash semántico de una configuración resuelta.
 *
 * Sólo entran `config` y `visibility`: `runtimeOptions`, `designerEngine`,
 * `adapters` y `eventHub` son DERIVADOS o infraestructura, no política.
 */
export const hashResolvedConfig = (resolved: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>): string =>
  fnv1a(JSON.stringify(canonicalize({ config: resolved.config, visibility: resolved.visibility })));

/**
 * Congela en profundidad sin tocar funciones ni instancias no planas.
 *
 * Se aplica sólo a `config` y `visibility`. El objeto raíz queda mutable a
 * propósito: `SisadPdfmeConfigService` reutiliza `designerEngine`, `adapters`
 * y `eventHub` de la revisión anterior cuando el cambio no exige reconstruir
 * recursos.
 */
const deepFreeze = <T>(value: T, seen = new WeakSet<object>()): T => {
  if (!value || typeof value !== 'object') return value;
  const objectValue = value as unknown as object;
  if (seen.has(objectValue) || Object.isFrozen(objectValue)) return value;
  seen.add(objectValue);
  Object.values(objectValue as Record<string, unknown>).forEach((entry) => {
    if (entry && typeof entry === 'object') deepFreeze(entry, seen);
  });
  return Object.freeze(value);
};

export type CompileOptions = {
  /**
   * Configuración compilada anterior. Si el hash coincide se conserva su
   * revisión; si difiere, la nueva revisión es `previous.revision + 1`.
   */
  previous?: ResolvedConfigIdentity | null;
};

export const compileSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
  options: CompileOptions = {},
): CompiledSisadPdfmeConfig => {
  const normalization = normalizeSisadPdfmeConfig(input);
  const issues = validateSisadPdfmeConfig(input);
  const resolved = resolveSisadPdfmeConfig(normalization.config);

  const hash = hashResolvedConfig(resolved);
  const previous = options.previous ?? null;
  const revision = previous ? (previous.hash === hash ? previous.revision : previous.revision + 1) : 1;

  deepFreeze(resolved.config);
  deepFreeze(resolved.visibility);

  return Object.assign(resolved, {
    revision,
    hash,
    issues,
    normalizationIssues: normalization.issues,
  });
};
