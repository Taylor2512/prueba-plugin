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
 */
export const buildSignatureProfileKey = ({
  requestId,
  recipientId,
}: {
  requestId?: unknown;
  recipientId?: unknown;
} = {}): string | null => {
  const safeRequestId = normalizeText(requestId);
  const safeRecipientId = normalizeText(recipientId);
  if (!safeRequestId || !safeRecipientId) return null;
  return `sisad-signature:${safeRequestId}:${safeRecipientId}`;
};
