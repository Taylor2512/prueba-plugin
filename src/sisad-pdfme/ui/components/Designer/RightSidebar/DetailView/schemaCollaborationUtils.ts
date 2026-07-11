/**
 * schemaCollaborationUtils — helpers puros para metadata colaborativa de schemas.
 *
 * Normaliza destinatarios, resuelve modo de propietario y traduce estados
 * colaborativos a tags visuales. No depende de React para facilitar pruebas y
 * reutilización desde widgets y builders.
 */
import { normalizeRecipientIds as normalizeRecipientIdsShared } from '@sisad-pdfme/common';
import type { SchemaCollaborativeState } from '../../../../designerEngine.js';

/** Reexporta el normalizador compartido de destinatarios. */
export { normalizeRecipientIdsShared as normalizeRecipientIds };

/**
 * Normaliza y une destinatarios en una cadena legible.
 */
export const joinRecipientIds = (value: unknown): string => normalizeRecipientIdsShared(value).join(', ');

/**
 * Resuelve modo de ownership desde la cantidad de destinatarios.
 */
export const resolveOwnerMode = (ownerRecipientIds: string[]) => {
  if (ownerRecipientIds.length > 1) return 'multi' as const;
  if (ownerRecipientIds.length === 1) return 'single' as const;
  return undefined;
};

/**
 * Traduce estado colaborativo a tag visual del inspector.
 */
export const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Disponible', color: 'warning' as const };
};
