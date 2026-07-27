/**
 * Normaliza texto de forma laxa para valores unknown o payloads legacy.
 */
export const normalizeLooseText = (value: unknown): string => String(value || '').trim();

/**
 * Normalización estricta para consumidores compartidos que solo aceptan
 * strings reales.
 */
export const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
