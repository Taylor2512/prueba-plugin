/**
 * schemaInteractionState — fuente de verdad compacta para bloqueo, readOnly,
 * permisos y color de owner de un schema.
 *
 * La intención es que ListView, DetailView, toolbar y overlays consuman el
 * mismo contrato en vez de recomponer `readOnly`, `locked`, `ownerColor` y
 * permisos de edición por separado.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';
import { resolveSchemaOwnerColor as resolveSchemaOwnerColorBase } from '../../../../collaboration/schemaOwnershipAppearance.js';
import type { EffectiveCollaborationContext, ResolvedSchemaCollaborationState } from '../../../collaborationContext.js';
import { resolveSchemaCollaborationState } from '../../../collaborationContext.js';

type OwnerColorContext = Pick<
  EffectiveCollaborationContext,
  'recipientOptions' | 'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor' | 'canEditStructure'
>;

export type SchemaInteractionBadge = {
  label: string;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue';
};

export type SchemaInteractionState = {
  isLocked: boolean;
  isReadOnly: boolean;
  isEditable: boolean;
  lockReason: 'read-only' | 'locked' | 'no-structure-permission' | null;
  owner: {
    id: string | null;
    name: string | null;
    color: string | null;
    mode: ResolvedSchemaCollaborationState['ownerMode'] | null;
    isActive: boolean;
    isShared: boolean;
  };
  activeUserCanEdit: boolean;
  visibleBadge: SchemaInteractionBadge | null;
  disabledControls: string[];
  collaboration: ResolvedSchemaCollaborationState;
  ownerColor: string | null;
};

export type SchemaInteractionStateContext = {
  collaborationContext?: OwnerColorContext | null;
  lock?: {
    lockedBy?: string | null;
    ownerUserId?: string | null;
    ownerDisplayName?: string | null;
    ownerColor?: string | null;
  } | null;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const resolveLockOwnerId = (schema: SchemaForUI, context?: SchemaInteractionStateContext): string | null =>
  normalizeText(context?.lock?.lockedBy) ||
  normalizeText(context?.lock?.ownerUserId) ||
  normalizeText((schema as SchemaForUI & { lock?: { lockedBy?: string } }).lock?.lockedBy) ||
  normalizeText((schema as SchemaForUI & { lockedBy?: string }).lockedBy) ||
  null;

/**
 * Resuelve el color del owner usando el mismo orden de prioridad que el resto
 * del sistema colaborativo y cae a `actorColor` si hace falta.
 */
export const resolveSchemaOwnerColor = (schema: SchemaForUI, context?: OwnerColorContext | null): string => {
  const baseColor = resolveSchemaOwnerColorBase(schema, context?.recipientOptions || []);
  if (baseColor) return baseColor;
  return normalizeText(context?.actorColor);
};

/**
 * Fuente de verdad única para el estado interactivo de un schema.
 */
export const resolveSchemaInteractionState = (
  schema: SchemaForUI,
  context?: SchemaInteractionStateContext,
): SchemaInteractionState => {
  const collaboration = resolveSchemaCollaborationState(schema, context?.collaborationContext || undefined);
  const activeUserCanEdit = context?.collaborationContext?.canEditStructure !== false;
  const isReadOnly = Boolean((schema as SchemaForUI & { readOnly?: boolean }).readOnly);
  const lockOwnerId = resolveLockOwnerId(schema, context);
  const schemaLocked = Boolean(
    (schema as SchemaForUI & { state?: string }).state === 'locked' ||
      (schema as SchemaForUI & { lock?: unknown }).lock ||
      lockOwnerId,
  );
  const isLocked = schemaLocked && !isReadOnly;
  const lockReason = isReadOnly
    ? 'read-only'
    : !activeUserCanEdit
      ? 'no-structure-permission'
      : isLocked
        ? 'locked'
        : null;
  const isEditable = !isReadOnly && !isLocked && activeUserCanEdit;
  const ownerColor =
    resolveSchemaOwnerColor(schema, context?.collaborationContext || undefined) ||
    collaboration.ownerColor ||
    collaboration.userColor ||
    null;

  const visibleBadge =
    isReadOnly
      ? { label: 'Solo lectura', color: 'gold' as const }
      : isLocked
        ? { label: 'Bloqueado para edición', color: 'error' as const }
        : !activeUserCanEdit
          ? { label: 'Sin permisos', color: 'warning' as const }
          : null;

  const disabledControls = [
    ...(isReadOnly || isLocked || !activeUserCanEdit ? ['edit', 'duplicate', 'delete', 'toggle-lock'] : []),
    ...(isReadOnly || isLocked ? ['toggle-required', 'toggle-visibility'] : []),
  ];

  return {
    isLocked,
    isReadOnly,
    isEditable,
    lockReason,
    owner: {
      id: collaboration.ownerRecipientId,
      name: collaboration.ownerRecipientName,
      color: ownerColor,
      mode: collaboration.ownerMode || null,
      isActive: collaboration.isOwnerActive,
      isShared: collaboration.isShared,
    },
    activeUserCanEdit,
    visibleBadge,
    disabledControls,
    collaboration,
    ownerColor,
  };
};
