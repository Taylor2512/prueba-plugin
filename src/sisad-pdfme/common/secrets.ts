/**
 * Limpieza de credenciales de valores portables.
 *
 * ## Por qué vive en `common`
 *
 * Nació en `integration/http/integrationResources.ts`, junto al bundle que era
 * su único consumidor. Pero el problema no es del transporte: la configuración
 * declarativa de conexión (`SchemaHttpAuthConfig`) admite `token`, `username`,
 * `password` y `headerValue`, se edita desde el inspector y **se guarda dentro
 * del propio schema**. Desde ahí viaja a cualquier cosa que serialice el
 * documento, no sólo al bundle.
 *
 * `shared/snapshotAdapter` necesitaba la misma limpieza y no puede importar de
 * `integration` sin invertir las capas. Duplicar la lista de claves habría sido
 * peor: dos autoridades de «qué es un secreto» divergen en cuanto alguien añade
 * una. Por eso el primitivo baja a `common` y `integration` lo reexporta,
 * conservando su superficie pública.
 */

/**
 * Claves de credencial que no deben persistirse nunca.
 *
 * Autoridad única de lo que hay que quitar antes de exportar.
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
