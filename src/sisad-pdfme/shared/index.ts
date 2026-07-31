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
} from './schemaDesignerMeta.js';
export {
  createSchemaDesignerMeta,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
  createDesignerConfig,
} from './schemaDesignerMeta.js';

// Schema migration: flat -> structured
export {
  migrateDesignerMetaToConfig,
  serializeDesignerConfig,
  isDesignerConfig,
} from './schemaMigration.js';

// Fase 2 — Guards e Interaction Layer
export type {
  InteractionGuardContext,
  GuardResult,
  GuardRejectionReason,
} from './interactionGuards.js';
export {
  validateInteraction,
  validateBulkInteraction,
  getBlockedSchemas,
  getAllowedSchemas,
} from './interactionGuards.js';

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
} from './commandTypes.js';
export { MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS } from './commandTypes.js';

// Fase 6 — Keyboard shortcuts
export type { ShortcutDefinition, ShortcutAction, ToolbarAction } from './keyboardShortcuts.js';
export {
  KEYBOARD_SHORTCUTS,
  TOOLBAR_SINGLE,
  TOOLBAR_MULTI,
  findShortcut,
  normalizeKeyCombo,
  isMacOS,
  platformKey,
} from './keyboardShortcuts.js';

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
} from './snapshot.js';
export { SNAPSHOT_VERSION, isPreSnapshot, makeEmptySnapshot } from './snapshot.js';

// Fase 7 — Snapshot Adapter
export type { ValidationResult, DesignerState } from './snapshotAdapter.js';
export {
  snapshotAdapter,
  normalizeSnapshotConnectivity,
  resolveSnapshotConnectivity,
  resolveSnapshotConnectivityByFile,
  resolveSnapshotConnectivityBySchema,
} from './snapshotAdapter.js';

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
} from './templateValidator.js';
export { validateTemplate, isTemplateValid } from './templateValidator.js';

// Modo sin backend — Local Mode
export type { SnapshotIndexEntry, LocalSnapshotStoreOptions } from './localSnapshotStore.js';
export {
  LocalSnapshotStoreImpl,
  localSnapshotStore,
  LocalStorageQuotaError,
  SnapshotNotFoundError,
} from './localSnapshotStore.js';

export type { LocalFormStorageOptions } from './localFormStorage.js';
export { LocalFormStorage, createLocalFormStorage } from './localFormStorage.js';

export type {
  CollaborationMode,
  LocalModeConfig,
  LocalModeOptions,
  LocalModeDiagnostics,
} from './localMode.js';
export {
  createLocalModeConfig,
  diagnoseLocalMode,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
} from './localMode.js';

export { normalizeLooseText, normalizeText } from './text.js';
