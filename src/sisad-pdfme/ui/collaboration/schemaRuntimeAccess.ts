/**
 * schemaRuntimeAccess — single contract for "can this schema be seen / edited"
 * given the runtime mode and the active recipient / view.
 *
 * Source of truth: reuses resolveSchemaCollaborationState (collaborationContext)
 * so visibility/ownership logic is NOT duplicated. This module only layers the
 * runtime-mode rules (designer/form/viewer/pdf) on top and returns one flat
 * RuntimeSchemaAccess object that every renderer/counter can consume.
 *
 * No CSS, no display:none, no opacity — visibility here is a data decision.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  resolveSchemaCollaborationState,
  type CollaborationRecipientOption,
  type EffectiveCollaborationContext,
} from '../collaborationContext.js';

export type RuntimeMode = 'designer' | 'form' | 'viewer' | 'pdf';

export type RuntimeSchemaAccessReason =
  | 'active-owner'
  | 'shared'
  | 'global-view'
  | 'readonly'
  | 'locked'
  | 'hidden'
  | 'other-recipient'
  | 'no-owner'
  | 'designer'
  | 'invalid-mode';

export type RuntimeSchemaAccess = {
  visible: boolean;
  editable: boolean;
  readonly: boolean;
  reason: RuntimeSchemaAccessReason;
  ownerRecipientId: string | null;
  ownerRecipientIds: string[];
  ownerColor: string | null;
  activeRecipientId: string | null;
  mode: RuntimeMode;
  isGlobalView: boolean;
};

type CollabCtx = Pick<
  EffectiveCollaborationContext,
  | 'recipientColorMap'
  | 'recipientNameMap'
  | 'activeRecipientId'
  | 'activeRecipient'
  | 'isGlobalView'
  | 'actorColor'
  | 'canEditStructure'
  | 'actorId'
>;

const boolField = (schema: SchemaForUI, key: string): boolean =>
  Boolean((schema as SchemaForUI & Record<string, unknown>)[key]);

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const normalizeNullableText = (value: unknown): string | null => {
  const normalized = normalizeText(value);
  return normalized || null;
};

const resolveLockOwnerLabel = (
  lockOwnerId: string | null,
  collaborationContext?: CollabCtx,
  activeRecipient?: CollaborationRecipientOption | null,
): string => {
  if (!lockOwnerId) return '';
  return collaborationContext?.recipientNameMap?.get(lockOwnerId) || activeRecipient?.name || lockOwnerId;
};

export type SchemaAccessState = {
  ownerLabel: string;
  hasCollaborationLock: boolean;
  isLockedByMe: boolean;
  isLockedByOther: boolean;
  lockedByLabel: string;
  isObjectLocked: boolean;
  isReadonly: boolean;
  canEdit: boolean;
  canMove: boolean;
  canResize: boolean;
  canDelete: boolean;
  contextMenuLockLabel: string;
  contextMenuLockDisabled: boolean;
  inspectorStatusLabel: string;
  inspectorStatusTone: 'success' | 'warning' | 'error' | 'processing';
};

const resolveAccessTone = (
  hasCollaborationLock: boolean,
  isLockedByMe: boolean,
  isLockedByOther: boolean,
  isObjectLocked: boolean,
): SchemaAccessState['inspectorStatusTone'] => {
  if (isLockedByOther) return 'error';
  if (isLockedByMe || hasCollaborationLock) return 'success';
  if (isObjectLocked) return 'warning';
  return 'warning';
};

/**
 * Single access resolver shared by inspector, toolbar and canvas menus.
 * Keeps collaboration lock, object protection and readonly copy separated.
 */
export const resolveSchemaAccessState = (
  schema: SchemaForUI,
  collaborationContext?: CollabCtx,
  activeRecipient?: CollaborationRecipientOption | null,
): SchemaAccessState => {
  const state = resolveSchemaCollaborationState(schema, collaborationContext);
  const schemaRecord = schema as SchemaForUI & {
    lock?: { lockedBy?: string | null; lockedAt?: number | null; reason?: string | null };
    readOnly?: boolean;
    readonly?: boolean;
    locked?: boolean;
    ownerRecipientName?: string | null;
    ownerRecipientId?: string | null;
  };

  const isReadonly = boolField(schema, 'readOnly') || boolField(schema, 'readonly');
  const isObjectLocked = boolField(schema, 'locked');
  const hasCollaborationLock = Boolean(
    schema.state === 'locked' ||
      schemaRecord.lock?.lockedBy ||
      schemaRecord.lock?.lockedAt ||
      schemaRecord.lock?.reason,
  );

  const currentActorId = normalizeText(collaborationContext?.actorId);
  const currentRecipientId = normalizeText(collaborationContext?.activeRecipientId);
  const lockOwnerId = normalizeNullableText(schemaRecord.lock?.lockedBy) || normalizeNullableText(state.ownerRecipientId);
  const isLockedByMe = Boolean(
    hasCollaborationLock &&
      lockOwnerId &&
      [currentActorId, currentRecipientId].filter(Boolean).includes(lockOwnerId),
  );
  const isLockedByOther = Boolean(hasCollaborationLock && !isLockedByMe);
  const ownerLabel =
    normalizeNullableText(state.ownerRecipientName) ||
    resolveLockOwnerLabel(state.ownerRecipientId, collaborationContext, activeRecipient) ||
    'Sin asignar';
  const lockedByLabel =
    isLockedByOther || isLockedByMe
      ? resolveLockOwnerLabel(lockOwnerId, collaborationContext, activeRecipient)
      : '';

  const canEdit = Boolean(
    collaborationContext?.canEditStructure !== false &&
      !isReadonly &&
      !isObjectLocked &&
      (!hasCollaborationLock || isLockedByMe),
  );

  return {
    ownerLabel,
    hasCollaborationLock,
    isLockedByMe,
    isLockedByOther,
    lockedByLabel,
    isObjectLocked,
    isReadonly,
    canEdit,
    canMove: canEdit,
    canResize: canEdit,
    canDelete: canEdit,
    contextMenuLockLabel: isLockedByOther
      ? `Bloqueado por ${lockedByLabel || 'otro usuario'}`
      : isLockedByMe
        ? 'Liberar edición'
        : isObjectLocked
          ? 'Desbloquear posición'
          : 'Bloquear edición',
    contextMenuLockDisabled: isLockedByOther || collaborationContext?.canEditStructure === false,
    inspectorStatusLabel: isLockedByOther
      ? `Bloqueado por ${lockedByLabel || 'otro usuario'}`
      : isLockedByMe
        ? 'En edición por ti'
        : isObjectLocked
          ? 'Bloqueado'
          : 'Disponible',
    inspectorStatusTone: resolveAccessTone(hasCollaborationLock, isLockedByMe, isLockedByOther, isObjectLocked),
  };
};

/**
 * Resolves the runtime access for one schema. Pure: same inputs → same output.
 * Rules mirror the TASK-RUNTIME-001 matrix (hidden/locked/readonly precedence,
 * then mode + active-recipient / global-view).
 */
export const resolveRuntimeSchemaAccess = (
  schema: SchemaForUI,
  mode: RuntimeMode,
  collaborationContext?: CollabCtx,
): RuntimeSchemaAccess => {
  const state = resolveSchemaCollaborationState(schema, collaborationContext);
  const isGlobalView = collaborationContext?.isGlobalView === true;
  const activeRecipientId = isGlobalView ? null : collaborationContext?.activeRecipientId ?? null;

  const base = {
    ownerRecipientId: state.ownerRecipientId,
    ownerRecipientIds: state.ownerRecipientIds,
    ownerColor: state.ownerColor,
    activeRecipientId,
    mode,
    isGlobalView,
  };

  const hidden = boolField(schema, 'hidden');
  const locked = boolField(schema, 'locked');
  const readOnly = boolField(schema, 'readOnly') || boolField(schema, 'readonly');

  // 1. hidden wins everywhere.
  if (hidden) {
    return { ...base, visible: false, editable: false, readonly: true, reason: 'hidden' };
  }

  // Invalid / unknown mode: visible, never editable.
  if (mode !== 'designer' && mode !== 'form' && mode !== 'viewer' && mode !== 'pdf') {
    return { ...base, visible: true, editable: false, readonly: true, reason: 'invalid-mode' };
  }

  // Recipient visibility is independent of mode: global view (or pdf generation)
  // shows everything; otherwise a schema is visible only to its owner / when
  // shared / when it has no owner (contextual/global). Designer with
  // Vista=Usuario activo MUST honor this — it is not "show all".
  const noOwner = state.ownerRecipientIds.length === 0 && !state.ownerRecipientId;
  const visibleByRecipient =
    isGlobalView || mode === 'pdf' || noOwner || state.isShared || state.isOwnerActive;

  if (!visibleByRecipient) {
    return { ...base, visible: false, editable: false, readonly: true, reason: 'other-recipient' };
  }

  // 4. designer: visible (per recipient rule above); structural editability gated.
  if (mode === 'designer') {
    const canStructure = collaborationContext?.canEditStructure !== false;
    return {
      ...base,
      visible: true,
      editable: canStructure && !locked,
      readonly: locked || readOnly,
      reason: state.isShared ? 'shared' : state.isOwnerActive ? 'active-owner' : 'designer',
    };
  }

  // 7/8. viewer + pdf are never editable.
  if (mode === 'viewer' || mode === 'pdf') {
    return { ...base, visible: true, editable: false, readonly: true, reason: state.isShared ? 'shared' : 'global-view' };
  }

  // 2/3. locked / readonly: visible, not editable.
  if (locked) return { ...base, visible: true, editable: false, readonly: true, reason: 'locked' };
  if (readOnly) return { ...base, visible: true, editable: false, readonly: true, reason: 'readonly' };

  // 5/6. form: editable only for the active owner (or shared), never other recipients.
  const editable = state.isShared || state.isOwnerActive;
  if (!editable) {
    return { ...base, visible: true, editable: false, readonly: true, reason: isGlobalView ? 'global-view' : 'other-recipient' };
  }
  return {
    ...base,
    visible: true,
    editable: true,
    readonly: false,
    reason: state.isShared ? 'shared' : 'active-owner',
  };
};

/** Convenience: counters parity — same rule the renderers must use. */
export const countRuntimeAccess = (
  schemas: SchemaForUI[],
  mode: RuntimeMode,
  collaborationContext?: CollabCtx,
): { visible: number; editable: number; locked: number } => {
  let visible = 0;
  let editable = 0;
  let locked = 0;
  for (const schema of schemas) {
    const access = resolveRuntimeSchemaAccess(schema, mode, collaborationContext);
    if (access.visible) visible += 1;
    if (access.editable) editable += 1;
    if (access.reason === 'locked') locked += 1;
  }
  return { visible, editable, locked };
};
