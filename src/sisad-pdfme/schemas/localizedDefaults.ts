/**
 * localizedDefaults — contenido inicial localizado para schemas nuevos.
 *
 * Problema que resuelve:
 * Un plugin no puede escribir su contenido inicial ya traducido, porque el
 * `defaultSchema` es un valor estático evaluado al importar el módulo, cuando
 * todavía no existe idioma activo. Escribirlo en un idioma fijo hacía que un
 * `multiVariableText` naciera en inglés dentro de una interfaz española.
 *
 * Contrato — UI translation != document data:
 * - El contenido inicial se materializa UNA SOLA VEZ, al CREAR el schema, y a
 *   partir de ahí es dato del documento.
 * - Cambiar el idioma de la UI NUNCA reescribe el contenido de un schema ya
 *   existente: eso mutaría documentos y texto escrito por la persona usuaria.
 * - El marcador se elimina del schema materializado, así que no se persiste ni
 *   vuelve a resolverse en cargas posteriores.
 *
 * Cómo lo declara un plugin (built-in o del host):
 *
 *     defaultSchema: {
 *       type: 'multiVariableText',
 *       text: '',
 *       __i18nDefaults: { text: 'schemas.mvt.defaultContent' },
 *     }
 *
 * Sólo se rellenan campos vacíos: si el host ya aportó un valor explícito para
 * ese campo, ese valor manda.
 */
import type { Dict } from '@sisad-pdfme/common';

/** Propiedad marcadora que declara qué campos tienen contenido inicial localizable. */
export const I18N_DEFAULTS_KEY = '__i18nDefaults';

/** Mapa `campo del schema` -> `key de Dict`. */
export type LocalizedSchemaDefaults = Record<string, keyof Dict>;

/** Schema que declara contenido inicial localizable. */
export type SchemaWithLocalizedDefaults = Record<string, unknown> & {
  [I18N_DEFAULTS_KEY]?: LocalizedSchemaDefaults;
};

const isBlank = (value: unknown): boolean =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

/**
 * Materializa el contenido inicial localizado de un schema recién creado.
 *
 * Devuelve un objeto nuevo sin el marcador. Si el schema no declara defaults
 * localizables se devuelve tal cual (sin clonar de más).
 *
 * @param schema Schema plantilla proveniente de `propPanel.defaultSchema`.
 * @param translate Traducción del idioma activo (`I18nContext`).
 */
export const applyLocalizedSchemaDefaults = <T extends Record<string, unknown>>(
  schema: T,
  translate: (key: keyof Dict) => string,
): T => {
  const declared = (schema as SchemaWithLocalizedDefaults)[I18N_DEFAULTS_KEY];
  if (!declared || typeof declared !== 'object') return schema;

  const next = { ...schema } as Record<string, unknown>;
  delete next[I18N_DEFAULTS_KEY];

  Object.entries(declared).forEach(([field, dictKey]) => {
    // Un valor explícito del host gana sobre el default localizado.
    if (!isBlank(next[field])) return;
    const translated = translate(dictKey as keyof Dict);
    if (typeof translated === 'string' && translated.trim()) {
      next[field] = translated;
    }
  });

  return next as T;
};
