import { normalizeRecipientIds, type SchemaForUI } from '@sisad-pdfme/common';
import type { CollaborationSyncConfig, SchemaCreationContext } from './designerEngine.js';

export type CollaborationRecipientOption = {
  id: string;
  name: string;
  color?: string | null;
  role?: string | null;
  team?: string | null;
  tag?: string | null;
};

export type EffectiveCollaborationContext = Pick<
  SchemaCreationContext,
  'fileId' | 'actorId' | 'ownerRecipientId' | 'ownerRecipientIds' | 'ownerRecipientName' | 'ownerColor' | 'userColor'
> & {
  actorColor?: string | null;
  activeRecipientRole?: string | null;
  recipientOptions: CollaborationRecipientOption[];
  recipientColorMap: Map<string, string>;
  recipientNameMap: Map<string, string>;
  activeRecipientId: string | null;
  activeRecipient: CollaborationRecipientOption | null;
  isGlobalView: boolean;
  canEditStructure: boolean;
};

export type ResolvedSchemaCollaborationState = {
  ownerMode?: 'single' | 'multi' | 'shared';
  ownerRecipientId: string | null;
  ownerRecipientIds: string[];
  ownerRecipientName: string | null;
  ownerColor: string | null;
  createdBy: string | null;
  userColor: string | null;
  lastModifiedBy: string | null;
  isOwnerActive: boolean;
  isOwnerOther: boolean;
  isShared: boolean;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizeNullableText = (value: unknown) => {
  const normalized = normalizeText(value);
  return normalized || null;
};

export const normalizeCollaborationRecipients = (options: unknown): CollaborationRecipientOption[] => {
  if (!Array.isArray(options)) return [];

  const next = new Map<string, CollaborationRecipientOption>();

  options.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    const candidate = entry as Record<string, unknown>;
    const id = normalizeText(candidate.id);
    if (!id) return;
    if (next.has(id)) return;

    next.set(id, {
      id,
      name: normalizeText(candidate.name) || normalizeText(candidate.tag) || id,
      color: normalizeNullableText(candidate.color),
      role: normalizeNullableText(candidate.role),
      team: normalizeNullableText(candidate.team),
      tag: normalizeNullableText(candidate.tag),
    });
  });

  return Array.from(next.values());
};

export const buildRecipientColorMap = (recipientOptions: CollaborationRecipientOption[] = []) =>
  new Map(
    recipientOptions
      .map((recipient) => [recipient.id, normalizeText(recipient.color)] as const)
      .filter((entry) => Boolean(entry[0] && entry[1])),
  );

export const buildRecipientNameMap = (recipientOptions: CollaborationRecipientOption[] = []) =>
  new Map(
    recipientOptions
      .map((recipient) => [recipient.id, normalizeText(recipient.name || recipient.tag)] as const)
      .filter((entry) => Boolean(entry[0] && entry[1])),
  );

export const resolveActiveRecipient = (
  collaboration: Pick<CollaborationSyncConfig, 'recipientOptions' | 'users' | 'activeRecipientId' | 'activeUserId' | 'actorId'> = {},
) => {
  const recipientOptions = normalizeCollaborationRecipients(collaboration.recipientOptions || collaboration.users);
  if (recipientOptions.length === 0) return { recipientOptions, activeRecipient: null, activeRecipientId: null };

  const requestedId =
    normalizeText(collaboration.activeRecipientId) ||
    normalizeText(collaboration.activeUserId) ||
    normalizeText(collaboration.actorId);
  const activeRecipient =
    recipientOptions.find((recipient) => recipient.id === requestedId) || recipientOptions[0] || null;

  return {
    recipientOptions,
    activeRecipient,
    activeRecipientId: activeRecipient?.id || null,
  };
};

export const buildEffectiveCollaborationContext = (
  collaboration: CollaborationSyncConfig | undefined,
  fileId: string | null,
): EffectiveCollaborationContext => {
  const { recipientOptions, activeRecipient, activeRecipientId } = resolveActiveRecipient(collaboration);
  const actorId = normalizeNullableText(collaboration?.actorId) || activeRecipientId;
  const actorColor = normalizeNullableText(collaboration?.actorColor) || activeRecipient?.color || null;
  const activeRecipientRole = normalizeNullableText(activeRecipient?.role);
  const ownerRecipientId = activeRecipientId || actorId || null;
  const ownerColor = activeRecipient?.color || actorColor || null;

  return {
    fileId,
    actorId,
    ownerRecipientId,
    ownerRecipientIds: ownerRecipientId ? [ownerRecipientId] : undefined,
    ownerRecipientName: activeRecipient?.name || null,
    ownerColor,
    userColor: ownerColor,
    actorColor,
    recipientOptions,
    recipientColorMap: buildRecipientColorMap(recipientOptions),
    recipientNameMap: buildRecipientNameMap(recipientOptions),
    activeRecipientId,
    activeRecipient,
    activeRecipientRole,
    isGlobalView: collaboration?.isGlobalView === true,
    canEditStructure: !['reviewer', 'viewer'].includes(activeRecipientRole || ''),
  };
};

export const resolveOwnerMode = (
  value: unknown,
  ownerRecipientIds: string[],
): 'single' | 'multi' | 'shared' | undefined => {
  if (value === 'single' || value === 'multi' || value === 'shared') return value;
  if (ownerRecipientIds.length > 1) return 'multi';
  if (ownerRecipientIds.length === 1) return 'single';
  return undefined;
};

export const resolveSchemaCollaborationState = (
  schema: SchemaForUI,
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor'
  >,
): ResolvedSchemaCollaborationState => {
  const ownerRecipientIds = normalizeRecipientIds(
    (schema as SchemaForUI & { ownerRecipientIds?: string[] | string; ownerRecipientId?: string }).ownerRecipientIds ||
      (schema as SchemaForUI & { ownerRecipientId?: string }).ownerRecipientId,
  );
  const ownerRecipientId = normalizeNullableText(
    (schema as SchemaForUI & { ownerRecipientId?: string }).ownerRecipientId,
  ) || ownerRecipientIds[0] || null;
  const ownerMode = resolveOwnerMode(
    (schema as SchemaForUI & { ownerMode?: 'single' | 'multi' | 'shared' }).ownerMode,
    ownerRecipientIds,
  );
  const createdBy = normalizeNullableText((schema as SchemaForUI & { createdBy?: string }).createdBy) || ownerRecipientId;
  const lastModifiedBy = normalizeNullableText((schema as SchemaForUI & { lastModifiedBy?: string }).lastModifiedBy);
  const ownerRecipientName =
    normalizeNullableText((schema as SchemaForUI & { ownerRecipientName?: string }).ownerRecipientName) ||
    (ownerRecipientId ? collaborationContext?.recipientNameMap?.get(ownerRecipientId) || null : null);
  const ownerColor =
    normalizeNullableText((schema as SchemaForUI & { ownerColor?: string }).ownerColor) ||
    (ownerRecipientId ? collaborationContext?.recipientColorMap?.get(ownerRecipientId) || null : null) ||
    null;
  const userColor =
    normalizeNullableText((schema as SchemaForUI & { userColor?: string }).userColor) ||
    ownerColor ||
    (createdBy ? collaborationContext?.recipientColorMap?.get(createdBy) || null : null) ||
    collaborationContext?.actorColor ||
    null;
  const activeRecipientId =
    collaborationContext?.isGlobalView === true ? null : normalizeNullableText(collaborationContext?.activeRecipientId);
  const isShared = ownerMode === 'shared';
  const hasActiveOwnership =
    Boolean(activeRecipientId) && (ownerRecipientIds.includes(activeRecipientId as string) || ownerRecipientId === activeRecipientId);

  return {
    ownerMode,
    ownerRecipientId,
    ownerRecipientIds,
    ownerRecipientName,
    ownerColor: ownerColor || userColor,
    createdBy,
    userColor,
    lastModifiedBy,
    isOwnerActive: Boolean(activeRecipientId) && hasActiveOwnership,
    isOwnerOther: Boolean(activeRecipientId) && ownerRecipientIds.length > 0 && !hasActiveOwnership && !isShared,
    isShared,
  };
};

export const schemaMatchesCollaborationView = (
  schema: SchemaForUI,
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor'
  >,
) => {
  if (!collaborationContext || collaborationContext.isGlobalView) return true;
  const state = resolveSchemaCollaborationState(schema, collaborationContext);
  return state.isShared || state.isOwnerActive || normalizeNullableText(state.createdBy) === normalizeNullableText(collaborationContext.activeRecipientId);
};

export const filterSchemasForCollaborationView = (
  schemas: SchemaForUI[] = [],
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor'
  >,
) => schemas.filter((schema) => schemaMatchesCollaborationView(schema, collaborationContext));
