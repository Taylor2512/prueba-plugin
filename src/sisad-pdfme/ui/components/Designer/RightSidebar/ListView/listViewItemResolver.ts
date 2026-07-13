import type { SchemaForUI } from '@sisad-pdfme/common';
import { getSchemaTypeLabel } from '../../shared/designerLabels.js';
import { resolveSchemaInteractionState } from '../../shared/schemaInteractionState.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';

export type ListViewItemDescriptor = {
  primaryLabel: string;
  secondaryLabel: string;
  typeLabel: string;
  ownerColor: string | null;
  badges: Array<{ label: string; color?: string }>;
  documentLabel: string;
  pageLabel: string;
  isReadOnly: boolean;
  isRequired: boolean;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const resolveListViewItemDescriptor = (
  schema: SchemaForUI,
  collaborationContext?: EffectiveCollaborationContext,
): ListViewItemDescriptor => {
  const interactionState = resolveSchemaInteractionState(schema, collaborationContext ? { collaborationContext } : undefined);
  const primaryLabel =
    normalizeText((schema as SchemaForUI & { label?: string }).label) ||
    normalizeText(schema.name) ||
    'Campo';
  const secondaryLabel = normalizeText(schema.name) && normalizeText(schema.name) !== primaryLabel ? normalizeText(schema.name) : '';
  const typeLabel = getSchemaTypeLabel(schema.type);
  const documentLabel =
    normalizeText((schema as SchemaForUI & { documentId?: string }).documentId) ||
    normalizeText((schema as SchemaForUI & { fileId?: string }).fileId) ||
    normalizeText((schema as SchemaForUI & { fileTemplateId?: string }).fileTemplateId);
  const pageNumber = typeof schema.pageNumber === 'number' && Number.isFinite(schema.pageNumber) ? Math.trunc(schema.pageNumber) : 0;
  const pageLabel = pageNumber > 0 ? `Pág. ${pageNumber}` : '';
  const badges: Array<{ label: string; color?: string }> = [];

  if (interactionState.visibleBadge) {
    badges.push({ label: interactionState.visibleBadge.label, color: interactionState.visibleBadge.color });
  }
  // Keep the ownership line compact: a single chip per row instead of stacking
  // "Propio" + owner name on every field. When the field belongs to the active
  // user the redundant name is dropped; fields owned by someone else surface the
  // owner name (the distinguishing information).
  if (interactionState.owner.isShared) {
    badges.push({ label: 'Compartido', color: interactionState.owner.color || undefined });
  } else if (interactionState.owner.isActive) {
    badges.push({ label: 'Propio', color: interactionState.owner.color || undefined });
  } else if (interactionState.owner.name) {
    badges.push({ label: interactionState.owner.name, color: interactionState.owner.color || undefined });
  }

  return {
    primaryLabel,
    secondaryLabel,
    typeLabel,
    ownerColor: interactionState.ownerColor,
    badges: badges.slice(0, 3),
    documentLabel,
    pageLabel,
    isReadOnly: interactionState.isReadOnly,
    isRequired: Boolean(schema.required),
  };
};
