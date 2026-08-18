import type { Plugin, Schema, SchemaForUI } from '@sisad-pdfme/common';

/**
 * Puente perezoso hacia `normalizePluginDefaultSchema`.
 *
 * Existe para no repetir el bloque try/require en cada plugin y para romper el
 * ciclo `plugin → normalizers → schemas/index → plugin`: varios plugins
 * calculan su `defaultSchema` DURANTE la evaluación del módulo, así que un
 * import estático los dejaría llamando a `createDefaultSchema` antes de que
 * exista.
 *
 * Limitación conocida y deliberada: `require` no está definido en un bundle
 * ESM de navegador, así que en el navegador esta función devuelve SIEMPRE
 * `null` y cada llamante cae a su propio fallback. Eso es hoy el
 * comportamiento efectivo en producción; el aviso de DEV existe para que deje
 * de ser invisible y no se confunda un fallback con la ruta canónica.
 */
let missingNormalizerWarned = false;

export function getCanonicalDefault(
  plugin?: Plugin<Schema> | null,
  type?: string,
  context?: Record<string, unknown>,
): SchemaForUI | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { normalizePluginDefaultSchema } = require('@sisad-pdfme/schemas/normalizers');
    return normalizePluginDefaultSchema(plugin, type, context);
  } catch {
    if (import.meta.env?.DEV && !missingNormalizerWarned) {
      missingNormalizerWarned = true;
      try {
        // Excepción a no-console: sólo en DEV y una sola vez por sesión.
         
        console.warn(
          '[sisad-pdfme] getCanonicalDefault no pudo resolver el normalizador ' +
            '(require no existe en ESM de navegador): todos los llamantes usan su fallback declarado.',
        );
      } catch {
        // ignorar fallos de logging
      }
    }
    return null;
  }
}

export default getCanonicalDefault;
