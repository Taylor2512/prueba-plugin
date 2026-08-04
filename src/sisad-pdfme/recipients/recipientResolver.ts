/**
 * recipientResolver — resolución de owner/apariencia y contextos derivados.
 *
 * Rol arquitectónico:
 * - `resolveSchemaOwnerAppearance` es EL resolver de owner para Canvas,
 *   ListView y DetailView: reutiliza `resolveSchemaOwnerColor` (la cadena de
 *   prioridad legada) con los recipients del registry como colaboradores.
 * - `buildCollaborationSyncFromRegistry` deriva el bloque
 *   `designerEngine.collaboration` desde el registry, de modo que el
 *   `collaborationContext` interno del Designer (y con él Canvas/ListView/
 *   DetailView/AssignmentDialog) nace de la misma fuente. Cero mapas duplicados.
 * - `buildAssignmentContextFromRegistry` alimenta el flujo de reasignación
 *   (`SchemaAssignmentDialog` / `schemaAssignmentService`).
 */
import { normalizeRecipientIds } from '@sisad-pdfme/common';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { resolveSchemaOwnerColor } from '../collaboration/schemaOwnershipAppearance.js';
import type {
  OwnerAwareSchemaLike,
  SchemaOwnerAppearance,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryState,
} from './recipientTypes.js';

const normalizeRecipientText = (value: unknown) => String(value ?? '').trim();

type RegistryLike = SisadPdfmeRecipientRegistry | SisadPdfmeRecipientRegistryState;

const toState = (registry: RegistryLike): SisadPdfmeRecipientRegistryState =>
  typeof (registry as SisadPdfmeRecipientRegistry).getState === 'function'
    ? (registry as SisadPdfmeRecipientRegistry).getState()
    : (registry as SisadPdfmeRecipientRegistryState);

/** Resuelve el ownerRecipientId efectivo de un schema (id simple o lista). */
export const resolveOwnerRecipientId = (schema: OwnerAwareSchemaLike): string | null => {
  const ownerIds = normalizeRecipientIds(schema.ownerRecipientIds || schema.ownerRecipientId);
  return (
    normalizeRecipientText(schema.ownerRecipientId) ||
    ownerIds[0] ||
    normalizeRecipientText(schema.recipientId) ||
    null
  );
};

/**
 * Resolver único de apariencia de owner: mismo output para Canvas, ListView y
 * DetailView. El color reutiliza la prioridad legada (ownerColor → userColor →
 * recipientColor → __designer.* → color del recipient registrado).
 */
export const resolveSchemaOwnerAppearance = (
  schema: OwnerAwareSchemaLike,
  registry: RegistryLike,
): SchemaOwnerAppearance => {
  const state = toState(registry);
  const ownerIds = normalizeRecipientIds(schema.ownerRecipientIds || schema.ownerRecipientId);
  const ownerRecipientId = resolveOwnerRecipientId(schema);
  const owner = ownerRecipientId ? state.byId.get(ownerRecipientId) ?? null : null;
  const isShared = schema.ownerMode === 'shared';
  const isUnassigned = !isShared && !ownerRecipientId && ownerIds.length === 0;

  const ownerColor = resolveSchemaOwnerColor(
    schema as unknown as SchemaForUI,
    state.recipients as Array<{ id?: string | null; color?: string | null }>,
  );

  const ownerLabel =
    owner?.label ||
    normalizeRecipientText(schema.ownerRecipientName) ||
    (ownerRecipientId ? state.labelById.get(ownerRecipientId) ?? ownerRecipientId : '');

  const activeRecipientId = state.activeRecipientId;
  const isOwnedByActiveRecipient = Boolean(
    activeRecipientId &&
      (ownerRecipientId === activeRecipientId || ownerIds.includes(activeRecipientId)),
  );

  return {
    ownerRecipientId,
    ownerLabel,
    ownerColor,
    isOwnedByActiveRecipient,
    isShared,
    isUnassigned,
  };
};

/**
 * Opción de recipient con la forma que consume `collaborationContext`
 * (`CollaborationRecipientOption`): tipado estructural para no acoplar este
 * módulo a `ui/`.
 */
export type RegistryRecipientOption = {
  id: string;
  name: string;
  color?: string | null;
  role?: string | null;
};

/** Mapea recipients del registry a opciones de colaboración de la UI. */
export const buildRecipientOptionsFromRegistry = (
  registry: RegistryLike,
): RegistryRecipientOption[] =>
  toState(registry).recipients.map((recipient) => ({
    id: recipient.id,
    name: recipient.label,
    color: recipient.color ?? null,
    role: recipient.role ?? null,
  }));

export type CollaborationSyncFromRegistryOptions = {
  /** Bloque collaboration previo del designerEngine (url/provider/etc.). */
  base?: Record<string, unknown> | null;
  enabled?: boolean;
  canEditStructure?: boolean | ((context: unknown) => boolean);
  isGlobalView?: boolean;
};

/**
 * Deriva `designerEngine.collaboration` desde el registry. El Designer interno
 * llama `buildEffectiveCollaborationContext` sobre este bloque, así que
 * recipientOptions/users/activeRecipientId quedan con una única fuente.
 */
export const buildCollaborationSyncFromRegistry = (
  registry: RegistryLike,
  options: CollaborationSyncFromRegistryOptions = {},
): Record<string, unknown> => {
  const state = toState(registry);
  const recipientOptions = buildRecipientOptionsFromRegistry(state);
  const activeRecipient = state.activeRecipient;

  return {
    ...(options.base || {}),
    ...(options.enabled !== undefined ? { enabled: options.enabled } : {}),
    ...(options.canEditStructure !== undefined
      ? { canEditStructure: options.canEditStructure }
      : {}),
    ...(options.isGlobalView !== undefined ? { isGlobalView: options.isGlobalView } : {}),
    recipientOptions,
    users: recipientOptions,
    activeRecipientId: state.activeRecipientId,
    actorId: state.activeRecipientId ?? (options.base as { actorId?: string } | null)?.actorId ?? undefined,
    actorColor: activeRecipient?.color ?? null,
  };
};

export type AssignmentContextFromRegistry = {
  recipients: RegistryRecipientOption[];
  activeRecipientId: string | null;
  canReassign: boolean;
};

/** Contexto de reasignación para AssignmentDialog/controller. */
export const buildAssignmentContextFromRegistry = (
  registry: RegistryLike,
  options: { canReassign?: boolean } = {},
): AssignmentContextFromRegistry => {
  const state = toState(registry);
  const assignable = state.recipients.filter((recipient) => recipient.disabled !== true);

  return {
    recipients: assignable.map((recipient) => ({
      id: recipient.id,
      name: recipient.label,
      color: recipient.color ?? null,
      role: recipient.role ?? null,
    })),
    activeRecipientId: state.activeRecipientId,
    canReassign: options.canReassign ?? assignable.length > 0,
  };
};
