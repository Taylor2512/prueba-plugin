/**
 * schemaCollaborationUtils — helpers puros para metadata colaborativa de schemas.
 *
 * Normaliza destinatarios, resuelve modo de propietario y traduce estados
 * colaborativos a tags visuales. No depende de React para facilitar pruebas y
 * reutilización desde widgets y builders.
 */
import { normalizeRecipientIds as normalizeRecipientIdsShared } from '@sisad-pdfme/common';
export { resolveOwnerMode } from '@sisad-pdfme/ui/collaborationContext';
import type { SchemaCollaborativeState } from '@sisad-pdfme/ui/designerEngine';

/** Reexporta el normalizador compartido de destinatarios. */
export { normalizeRecipientIdsShared as normalizeRecipientIds };

/**
 * Normaliza y une destinatarios en una cadena legible.
 */
export const joinRecipientIds = (value: unknown): string => normalizeRecipientIdsShared(value).join(', ');

/**
 * Traduce estado colaborativo a tag visual del inspector.
 */
export const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Disponible', color: 'warning' as const };
};
