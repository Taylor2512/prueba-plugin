/**
 * Barrel de exportaciones del módulo shared de sisad-pdfme.
 * Agrupa todos los contratos transversales del sistema.
 */

// Fase 1 — Identidad de schema
export type {
  SchemaDesignerMeta,
  GroupMeta,
  DesignerIdentity,
  DesignerCollaboration,
  DesignerBindings,
  DesignerUI,
  DesignerRuntime,
  DesignerConfig,
} from '@sisad-pdfme/shared/schemaDesignerMeta';
export {
  createSchemaDesignerMeta,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
  createDesignerConfig,
} from '@sisad-pdfme/shared/schemaDesignerMeta';

// Schema migration: flat -> structured
export {
  migrateDesignerMetaToConfig,
  serializeDesignerConfig,
  isDesignerConfig,
} from '@sisad-pdfme/shared/schemaMigration';

// Fase 2 — Guards e Interaction Layer
export type {
  InteractionGuardContext,
  GuardResult,
  GuardRejectionReason,
} from '@sisad-pdfme/shared/interactionGuards';
export {
  validateInteraction,
  validateBulkInteraction,
  getBlockedSchemas,
  getAllowedSchemas,
} from '@sisad-pdfme/shared/interactionGuards';

// Fase 2 — Command Types
export type {
  CommandType,
  ActionSource,
  MovePayload,
  ResizePayload,
  RotatePayload,
  EditPayload,
  AssignRecipientPayload,
  CommandPayloadMap,
} from '@sisad-pdfme/shared/commandTypes';
export { MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS } from '@sisad-pdfme/shared/commandTypes';

// Fase 6 — Keyboard shortcuts
export type { ShortcutDefinition, ShortcutAction, ToolbarAction } from '@sisad-pdfme/shared/keyboardShortcuts';
export {
  KEYBOARD_SHORTCUTS,
  TOOLBAR_SINGLE,
  TOOLBAR_MULTI,
  findShortcut,
  normalizeKeyCombo,
  isMacOS,
  platformKey,
} from '@sisad-pdfme/shared/keyboardShortcuts';

// Fase 7 — Snapshot
export type {
  OfficialTemplateSnapshot,
  SnapshotDocument,
  SnapshotPage,
  SnapshotRecipient,
  SnapshotAssignment,
  SnapshotConnectivity,
  SnapshotFileConnectivity,
  SnapshotSchemaConnectivity,
  SnapshotContributor,
  SignatureConfig,
  ProviderConfig,
  SnapshotComment,
  PageBackground,
  SchemaWithDesigner,
  SerializeOptions,
} from '@sisad-pdfme/shared/snapshot';
export { SNAPSHOT_VERSION, isPreSnapshot, makeEmptySnapshot } from '@sisad-pdfme/shared/snapshot';

// Fase 7 — Snapshot Adapter
export type { ValidationResult, DesignerState } from '@sisad-pdfme/shared/snapshotAdapter';
export {
  snapshotAdapter,
  normalizeSnapshotConnectivity,
  resolveSnapshotConnectivity,
  resolveSnapshotConnectivityByFile,
  resolveSnapshotConnectivityBySchema,
} from '@sisad-pdfme/shared/snapshotAdapter';

// Template Validator — DocuSign-style pre-send validation
export type {
  ValidationSeverity,
  ValidationCode,
  ValidationIssue,
  ValidationResult as TemplateValidationResult,
  ValidatableSchema,
  ValidatableRecipient,
  ValidatablePageSize,
  ValidateTemplateInput,
} from '@sisad-pdfme/shared/templateValidator';
export { validateTemplate, isTemplateValid } from '@sisad-pdfme/shared/templateValidator';

// Modo sin backend — Local Mode
export type { SnapshotIndexEntry, LocalSnapshotStoreOptions } from '@sisad-pdfme/shared/localSnapshotStore';
export {
  LocalSnapshotStoreImpl,
  localSnapshotStore,
  LocalStorageQuotaError,
  SnapshotNotFoundError,
} from '@sisad-pdfme/shared/localSnapshotStore';

export type { LocalFormStorageOptions } from '@sisad-pdfme/shared/localFormStorage';
export { LocalFormStorage, createLocalFormStorage } from '@sisad-pdfme/shared/localFormStorage';

export type {
  CollaborationMode,
  LocalModeConfig,
  LocalModeOptions,
  LocalModeDiagnostics,
} from '@sisad-pdfme/shared/localMode';
export {
  createLocalModeConfig,
  diagnoseLocalMode,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
} from '@sisad-pdfme/shared/localMode';

export { normalizeLooseText, normalizeText } from '@sisad-pdfme/shared/text';
