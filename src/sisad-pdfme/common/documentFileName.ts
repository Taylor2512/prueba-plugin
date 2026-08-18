/**
 * documentFileName — resolución determinista del nombre de archivo descargado.
 *
 * ## Por qué existe
 *
 * Las rutas de descarga hacían `String(template.basePdf || fallback)`. Cuando
 * `basePdf` es un objeto de PDF —forma válida y frecuente— la conversión por
 * defecto de JavaScript produce el literal `[object Object]`, y el usuario
 * descargaba `[object Object].pdf`. Serializar el objeto entero tampoco sirve:
 * mete JSON en el nombre y puede filtrar datos del documento.
 *
 * ## Contrato
 *
 * - la entrada es `unknown`: ninguna ruta de descarga puede asumir la forma;
 * - de un objeto sólo se leen campos de NOMBRE explícitos, nunca su contenido;
 * - la salida es un *stem* (sin extensión) ya seguro para el sistema de
 *   archivos; poner `.pdf`/`.json` es responsabilidad del llamante;
 * - ante cualquier entrada irrecuperable devuelve el fallback recibido, de modo
 *   que la descarga siempre tiene un nombre estable y legible.
 */

/**
 * Campos de nombre aceptados en un `basePdf` con forma de objeto.
 *
 * El orden es la precedencia: lo más explícito primero. Se limita a metadatos
 * de nombre; ningún campo de contenido/datos entra aquí.
 */
const NAME_FIELDS = ['name', 'filename', 'fileName', 'title'] as const;

/** Fallback canónico para el PDF exportado. */
export const DEFAULT_DOCUMENT_FILE_STEM = 'sisad-pdfme-document';

/** Fallback canónico para el template exportado como JSON. */
export const DEFAULT_TEMPLATE_FILE_STEM = 'sisad-pdfme-template';

/** Caracteres prohibidos en nombres de archivo en Windows/macOS/Linux. */
const FORBIDDEN_CHARS = /[\\/:*?"<>|]+/g;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Extrae el último segmento significativo de algo con forma de ruta o URL.
 *
 * Quita query y hash ANTES de partir por `/`: si no, `doc.pdf?v=2` conservaría
 * la query dentro del nombre y una query con `/` partiría por el sitio errado.
 */
const lastPathSegment = (source: string): string => {
  const [withoutQuery] = source.split(/[?#]/);
  const segments = withoutQuery.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : withoutQuery;
};

/** Decodifica `%20` y similares; una secuencia inválida se deja tal cual. */
const decodeSafely = (source: string): string => {
  try {
    return decodeURIComponent(source);
  } catch {
    return source;
  }
};

/**
 * Quita la extensión final conocida.
 *
 * Sólo se retira UNA vez y sólo si es una extensión de documento esperada: así
 * `informe.2024.pdf` conserva `informe.2024` en vez de quedar en `informe`.
 */
const stripKnownExtension = (stem: string): string => stem.replace(/\.(pdf|json)$/i, '');

/** Normaliza un candidato a *stem* seguro, o devuelve cadena vacía si no queda nada. */
const toSafeStem = (candidate: string): string => {
  const decoded = decodeSafely(lastPathSegment(candidate.trim()));
  const sanitized = stripKnownExtension(decoded)
    .replace(FORBIDDEN_CHARS, '_')
    // Puntos y espacios finales rompen nombres de archivo en Windows.
    .replace(/[\s.]+$/g, '')
    .trim();

  if (!sanitized) return '';
  // `[object Object]` puede llegar ya materializado desde un llamante antiguo;
  // aceptarlo reintroduciría justo el defecto que este módulo corrige.
  if (/^\[object [A-Za-z]+\]$/.test(sanitized)) return '';
  return sanitized;
};

/**
 * Resuelve el nombre base (sin extensión) para descargar un documento.
 *
 * @param source `basePdf` u otro origen de nombre, de forma desconocida.
 * @param fallback Stem estable a usar cuando `source` no aporta nombre.
 */
export const resolveDocumentFileStem = (
  source: unknown,
  fallback: string = DEFAULT_DOCUMENT_FILE_STEM,
): string => {
  const safeFallback = toSafeStem(fallback) || DEFAULT_DOCUMENT_FILE_STEM;

  if (typeof source === 'string') {
    return toSafeStem(source) || safeFallback;
  }

  if (isRecord(source)) {
    for (const field of NAME_FIELDS) {
      const value = source[field];
      if (typeof value !== 'string') continue;
      const stem = toSafeStem(value);
      if (stem) return stem;
    }
    // Un objeto sin metadatos de nombre NO se serializa: cae al fallback.
    return safeFallback;
  }

  return safeFallback;
};

/** Añade la extensión exactamente una vez sobre un stem ya resuelto. */
export const withExtension = (stem: string, extension: 'pdf' | 'json'): string =>
  stem.toLowerCase().endsWith(`.${extension}`) ? stem : `${stem}.${extension}`;

/** Nombre completo del PDF exportado, listo para `download`. */
export const resolveDocumentPdfFileName = (source: unknown): string =>
  withExtension(resolveDocumentFileStem(source, DEFAULT_DOCUMENT_FILE_STEM), 'pdf');

/** Nombre completo del template exportado como JSON, listo para `download`. */
export const resolveTemplateJsonFileName = (source: unknown): string =>
  withExtension(resolveDocumentFileStem(source, DEFAULT_TEMPLATE_FILE_STEM), 'json');
