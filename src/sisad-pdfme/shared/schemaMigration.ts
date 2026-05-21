import type {
  SchemaDesignerMeta,
  DesignerConfigV3,
  DesignerIdentity,
  DesignerCollaboration,
  DesignerRuntime,
  DesignerBindings,
  DesignerUI,
} from './schemaDesignerMeta.js';

/**
 * Migrates a legacy flat SchemaDesignerMeta (V2) to the structured V3 format.
 * Non-destructive: original object is not mutated.
 *
 * Migration map (legacy field → V3 path):
 *   schemaUid, templateVersion, documentId, pageNumber, version, createdAt, updatedAt → identity.*
 *   recipientId, recipientName, recipientColor, assignment, ownership → collaboration.*
 *   ownerRecipientId (root-level legacy) → collaboration.ownership.ownerRecipientId
 *   integration → bindings.integration
 *   group → ui.group
 *   signature, state → runtime.*
 */
export function migrateSchemaToV3(legacy: SchemaDesignerMeta & Record<string, unknown>): DesignerConfigV3 {
  const identity: DesignerIdentity = {
    schemaUid: legacy.schemaUid,
    templateVersion: legacy.templateVersion,
    documentId: legacy.documentId,
    pageNumber: legacy.pageNumber,
    version: legacy.version,
    createdAt: legacy.createdAt,
    updatedAt: legacy.updatedAt,
  };

  const collaboration: DesignerCollaboration = {};
  let hasCollaboration = false;

  if (legacy.recipientId !== undefined) { collaboration.recipientId = legacy.recipientId; hasCollaboration = true; }
  if (legacy.recipientName !== undefined) { collaboration.recipientName = legacy.recipientName; hasCollaboration = true; }
  if (legacy.recipientColor !== undefined) { collaboration.recipientColor = legacy.recipientColor; hasCollaboration = true; }
  if (legacy.assignment !== undefined) { collaboration.assignment = legacy.assignment; hasCollaboration = true; }

  const ownershipBase = legacy.ownership ?? {};
  const legacyOwnerRecipientId = (legacy as Record<string, unknown>)['ownerRecipientId'] as string | undefined;
  if (legacy.ownership !== undefined || legacyOwnerRecipientId !== undefined) {
    collaboration.ownership = {
      ...ownershipBase,
      ownerRecipientId: ownershipBase.ownerRecipientId ?? legacyOwnerRecipientId,
    };
    hasCollaboration = true;
  }

  // Legacy root-level collaboration fields (comments, lock)
  const legacyLock = (legacy as Record<string, unknown>)['lock'] as DesignerCollaboration['lock'] | undefined;
  if (legacyLock !== undefined) { collaboration.lock = legacyLock; hasCollaboration = true; }
  const legacyComments = (legacy as Record<string, unknown>)['comments'] as unknown[] | undefined;
  if (legacyComments !== undefined) { collaboration.comments = legacyComments; hasCollaboration = true; }
  const legacyAnchors = (legacy as Record<string, unknown>)['commentAnchors'] as unknown[] | undefined;
  if (legacyAnchors !== undefined) { collaboration.commentAnchors = legacyAnchors; hasCollaboration = true; }

  const bindings: DesignerBindings = {};
  let hasBindings = false;
  if (legacy.integration !== undefined) { bindings.integration = legacy.integration; hasBindings = true; }

  const ui: DesignerUI = {};
  let hasUI = false;
  if (legacy.group !== undefined) { ui.group = legacy.group; hasUI = true; }

  const runtime: DesignerRuntime = {};
  let hasRuntime = false;
  if (legacy.signature !== undefined) { runtime.signature = legacy.signature; hasRuntime = true; }
  const legacyState = (legacy as Record<string, unknown>)['state'] as string | undefined;
  if (legacyState !== undefined) { runtime.state = legacyState; hasRuntime = true; }

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
 * Flattens a V3 DesignerConfigV3 back to a legacy flat SchemaDesignerMeta.
 * Used for backward compatibility with code that still reads the flat contract.
 */
export function flattenV3ToLegacy(v3: DesignerConfigV3): SchemaDesignerMeta {
  const { identity, collaboration, bindings, ui, runtime } = v3;
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

    integration: bindings?.integration,

    group: ui?.group,

    signature: runtime?.signature,
  };
}

/** Type guard: returns true if a __designer value is V3. */
export function isDesignerConfigV3(value: unknown): value is DesignerConfigV3 {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (obj['_v'] !== 3) return false;
  const identity = obj['identity'];
  return (
    typeof identity === 'object' &&
    identity !== null &&
    typeof (identity as Record<string, unknown>)['schemaUid'] === 'string'
  );
}
