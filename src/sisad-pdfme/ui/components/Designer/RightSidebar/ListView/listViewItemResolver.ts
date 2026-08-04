import type { SchemaForUI } from '@sisad-pdfme/common';
import { getSchemaTypeLabel } from '../../shared/designerLabels.js';
import { resolveSchemaInteractionState } from '../../shared/schemaInteractionState.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import { normalizeText } from '../../../../../shared/text.js';

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
  // Keep the ownership line compact and explicit: when the schema is already
  // assigned to the active recipient, the accent strip is enough and the row
  // does not need a second "assigned to you" chip.
  if (interactionState.owner.isShared) {
    badges.push({ label: 'Compartido', color: interactionState.owner.color || undefined });
  } else if (!interactionState.owner.isActive && interactionState.owner.name) {
    badges.push({ label: `Asignado a ${interactionState.owner.name}`, color: interactionState.owner.color || undefined });
  }

  const explicitOwnerColor =
    normalizeText((schema as SchemaForUI & { ownerColor?: string }).ownerColor) ||
    normalizeText((schema as SchemaForUI & { recipientColor?: string }).recipientColor) ||
    normalizeText((schema as SchemaForUI & { userColor?: string }).userColor) ||
    normalizeText((schema as SchemaForUI & { __designer?: { ownerColor?: string; recipientColor?: string; collaboration?: { recipientColor?: string } } }).__designer?.collaboration?.recipientColor) ||
    normalizeText((schema as SchemaForUI & { __designer?: { ownerColor?: string; recipientColor?: string; collaboration?: { recipientColor?: string } } }).__designer?.ownerColor) ||
    normalizeText((schema as SchemaForUI & { __designer?: { ownerColor?: string; recipientColor?: string; collaboration?: { recipientColor?: string } } }).__designer?.recipientColor);

  return {
    primaryLabel,
    secondaryLabel,
    typeLabel,
    ownerColor: interactionState.ownerColor || explicitOwnerColor || null,
    badges: badges.slice(0, 3),
    documentLabel,
    pageLabel,
    isReadOnly: interactionState.isReadOnly,
    isRequired: Boolean(schema.required),
  };
};
