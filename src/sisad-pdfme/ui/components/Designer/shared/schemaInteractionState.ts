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
import { normalizeText } from '../../../../shared/text.js';

type OwnerColorContext = Pick<
  EffectiveCollaborationContext,
  | 'recipientOptions'
  | 'recipientColorMap'
  | 'recipientNameMap'
  | 'activeRecipientId'
  | 'isGlobalView'
  | 'actorColor'
  | 'canEditStructure'
  | 'actorId'
  | 'activeRecipient'
>;

type SchemaInteractionBadge = {
  label: string;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue';
};

type SchemaInteractionStatusTone = 'neutral' | 'info' | 'warning' | 'danger' | 'success';

export type SchemaInteractionState = {
  collaborationLock: 'none' | 'mine' | 'other' | 'unknown';
  objectLocked: boolean;
  readonly: boolean;
  canEditProperties: boolean;
  canMove: boolean;
  canResize: boolean;
  canDelete: boolean;
  canReassign: boolean;
  statusLabel: string;
  statusTone: SchemaInteractionStatusTone;
  lockOwnerId: string | null;
  lockOwnerLabel: string | null;
  isLocked: boolean;
  isReadOnly: boolean;
  isEditable: boolean;
  /** Alias  directos (no recalculan nada). */
  isObjectLocked: boolean;
  isReadonly: boolean;
  canEdit: boolean;
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

const resolveInteractionLockOwnerLabel = (
  lockOwnerId: string | null,
  collaborationContext?: OwnerColorContext | null,
  activeRecipient?: { id?: string | null; name?: string | null } | null,
): string => {
  if (!lockOwnerId) return '';
  if (activeRecipient?.id && activeRecipient.id === lockOwnerId && activeRecipient.name) {
    return activeRecipient.name;
  }
  return (
    collaborationContext?.recipientNameMap?.get(lockOwnerId) ||
    lockOwnerId
  );
};

const resolveLockOwnerId = (schema: SchemaForUI, context?: SchemaInteractionStateContext): string | null =>
  normalizeText(context?.lock?.lockedBy) ||
  normalizeText(context?.lock?.ownerUserId) ||
  normalizeText((schema as SchemaForUI & { lock?: { lockedBy?: string } }).lock?.lockedBy) ||
  normalizeText((schema as SchemaForUI & { lock?: { ownerUserId?: string } }).lock?.ownerUserId) ||
  normalizeText((schema as SchemaForUI & { lockedByActorId?: string }).lockedByActorId) ||
  normalizeText((schema as SchemaForUI & { lockedBy?: string }).lockedBy) ||
  null;

/**
 * Resuelve el color del owner usando la metadata persistida y los recipients
 * registrados. El color activo del usuario no debe recolorear schemas ya
 * existentes.
 */
const resolveDesignerSchemaOwnerColor = (schema: SchemaForUI, context?: OwnerColorContext | null): string => {
  return resolveSchemaOwnerColorBase(schema, context?.recipientOptions || []);
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
  const isReadOnly = Boolean(
    (schema as SchemaForUI & { readOnly?: boolean; readonly?: boolean }).readOnly ||
      (schema as SchemaForUI & { readOnly?: boolean; readonly?: boolean }).readonly,
  );
  const lockOwnerId = resolveLockOwnerId(schema, context);
  const lockRecord = (schema as SchemaForUI & {
    state?: string;
    locked?: boolean;
    lock?: {
      lockedBy?: string | null;
      ownerUserId?: string | null;
      ownerDisplayName?: string | null;
      reason?: string | null;
    } | null;
  }).lock;
  const hasCollaborationLock = Boolean(
    (schema as SchemaForUI & { state?: string }).state === 'locked' ||
      lockRecord?.lockedBy ||
      lockRecord?.ownerUserId ||
      lockOwnerId ||
      lockRecord?.reason,
  );
  const objectLocked = Boolean((schema as SchemaForUI & { locked?: boolean }).locked);
  const collaborationLock: SchemaInteractionState['collaborationLock'] = hasCollaborationLock
    ? lockOwnerId
      ? [context?.collaborationContext?.actorId, context?.collaborationContext?.activeRecipientId]
          .filter(Boolean)
          .includes(lockOwnerId)
        ? 'mine'
        : 'other'
      : 'unknown'
    : 'none';
  const isLocked = collaborationLock !== 'none' || objectLocked;
  const lockReason = isReadOnly
    ? 'read-only'
    : !activeUserCanEdit
      ? 'no-structure-permission'
      : collaborationLock !== 'none' || objectLocked
        ? 'locked'
        : null;
  const canEditProperties = Boolean(activeUserCanEdit && !isReadOnly && collaborationLock !== 'other' && collaborationLock !== 'unknown');
  const canMove = Boolean(canEditProperties && !objectLocked);
  const canResize = Boolean(canEditProperties && !objectLocked);
  const canDelete = Boolean(canEditProperties && !objectLocked);
  const canReassign = Boolean(activeUserCanEdit && collaborationLock !== 'other');
  const isEditable = canEditProperties;
  const ownerColor =
    resolveDesignerSchemaOwnerColor(schema, context?.collaborationContext || undefined) ||
    collaboration.ownerColor ||
    collaboration.userColor ||
    null;

  const statusLabel =
    !activeUserCanEdit
      ? 'Sin permiso de edición'
      : collaborationLock === 'other'
        ? `Bloqueado por ${resolveInteractionLockOwnerLabel(lockOwnerId, context?.collaborationContext || undefined, context?.collaborationContext?.activeRecipient || null) || 'otro usuario'}`
        : collaborationLock === 'mine'
          ? 'En edición por ti'
          : isReadOnly
            ? 'Solo lectura'
            : objectLocked
              ? 'Posición bloqueada'
              : collaborationLock === 'unknown'
                ? 'Bloqueo sin responsable'
                : 'Disponible';

  const statusTone: SchemaInteractionStatusTone =
    !activeUserCanEdit
      ? 'danger'
      : collaborationLock === 'other'
        ? 'danger'
        : collaborationLock === 'mine'
          ? 'success'
          : isReadOnly
            ? 'warning'
            : objectLocked
              ? 'info'
              : collaborationLock === 'unknown'
                ? 'warning'
                : 'neutral';

  const visibleBadge: SchemaInteractionBadge | null =
    statusLabel === 'Disponible'
      ? null
      : {
          label: statusLabel,
          color:
            statusTone === 'danger'
              ? 'error'
              : statusTone === 'success'
                ? 'success'
                : statusTone === 'warning'
                  ? 'warning'
                  : statusTone === 'info'
                    ? 'processing'
                    : 'default',
        };

  const disabledControls = [
    ...(!canEditProperties ? ['edit', 'duplicate', 'delete'] : []),
    ...(objectLocked ? ['move', 'resize'] : []),
    ...(isReadOnly ? ['toggle-required', 'toggle-visibility'] : []),
  ];

  return {
    collaborationLock,
    objectLocked,
    readonly: isReadOnly,
    canEditProperties,
    canMove,
    canResize,
    canDelete,
    canReassign,
    statusLabel,
    statusTone,
    lockOwnerId,
    lockOwnerLabel:
      lockOwnerId
        ? resolveInteractionLockOwnerLabel(lockOwnerId, context?.collaborationContext || undefined, context?.collaborationContext?.activeRecipient || null) || null
        : null,
    isLocked,
    isReadOnly,
    isEditable,
    isObjectLocked: objectLocked,
    isReadonly: isReadOnly,
    canEdit: canEditProperties,
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
