export type { SchemaAssignments, LegacySchemaAssignments } from './assignments.js';
export type { Command, CommandExecutionContext, CommandObserverEvent, CommandObserverPayload } from './commands.js';
export type { CommentAnchor, PdfComment, PdfCommentReply, TopLevelPdfCommentEntry } from './comments.js';
export type { PluginActionDefinition, PluginFamilyDefinition, PluginStrategyDefinition, SchemaInspectorSection } from './plugins.js';
export type { CollaborativeSchemaContract, SchemaIdentity, SchemaDesignerMeta } from './schema.js';
export {
  createSchemaDesignerMeta,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
} from './schema.js';
export type {
  Template,
  Schema,
  SchemaForUI,
  GenerateProps,
  DesignerProps,
  PreviewProps,
  UIProps,
  Plugin,
} from '../common/types.js';

// ── Fase 2: Guards e Interaction Layer ───────────────────────────────────────
export type {
  InteractionGuardContext,
  GuardResult,
  GuardRejectionReason,
} from '../shared/interactionGuards.js';
export {
  validateInteraction,
  validateBulkInteraction,
  getBlockedSchemas,
  getAllowedSchemas,
} from '../shared/interactionGuards.js';
export type { CommandType, ActionSource } from '../shared/commandTypes.js';
export { MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS } from '../shared/commandTypes.js';

// ── Fase 7: Snapshot oficial ─────────────────────────────────────────────────
export type {
  OfficialTemplateSnapshot,
  SnapshotDocument,
  SnapshotPage,
  SnapshotRecipient,
  SnapshotAssignment,
  SignatureConfig,
  ProviderConfig,
  SnapshotComment,
  SnapshotMetadata,
  PageBackground,
  SerializeOptions,
  SchemaWithDesigner,
} from '../shared/snapshot.js';
export { SNAPSHOT_VERSION, isLegacySnapshot, makeEmptySnapshot } from '../shared/snapshot.js';
export { snapshotAdapter } from '../shared/snapshotAdapter.js';
export type { ValidationResult, DesignerState } from '../shared/snapshotAdapter.js';

// ── Fase 8: Provider Registry ────────────────────────────────────────────────
export type {
  SignatureProvider,
  SignaturePolicy,
  SignatureCaptureContext,
  SignatureExecutionContext,
  SignatureResult,
  SignatureValidation,
  ExternalSignatureAdapter,
} from '../shared/signatureRegistry.js';
export {
  signatureProviderRegistry,
  ProviderNotRegisteredError,
  getAvailableProvidersForSchema,
  getDefaultProviderForSchema,
} from '../shared/signatureRegistry.js';
