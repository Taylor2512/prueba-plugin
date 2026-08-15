import type {
  DesignerBindings,
  DesignerCollaboration,
  DesignerConfig,
  DesignerIdentity,
  DesignerRuntime,
  DesignerUI,
  SchemaDesignerMeta,
} from '@sisad-pdfme/shared/schemaDesignerMeta';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Convierte el contrato plano `SchemaDesignerMeta` en `DesignerConfig`.
 */
export function migrateDesignerMetaToConfig(sourceMeta: SchemaDesignerMeta & Record<string, unknown>): DesignerConfig {
  const identity: DesignerIdentity = {
    schemaUid: sourceMeta.schemaUid,
    templateVersion: sourceMeta.templateVersion,
    documentId: sourceMeta.documentId,
    pageNumber: sourceMeta.pageNumber,
    version: sourceMeta.version,
    createdAt: sourceMeta.createdAt,
    updatedAt: sourceMeta.updatedAt,
  };

  const collaboration: DesignerCollaboration = {};
  let hasCollaboration = false;

  if (sourceMeta.recipientId !== undefined) {
    collaboration.recipientId = sourceMeta.recipientId;
    hasCollaboration = true;
  }
  if (sourceMeta.recipientName !== undefined) {
    collaboration.recipientName = sourceMeta.recipientName;
    hasCollaboration = true;
  }
  if (sourceMeta.recipientColor !== undefined) {
    collaboration.recipientColor = sourceMeta.recipientColor;
    hasCollaboration = true;
  }
  if (sourceMeta.assignment !== undefined) {
    collaboration.assignment = sourceMeta.assignment;
    hasCollaboration = true;
  }

  const ownershipBase = isPlainObject(sourceMeta.ownership) ? sourceMeta.ownership : {};
  const sourceOwnerRecipientId = typeof sourceMeta.ownerRecipientId === 'string' ? sourceMeta.ownerRecipientId : undefined;
  if (sourceMeta.ownership !== undefined || sourceOwnerRecipientId !== undefined) {
    collaboration.ownership = {
      ...ownershipBase,
      ownerRecipientId:
        typeof (ownershipBase as Record<string, unknown>).ownerRecipientId === 'string'
          ? (ownershipBase as Record<string, unknown>).ownerRecipientId
          : sourceOwnerRecipientId,
    };
    hasCollaboration = true;
  }

  const sourceLock = isPlainObject(sourceMeta.lock) ? sourceMeta.lock : undefined;
  if (sourceLock !== undefined) {
    collaboration.lock = sourceLock as DesignerCollaboration['lock'];
    hasCollaboration = true;
  }
  const sourceComments = Array.isArray(sourceMeta.comments) ? sourceMeta.comments : undefined;
  if (sourceComments !== undefined) {
    collaboration.comments = sourceComments;
    hasCollaboration = true;
  }
  const sourceAnchors = Array.isArray(sourceMeta.commentAnchors) ? sourceMeta.commentAnchors : undefined;
  if (sourceAnchors !== undefined) {
    collaboration.commentAnchors = sourceAnchors;
    hasCollaboration = true;
  }

  const bindings: DesignerBindings = {};
  let hasBindings = false;
  if (sourceMeta.integration !== undefined) {
    bindings.integration = sourceMeta.integration;
    hasBindings = true;
  }

  const ui: DesignerUI = {};
  let hasUI = false;
  if (sourceMeta.group !== undefined) {
    ui.group = sourceMeta.group;
    hasUI = true;
  }

  const runtime: DesignerRuntime = {};
  let hasRuntime = false;
  if (sourceMeta.signature !== undefined) {
    runtime.signature = sourceMeta.signature;
    hasRuntime = true;
  }
  if (sourceMeta.state !== undefined) {
    runtime.state = sourceMeta.state;
    hasRuntime = true;
  }

  return {
    _v: 3,
    identity,
    ...(hasCollaboration ? { collaboration } : {}),
    ...(hasBindings ? { bindings } : {}),
    ...(hasUI ? { ui } : {}),
    ...(hasRuntime ? { runtime } : {}),
  };
}

/**
 * Convierte `DesignerConfig` de vuelta a `SchemaDesignerMeta`.
 */
export function serializeDesignerConfig(designerConfig: DesignerConfig): SchemaDesignerMeta {
  const { identity, collaboration, bindings, ui, runtime } = designerConfig;

  return {
    schemaUid: identity.schemaUid,
    templateVersion: identity.templateVersion,
    documentId: identity.documentId,
    pageNumber: identity.pageNumber,
    version: identity.version,
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
    recipientId: collaboration?.recipientId,
    recipientName: collaboration?.recipientName,
    recipientColor: collaboration?.recipientColor,
    assignment: collaboration?.assignment,
    ownership: collaboration?.ownership,
    signature: runtime?.signature,
    group: ui?.group,
    integration: bindings?.integration,
  };
}

/** Guarda compatibilidad con el contrato estructurado. */
export function isDesignerConfig(value: unknown): value is DesignerConfig {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (obj._v !== 3) return false;
  const identity = obj.identity;
  return Boolean(
    identity &&
      typeof identity === 'object' &&
      typeof (identity as Record<string, unknown>).schemaUid === 'string',
  );
}
