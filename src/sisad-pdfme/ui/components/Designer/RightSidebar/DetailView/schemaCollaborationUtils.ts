import { normalizeRecipientIds as normalizeRecipientIdsShared } from '@sisad-pdfme/common';
import type { SchemaCollaborativeState } from '../../../../designerEngine.js';

export { normalizeRecipientIdsShared as normalizeRecipientIds };

export const joinRecipientIds = (value: unknown): string => normalizeRecipientIdsShared(value).join(', ');

export const resolveOwnerMode = (ownerRecipientIds: string[]) => {
  if (ownerRecipientIds.length > 1) return 'multi' as const;
  if (ownerRecipientIds.length === 1) return 'single' as const;
  return undefined;
};

export const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Borrador', color: 'default' as const };
};
