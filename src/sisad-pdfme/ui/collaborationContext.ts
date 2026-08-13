/**
 * Resolución de contexto colaborativo para schemas y destinatarios.
 *
 * Rol arquitectónico:
 * - Normaliza destinatarios/usuarios de colaboración.
 * - Resuelve recipient activo, color, nombre, rol y permisos de edición estructural.
 * - Construye el contexto efectivo usado al crear schemas.
 * - Resuelve metadata colaborativa de un schema frente al contexto actual.
 *
 * Reglas clave:
 * - El color activo aplica a schemas nuevos; no debe sobrescribir owners existentes sin intención.
 * - Roles viewer/reviewer/commenter no deben editar estructura por defecto.
 * - `ownerMode` se deriva de ownerRecipientIds si no viene explícito.
 */

import { normalizeRecipientIds, type SchemaForUI } from '@sisad-pdfme/common';
import type { CollaborationSyncConfig, SchemaCreationContext } from './designerEngine.js';
import { normalizeText } from '../shared/text.js';
import { buildRecipientColorMap } from '../recipients/recipientColorResolver.js';
export { buildRecipientColorMap } from '../recipients/recipientColorResolver.js';

export type CollaborationRecipientOption = {
  id: string;
  name: string;
  color?: string | null;
  role?: string | null;
  team?: string | null;
  tag?: string | null;
  /**
   * Datos de contacto del destinatario, usados por el autorrelleno de schemas
   * (`ui/recipientPrefill.ts`). `company` y `title` viajan aquí aunque hoy el
   * paso 1 no los rellene: el contrato queda listo y el resolver los trata como
   * ausentes mientras no haya dato.
   */
  email?: string | null;
  company?: string | null;
  title?: string | null;
};

export type CollaborationCanEditStructureContext = {
  fileId: string | null;
  activeRecipientId: string | null;
  activeRecipient: CollaborationRecipientOption | null;
  activeRecipientRole: string | null;
};

export type CollaborationCanEditStructurePolicy =
  | boolean
  | ((context: CollaborationCanEditStructureContext) => boolean);

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
  hiddenSchemaTypes?: string[];
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

const resolveCanEditStructure = (
  collaboration: CollaborationSyncConfig | undefined,
  context: CollaborationCanEditStructureContext,
) => {
  const policy = collaboration?.permissions?.canEditStructure ?? collaboration?.canEditStructure;
  if (typeof policy === 'function') return policy(context);
  if (typeof policy === 'boolean') return policy;
  const normalizedRole = normalizeText(context.activeRecipientRole).toLowerCase();
  if (normalizedRole === 'reviewer' || normalizedRole === 'viewer' || normalizedRole === 'commenter') {
    return false;
  }
  return true;
};

const normalizeNullableString = (value: unknown) => {
  const normalized = normalizeText(value);
  return normalized || null;
};

/** Convierte opciones crudas de recipients/users en una lista deduplicada y segura. */
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
      color: normalizeNullableString(candidate.color),
      role: normalizeNullableString(candidate.role),
      team: normalizeNullableString(candidate.team),
      tag: normalizeNullableString(candidate.tag),
      // El host puede nombrar el correo `email` o `emailAddress` según venga del
      // selector o del formulario de personas; se aceptan ambos.
      email: normalizeNullableString(candidate.email ?? candidate.emailAddress),
      company: normalizeNullableString(candidate.company),
      title: normalizeNullableString(candidate.title),
    });
  });

  return Array.from(next.values());
};

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

/** Construye el contexto colaborativo efectivo para creación/edición de schemas. */
export const buildEffectiveCollaborationContext = (
  collaboration: CollaborationSyncConfig | undefined,
  fileId: string | null,
): EffectiveCollaborationContext => {
  const { recipientOptions, activeRecipient, activeRecipientId } = resolveActiveRecipient(collaboration);
  const actorId = normalizeNullableString(collaboration?.actorId) || activeRecipientId;
  const actorColor = normalizeNullableString(collaboration?.actorColor) || activeRecipient?.color || null;
  const activeRecipientRole = normalizeNullableString(activeRecipient?.role);
  const ownerRecipientId = activeRecipientId || actorId || null;
  const ownerColor = activeRecipient?.color || actorColor || null;
  const hiddenSchemaTypes = Array.isArray(collaboration?.hiddenSchemaTypes)
    ? collaboration.hiddenSchemaTypes
        .map((type) => normalizeText(type).toLowerCase())
        .filter(Boolean)
    : [];

  return {
    fileId,
    actorId,
    ownerRecipientId,
    ownerRecipientIds: ownerRecipientId ? [ownerRecipientId] : [],
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
    hiddenSchemaTypes,
    canEditStructure: resolveCanEditStructure(collaboration, {
      fileId,
      activeRecipientId,
      activeRecipient,
      activeRecipientRole,
    }),
  };
};

export const resolveOwnerMode = (
  value: unknown,
  ownerRecipientIds: string[],
): 'single' | 'multi' | 'shared' | undefined => {
  const normalizedOwnerRecipientIds = Array.isArray(ownerRecipientIds) ? ownerRecipientIds : [];
  if (value === 'single' || value === 'multi' || value === 'shared') return value;
  if (normalizedOwnerRecipientIds.length > 1) return 'multi';
  if (normalizedOwnerRecipientIds.length === 1) return 'single';
  return undefined;
};

/** Resuelve estado visual/funcional de ownership de un schema. */
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
  const ownerRecipientId = normalizeNullableString(
    (schema as SchemaForUI & { ownerRecipientId?: string }).ownerRecipientId,
  ) || ownerRecipientIds[0] || null;
  const ownerMode = resolveOwnerMode(
    (schema as SchemaForUI & { ownerMode?: 'single' | 'multi' | 'shared' }).ownerMode,
    ownerRecipientIds,
  );
  const createdBy = normalizeNullableString((schema as SchemaForUI & { createdBy?: string }).createdBy) || ownerRecipientId;
  const lastModifiedBy = normalizeNullableString((schema as SchemaForUI & { lastModifiedBy?: string }).lastModifiedBy);
  const ownerRecipientName =
    normalizeNullableString((schema as SchemaForUI & { ownerRecipientName?: string }).ownerRecipientName) ||
    (ownerRecipientId ? collaborationContext?.recipientNameMap?.get(ownerRecipientId) || null : null);
  const ownerColor =
    normalizeNullableString((schema as SchemaForUI & { ownerColor?: string }).ownerColor) ||
    (ownerRecipientId ? collaborationContext?.recipientColorMap?.get(ownerRecipientId) || null : null) ||
    null;
  const userColor =
    normalizeNullableString((schema as SchemaForUI & { userColor?: string }).userColor) ||
    ownerColor ||
    (createdBy ? collaborationContext?.recipientColorMap?.get(createdBy) || null : null) ||
    null;
  const activeRecipientId =
    collaborationContext?.isGlobalView === true ? null : normalizeNullableString(collaborationContext?.activeRecipientId);
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
    'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor' | 'hiddenSchemaTypes'
  >,
) => {
  const schemaType = String((schema as SchemaForUI & { type?: string }).type || '').trim().toLowerCase();
  if (collaborationContext?.hiddenSchemaTypes?.includes(schemaType)) return false;
  if (!collaborationContext || collaborationContext.isGlobalView) return true;
  const state = resolveSchemaCollaborationState(schema, collaborationContext);
  // No-owner schemas are contextual/global → always visible.
  if (state.ownerRecipientIds.length === 0 && !state.ownerRecipientId) return true;
  // Visibility follows ASSIGNMENT (who fills the field), not authorship. The old
  // `createdBy === activeRecipientId` clause leaked schemas the active user
  // authored but that belong to another recipient — breaking "Usuario activo".
  return state.isShared || state.isOwnerActive;
};

export const filterSchemasForCollaborationView = (
  schemas: SchemaForUI[] = [],
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor'
  >,
) => schemas.filter((schema) => schemaMatchesCollaborationView(schema, collaborationContext));
