/**
 * Recursos de integración: la rama NO serializable de `resources`.
 *
 * `SisadPdfmeInstanceResources` ya distinguía recursos portables de
 * `adapters`, y `createSisadPdfmeInstanceBundle` retiraba `adapters` del
 * bundle exportable. Esa intención es correcta y aquí se **generaliza**, no se
 * duplica: `integrations` es una segunda rama con la misma naturaleza —
 * clientes vivos, providers y funciones que no pueden viajar en un JSON.
 *
 * Se declara aparte de `adapters` porque son cosas distintas: `adapters`
 * normaliza DATOS del host; `integrations` aporta CAPACIDAD de ejecución
 * (transporte, fuentes de datos, firma, fuentes tipográficas).
 *
 * Regla dura: nada de aquí entra en template, snapshot ni bundle.
 */
import type { HttpClientAdapter } from './httpClient.js';

/** Claves de `resources` que jamás pueden serializarse. */
export const NON_PORTABLE_RESOURCE_KEYS = ['adapters', 'integrations'] as const;
export type NonPortableResourceKey = (typeof NON_PORTABLE_RESOURCE_KEYS)[number];

export type SisadPdfmeIntegrationResources = {
  /** Transporte inyectado por el host. Sin él no hay ejecución remota. */
  httpClient?: HttpClientAdapter;
  /** Fuentes de datos programáticas, indexadas por `sourceKey`. */
  dataSources?: Record<string, unknown>;
  /** Providers de ejecución de firma. */
  signatureExecution?: Record<string, unknown>;
  /** Registro de fuentes tipográficas compartido. */
  fonts?: unknown;
};

/**
 * Claves de credencial que no deben persistirse nunca.
 *
 * `SchemaHttpAuthConfig` admite hoy `token`, `username` y `password` dentro de
 * la configuración declarativa de conexión, que es editable desde el inspector
 * y viaja con el engine. Esta lista es la autoridad de lo que hay que quitar
 * antes de exportar.
 */
export const SECRET_KEYS: readonly string[] = [
  'authorization',
  'cookie',
  'token',
  'accesstoken',
  'refreshtoken',
  'bearer',
  'password',
  'apikey',
  'clientsecret',
  'secret',
  'privatekey',
  'headervalue',
];

const isSecretKey = (key: string): boolean => SECRET_KEYS.includes(key.trim().toLowerCase());

/**
 * Elimina recursivamente claves de credencial de un valor portable.
 *
 * No intenta adivinar: sólo actúa sobre nombres de clave conocidos. Devuelve
 * también las rutas eliminadas para poder auditar sin volcar el valor.
 */
export const stripSecrets = <T>(value: T): { value: T; removed: string[] } => {
  const removed: string[] = [];

  const walk = (input: unknown, path: string, seen: WeakSet<object>): unknown => {
    if (!input || typeof input !== 'object') return input;
    const objectValue = input as object;
    if (seen.has(objectValue)) return undefined;
    seen.add(objectValue);

    if (Array.isArray(input)) {
      return input.map((entry, index) => walk(entry, `${path}[${index}]`, seen));
    }

    const next: Record<string, unknown> = {};
    Object.entries(input as Record<string, unknown>).forEach(([key, entry]) => {
      const childPath = path ? `${path}.${key}` : key;
      if (isSecretKey(key)) {
        removed.push(childPath);
        return;
      }
      if (typeof entry === 'function') {
        removed.push(childPath);
        return;
      }
      next[key] = walk(entry, childPath, seen);
    });
    return next;
  };

  return { value: walk(value, '', new WeakSet<object>()) as T, removed };
};

/** ¿Este valor contiene alguna clave de credencial o función? */
export const containsSecrets = (value: unknown): boolean => stripSecrets(value).removed.length > 0;
