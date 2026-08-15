/**
 * Identidad visual del firmante para el flujo de adopción de firma.
 *
 * Separa lo determinista (nombre, iniciales, catálogo de estilos) de lo que
 * necesita DOM (rasterizar el trazo). Así el núcleo es testeable sin navegador
 * y el rasterizado queda aislado en la capa de render.
 *
 * `signature` pinta el nombre completo estilizado; `initials`, las iniciales.
 * Un mismo perfil adoptado alimenta ambos schemas.
 */

const normalizeText = (value: unknown): string => String(value ?? '').trim();

/** Tokeniza respetando Unicode: acentos y grafemas compuestos cuentan igual. */
const tokenizeName = (fullName: string): string[] => {
  const normalized = normalizeText(fullName);
  if (!normalized) return [];

  const matches = normalized.match(/[\p{L}\p{N}]+/gu);
  if (Array.isArray(matches) && matches.length > 0) return matches;

  return normalized.split(/\s+/).filter(Boolean);
};

/** Colapsa espacios sin alterar el nombre legal del firmante. */
export const normalizeSignerName = (fullName: unknown = ''): string =>
  normalizeText(fullName).replace(/\s+/g, ' ');

export const MAX_SIGNER_INITIALS = 4;

/**
 * Primera letra de cada token significativo, hasta 4 caracteres.
 *
 * Determinista y Unicode-safe: `Array.from` evita partir un grafema compuesto
 * por la mitad.
 */
export const deriveSignerInitials = (fullName: unknown = ''): string =>
  tokenizeName(normalizeText(fullName))
    .map((token) => Array.from(token)[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, MAX_SIGNER_INITIALS);

/** Normaliza iniciales provistas por el backend o escritas por el usuario. */
export const normalizeSignerInitials = (value: unknown = ''): string =>
  normalizeText(value).toUpperCase().slice(0, MAX_SIGNER_INITIALS);

/**
 * Clave de aislamiento del perfil adoptado.
 *
 * Debe incluir destinatario y solicitud: si dos destinatarios comparten clave,
 * el segundo heredaría la firma del primero.
 *
 * `documentId` es opcional a propósito, porque las dos políticas son legítimas
 * y sólo el host sabe cuál aplica:
 *
 * - **omitido** — el firmante adopta su estilo UNA vez para toda la solicitud
 *   y lo reutiliza en todos sus documentos, que es lo habitual en una firma
 *   de varias piezas;
 * - **presente** — cada documento exige su propia ceremonia de adopción.
 *
 * Sin el parámetro no había forma de expresar la segunda: la clave no podía
 * distinguir documentos y el aislamiento entre ellos era inalcanzable.
 * Omitirlo produce exactamente la clave anterior, así que nada existente
 * cambia de comportamiento.
 */
export const buildSignatureProfileKey = ({
  requestId,
  recipientId,
  documentId,
}: {
  requestId?: unknown;
  recipientId?: unknown;
  documentId?: unknown;
} = {}): string | null => {
  const safeRequestId = normalizeText(requestId);
  const safeRecipientId = normalizeText(recipientId);
  if (!safeRequestId || !safeRecipientId) return null;

  const safeDocumentId = normalizeText(documentId);
  const base = `sisad-signature:${safeRequestId}:${safeRecipientId}`;
  return safeDocumentId ? `${base}:${safeDocumentId}` : base;
};
