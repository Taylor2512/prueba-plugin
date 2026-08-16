export {
  getSchemaVisibility,
  resolveExternalFormRuntimeState,
  areAllRequiredFieldsComplete,
  InMemoryExternalFormStorage,
  type ExternalFormRuntimeState,
  type ExternalFormRuntimeStateOptions,
  type ExternalFormSchemaState,
  type ExternalFormRunnerProps,
  type SchemaVisibility,
} from '@sisad-pdfme/externalForms/externalFormRunner';
export {
  Designer,
  Form,
  Viewer,
  PdfEditor,
  PdfEditorEngineBuilder,
  PdfFormView,
  PdfViewer,
  RuntimeFormPanel,
  createDesignerRuntimeEventHub,
} from '@sisad-pdfme/ui';
export {
  createSisadPdfmeConfig,
  defaultSisadPdfmeConfig,
  resolveSisadPdfmeConfig,
  createInspectorConfigurationResolver,
} from '@sisad-pdfme/config';
export {
  normalizeHostData,
} from '@sisad-pdfme/integration/normalizeHostData';
export type {
  SisadPdfmeHostDataAdapters,
  SisadPdfmeHostDataInput,
  SisadPdfmeNormalizedHostData,
} from '@sisad-pdfme/integration/normalizeHostData';
export {
  createTemplateFromRecipe,
} from '@sisad-pdfme/templates';
export type {
  SisadPdfmeTemplateRecipe,
  SisadPdfmeTemplateRecipeGroup,
} from '@sisad-pdfme/templates';
export { SisadPdfmeInstance } from '@sisad-pdfme/integration/SisadPdfmeInstance';
export {
  resolveSisadPdfmeInstance,
  useSisadPdfmeInstance,
} from '@sisad-pdfme/integration/useSisadPdfmeInstance';
export {
  createSisadPdfmeInstanceBundle,
  parseSisadPdfmeInstanceBundle,
  restoreSisadPdfmeInstanceBundle,
  serializeSisadPdfmeInstanceBundle,
  validateSisadPdfmeInstanceBundle,
} from '@sisad-pdfme/integration/SisadPdfmeInstanceBundle';
export type {
  SisadPdfmeInstanceInput,
  SisadPdfmeRegisteredInstance,
} from '@sisad-pdfme/integration/defineSisadPdfmeInstance';
export {
  defineSisadPdfmeInstance,
} from '@sisad-pdfme/integration/defineSisadPdfmeInstance';
export {
  validateSisadPdfmeInstanceDefinition,
} from '@sisad-pdfme/integration/validateSisadPdfmeInstanceDefinition';
export type {
  SisadPdfmeInstanceDefinitionIssue,
  SisadPdfmeInstanceDefinitionIssueSeverity,
} from '@sisad-pdfme/integration/validateSisadPdfmeInstanceDefinition';
export type {
  SisadPdfmeInstanceBundle,
  SisadPdfmeInstanceBundleInput,
  SisadPdfmeInstanceBundleResources,
  SisadPdfmeInstanceBundleReadResult,
  SisadPdfmeInstanceBundleVersion,
} from '@sisad-pdfme/integration/SisadPdfmeInstanceBundle';
export type {
  SisadPdfmeInstanceDefinition,
  SisadPdfmeInstanceHandlers,
  SisadPdfmeInstanceMode,
  SisadPdfmeInstanceProps,
  SisadPdfmeInstanceResolution,
  SisadPdfmeInstanceRuntimeState,
  SisadPdfmeInstanceState,
  SisadPdfmeInstanceStateChange,
  SisadPdfmeInstanceStateField,
  SisadPdfmeInstanceStateFieldSource,
  SisadPdfmeInstanceStateChangeSource,
  SisadPdfmeInstanceStateFieldName,
  SisadPdfmeInstanceStateInput,
  SisadPdfmeInstanceResources,
} from '@sisad-pdfme/integration/resolveSisadPdfmeInstance';
import {
  SisadPdfmeProvider,
  SisadPdfmeDesigner,
  SisadPdfmeForm,
  SisadPdfmeViewer,
  useSisadPdfmeConfigService,
  useSisadPdfmeConfig,
  useSisadPdfmeController,
  useSisadPdfmeFeature,
  useSisadPdfmeAction,
  useSisadPdfmeComponent,
} from '@sisad-pdfme/react';
export {
  SisadPdfmeProvider,
  SisadPdfmeDesigner,
  SisadPdfmeForm,
  SisadPdfmeViewer,
  useSisadPdfmeConfigService,
  useSisadPdfmeConfig,
  useSisadPdfmeController,
  useSisadPdfmeFeature,
  useSisadPdfmeAction,
  useSisadPdfmeComponent,
};
export type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeController,
  SisadPdfmeControllerCapabilityDomain,
  SisadPdfmeControllerCapabilityState,
  SisadPdfmeDocument,
  SisadPdfmeDocumentsAdapter,
  SisadPdfmeEventHandlers,
  SisadPdfmeEventName,
  SisadPdfmeGlobalConfig,
  SisadPdfmePersistenceAdapter,
  SisadPdfmeProviderProps,
  SisadPdfmeProviderValue,
  SisadPdfmeRecipient,
  SisadPdfmeRecipientsAdapter,
  SisadPdfmeSignatureProvider,
  SisadPdfmeSignatureProviderAdapter,
  SisadPdfmeUiClassNamesConfig,
  SisadPdfmeUiConfig,
  SisadPdfmeVisibilityConfig,
} from '@sisad-pdfme/config';
export type {
  InspectorConfigurationResolver,
} from '@sisad-pdfme/config';
export {
  createRecipientRegistry,
  normalizeRecipients,
  resolveSchemaOwnerAppearance,
  resolveOwnerRecipientId,
  buildCollaborationSyncFromRegistry,
  buildAssignmentContextFromRegistry,
  buildRecipientOptionsFromRegistry,
  resolveRecipientColors,
  buildRecipientColorMap,
  createRecipientPermissionResolver,
  recipientsToSnapshot,
  recipientsFromSnapshot,
  useRecipientRegistry,
} from '@sisad-pdfme/recipients';
export type {
  SchemaOwnerAppearance,
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsConfig,
  SisadPdfmeRecipientsSnapshot,
} from '@sisad-pdfme/recipients';
export {
  createDocumentsAdapter,
  createPersistenceAdapter,
  createRecipientsAdapter,
  createSignatureProviderAdapter,
} from '@sisad-pdfme/adapters';
export {
  generatePdf as generateTemplatePdf,
  generatePdf,
  generatePdfBuffer,
  generatePdfWithPreflight,
  buildDynamicTemplate,
} from '@sisad-pdfme/generator';
export {
  img2pdf as convertImagesToPdf,
  pdf2img as getPdfPageImages,
  pdf2size as getPdfPageSizes,
} from '@sisad-pdfme/converter/index';
export {
  buildRuntimeOptions,
  buildDesignerRuntimeOptions,
  buildRuntimeFormOptions,
  buildRuntimeViewerOptions,
  DEFAULT_RUNTIME_THEME_TOKEN,
} from '@sisad-pdfme/runtime/options';
export { createSchemaCapabilityResolver } from '@sisad-pdfme/config';
export {
  LockManager,
  DEFAULT_LOCK_TTL,
} from '@sisad-pdfme/collaboration/lockManager';
export type {
  SchemaLock,
  LockTTLConfig,
  LockResult,
  CurrentUserInfo,
} from '@sisad-pdfme/collaboration/lockManager';
export { createSchemaLockGuard } from '@sisad-pdfme/collaboration/schemaLockGuard';
export type {
  SchemaUidResolver,
  SchemaLockGuardOptions,
} from '@sisad-pdfme/collaboration/schemaLockGuard';
export {
  lockSchema,
  unlockSchema,
  isSchemaLocked,
  getSchemaOwner,
  assignCollaborativeSchemaOwner,
  setSchemaAuthorColor,
  filterSchemasByCollaborationScope,
  buildCollaborationPresenceState,
} from '@sisad-pdfme/collaboration';
export {
  isOptionGroupSchema,
  isCheckboxGroupSchema,
  isRadioGroupSchema,
  isSelectSchema,
  isOptionBasedSchema,
  isCheckboxSchema,
  isActionSchema,
  isSigningSchema,
  isTextLikeSchema,
  isRawOptionItem,
  getSchemaOptions,
  resolveSchemaIdByIdentity,
} from '@sisad-pdfme/schemas';
export {
  normalizeTemplatePagesForDocument,
  normalizeDocuments,
  resolveActiveDocument,
  pdfToImages,
  pdfToPageSizes,
  imagesToPdf,
  pdfToPageSizes as getDocumentPdfPageSizes,
  filterSchemasByFileAndPage,
  reconcileTemplateDocuments,
  mergeDesignerDocumentIntoFile,
} from '@sisad-pdfme/documents';
export {
  CommandBus,
  createCommandBus,
  designerCommands,
  schemaCommands,
  commentCommands,
  documentCommands,
  registerDesignerCommands,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
  createCommentCommandEvent,
  buildTopLevelCommentEntry,
  createSelectionCommands,
  emitInlineEditRequest,
  setInlineEditRequestHandler,
} from '@sisad-pdfme/commands';
export {
  createObjectUrl,
  revokeObjectUrls,
} from '@sisad-pdfme/browser/objectUrls';
export {
  downloadUrl,
  downloadJson,
} from '@sisad-pdfme/browser/downloads';
export {
  parsePdfmeSnapshot,
  extractDocumentsFromSnapshot,
  resolveDocumentSnapshot,
  resolveDocumentTemplate,
  extractOriginalFormFromSnapshot,
  extractAssignmentsFromSnapshot,
  serializeSnapshotForTxt,
  snapshotAdapter,
} from '@sisad-pdfme/shared/snapshotAdapter';
export {
  makeEmptySnapshot,
  SNAPSHOT_VERSION,
} from '@sisad-pdfme/contracts';
export {
  getSchemaPluginByType,
  getBuiltInFields,
  getSchemaDefinition,
  getSchemaFamily,
  registerFieldPlugin,
  registerPlugins,
  validateSchemaNameUniqueness,
  generateUniqueSchemaName,
} from '@sisad-pdfme/schemas';
export { createSchemaController } from '@sisad-pdfme/integration/schemaController';

/**
 * Primitivas de runtime de la campaña Runtime Platform.
 *
 * Estaban construidas y probadas pero **no eran alcanzables**: ningún barrel
 * público las exportaba, así que un host no podía importarlas y `knip
 * --production` las declaraba inalcanzables desde los entrypoints.
 *
 * Su evidencia lo decía una y otra vez —«primitive completada, falta conectar a
 * producción»—, y la conexión que faltaba es ésta: la superficie de integración.
 * No se consumen internamente a propósito. Varias evidencias declaran que el
 * scheduling y el lifecycle son responsabilidad del host/adaptador, así que el
 * core las ofrece y no decide por él.
 */
export {
  projectUserCompletion,
  projectDocumentCompletion,
  projectExecutionCompletion,
} from '@sisad-pdfme/runtime/completionProjection';
export type {
  CompletionStatus,
  CompletionSchemaRecord,
  UserCompletionProjection,
  DocumentCompletionProjection,
  ExecutionCompletionProjection,
} from '@sisad-pdfme/runtime/completionProjection';

export {
  validateExecutionPlan,
  isExecutionStageComplete,
  resolveRunnableStages,
  fanOutExecutionUnits,
} from '@sisad-pdfme/runtime/executionOrchestration';
export type {
  ExecutionIsolation,
  ExecutionCompletionPolicy,
  ExecutionUnit,
  ExecutionStage,
  ExecutionPlan,
  ExecutionOrchestrationState,
} from '@sisad-pdfme/runtime/executionOrchestration';

export {
  toArtifactReference,
  ArtifactByteStore,
  createArtifactByteStore,
  createExecutionResult,
  roundTripExecutionResult,
} from '@sisad-pdfme/runtime/executionResult';
export type {
  ExecutionArtifactReference,
  ExecutionResult,
} from '@sisad-pdfme/runtime/executionResult';

export { mergeCanonicalDeltas } from '@sisad-pdfme/runtime/canonicalMerge';
export type {
  CanonicalSchemaDelta,
  CanonicalMergeConflict,
  CanonicalMergeResult,
} from '@sisad-pdfme/runtime/canonicalMerge';

export {
  composePdfResults,
  PdfCompositionError,
  PDF_COMPOSITION_MODES,
  PDF_COMPOSITION_ORDERINGS,
  DEFAULT_COMPOSITION_LIMITS,
} from '@sisad-pdfme/runtime/pdfComposition';
export type {
  PdfExecutionArtifact,
  PdfCompositionMode,
  PdfCompositionOrdering,
  PdfCompositionLimits,
  PdfCompositionPlan,
  PdfCompositionManifest,
  PdfCompositionResult,
} from '@sisad-pdfme/runtime/pdfComposition';

export { createSaveLifecycle } from '@sisad-pdfme/runtime/saveLifecycle';
export type {
  SaveStatus,
  SaveState,
  SaveResult,
  SaveLifecycleOptions,
  SaveLifecycle,
} from '@sisad-pdfme/runtime/saveLifecycle';

export {
  buildSchemaRuntimeManifest,
  indexSchemaRuntimeManifest,
} from '@sisad-pdfme/runtime/schemaManifest';
export type { SchemaRuntimeManifest } from '@sisad-pdfme/runtime/schemaManifest';

export {
  resolveSchemaRuntimeMetadata,
  SCHEMA_RUNTIME_FAMILIES,
} from '@sisad-pdfme/schemas/schemaRuntimeMetadata';
export type {
  SchemaRuntimeMetadata,
  SchemaInteractionKind,
  SchemaCompletionPolicy,
  SchemaCodecId,
  SchemaDataBinding,
} from '@sisad-pdfme/schemas/schemaRuntimeMetadata';

export {
  artifactStatusToExportEvent,
  ARTIFACT_EVENT_NAMES,
} from '@sisad-pdfme/runtime/artifactEvents';
export type { ArtifactStatusEvent, ArtifactEvent } from '@sisad-pdfme/runtime/artifactEvents';

export {
  normalizeRuntimeSchemaAssignments,
  getAssignedSchemaUids,
} from '@sisad-pdfme/runtime/assignments';
export type {
  RuntimeSchemaAssignments,
} from '@sisad-pdfme/runtime/assignments';

/** Capability pública para construir, proyectar y validar assignments. */
export {
  buildRecipientAssignments,
  buildFileAssignments,
  buildPageAssignments,
  reconcileAssignments,
  removeSchemaFromAssignments,
  moveSchemaAssignment,
  getAssignmentsForRecipient,
  getAssignmentsForFile,
  validateAssignmentsConsistency,
} from '@sisad-pdfme/assignments';
export type { SchemaAssignments } from '@sisad-pdfme/common';

/** Capability pública de persistencia local y ejecución sin backend. */
export {
  createLocalModeConfig,
  diagnoseLocalMode,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
} from '@sisad-pdfme/shared/localMode';
export type {
  CollaborationMode,
  LocalModeConfig,
  LocalModeOptions,
  LocalModeDiagnostics,
} from '@sisad-pdfme/shared/localMode';
export { createLocalFormStorage, LocalFormStorage } from '@sisad-pdfme/shared/localFormStorage';
export type { LocalFormStorageOptions } from '@sisad-pdfme/shared/localFormStorage';
export {
  LocalSnapshotStoreImpl,
  localSnapshotStore,
  LocalStorageQuotaError,
  SnapshotNotFoundError,
} from '@sisad-pdfme/shared/localSnapshotStore';
export type { LocalSnapshotStoreOptions, SnapshotIndexEntry } from '@sisad-pdfme/shared/localSnapshotStore';
export {
  KEYBOARD_SHORTCUTS,
  TOOLBAR_SINGLE,
  TOOLBAR_MULTI,
  isMacOS,
  platformKey,
  normalizeKeyCombo,
  findShortcut,
} from '@sisad-pdfme/shared/keyboardShortcuts';
export type {
  ShortcutAction,
  ShortcutDefinition,
  ToolbarAction,
} from '@sisad-pdfme/shared/keyboardShortcuts';
export { createDesignerEffectCoordinator } from '@sisad-pdfme/ui/components/Designer/shared/designerEffectCoordinator';
export type {
  DesignerEffectCoordinator,
  DesignerEffectCoordinatorOptions,
} from '@sisad-pdfme/ui/components/Designer/shared/designerEffectCoordinator';
export {
  interactionReducer,
  canApplyInteractionEvent,
  initialInteractionMachineState,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionReducer';
export type {
  TransformKind,
  InteractionMachineState,
  InteractionRejectionReason,
  InteractionEvent,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionReducer';
export { resolveSchemaDisplayInfo } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo';
export type { SchemaDisplayInfo } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo';
export {
  OverlayManager,
  createOverlayManager,
  OVERLAY_Z_INDEX,
  PORTAL_REQUIRED_OVERLAYS,
  OVERLAY_DEFAULTS,
} from '@sisad-pdfme/canvas/overlayManager';
export type {
  OverlayType,
  OverlayZLevel,
  CloseEvent,
  OverlayDescriptor,
} from '@sisad-pdfme/canvas/overlayManager';

/**
 * Fuentes de datos remotas. `DataSourceRuntime` resuelve carreras, aislamiento
 * por scope y single-flight; sin exportarlo, el host no tenía forma de usarlo.
 */
export {
  DataSourceRuntime,
  createDataSourceRuntime,
  dataCacheKey,
} from '@sisad-pdfme/integration/data/dataSourceRuntime';
export type {
  DataScope,
  DataQuery,
  DataRequestStatus,
  DataResult,
  DataSourceExecutor,
  DataSourceRuntimeOptions,
} from '@sisad-pdfme/integration/data/dataSourceRuntime';

export {
  detectPointerKind,
  resolveDataPointer,
  resolveScalarPointer,
  resolveCollectionPointer,
} from '@sisad-pdfme/integration/data/dataPointer';
export type {
  DataPointerKind,
  DataPointerResultKind,
  DataPointerResult,
} from '@sisad-pdfme/integration/data/dataPointer';

export {
  isOptionValue,
  toOptionValue,
  optionValuesEqual,
  optionDisplayValue,
  resolveSelectedOption,
  DEFAULT_SELECTED_MISSING_POLICY,
} from '@sisad-pdfme/integration/data/optionValue';
export type {
  OptionValue,
  ResolvedOption,
  SelectedMissingPolicy,
  SelectedResolution,
} from '@sisad-pdfme/integration/data/optionValue';

export { getSchemaValueCodec, SCHEMA_CODEC_IDS } from '@sisad-pdfme/schemas/values/schemaValueCodec';
export type { SchemaValueCodec } from '@sisad-pdfme/schemas/values/schemaValueCodec';

/**
 * Adopción de firma: identidad, estilo y método de adquisición.
 *
 * Mismo caso que las primitivas de runtime: el clúster
 * `signatureAdoptionProfile → signatureStyleVariants → signatureIdentity` sólo
 * se importaba a sí mismo. Es capability de producto —el host necesita
 * resolver iniciales, estilo activo y flujo de adopción— y no había forma de
 * alcanzarla.
 */
export {
  normalizeSignerName,
  deriveSignerInitials,
  normalizeSignerInitials,
  buildSignatureProfileKey,
  MAX_SIGNER_INITIALS,
} from '@sisad-pdfme/schemas/signature/signatureIdentity';

export {
  resolveSisadSignatureAdoption,
  parseSisadSignatureAdoption,
  readSisadSignatureAdoption,
  writeSisadSignatureAdoption,
  clearSisadSignatureAdoption,
  resolveActiveSignatureStyleId,
  SISAD_SIGNATURE_PROFILE_VERSION,
} from '@sisad-pdfme/schemas/signature/signatureAdoptionProfile';
export type { SisadSignatureAdoptionProfile } from '@sisad-pdfme/schemas/signature/signatureAdoptionProfile';

export {
  SISAD_SIGNATURE_STYLES,
  DEFAULT_SISAD_SIGNATURE_STYLE_ID,
  isSisadSignatureStyleId,
  getSisadSignatureStyle,
  isSisadAdoptionFlow,
  resolveSignatureArtifactKind,
} from '@sisad-pdfme/schemas/signature/signatureStyleVariants';
export type {
  SignatureArtifactKind,
  SisadSignatureStyle,
} from '@sisad-pdfme/schemas/signature/signatureStyleVariants';

export { validateSignatureSchema } from '@sisad-pdfme/schemas/signature/validation';
export type { SignatureValidationResult } from '@sisad-pdfme/schemas/signature/validation';
import * as pdfjsLib from 'pdfjs-dist//build/pdf';
import PDFJSWorkerUrl from 'pdfjs-dist//build/pdf.worker.min.js?url';
import { getBuiltInFields as getBuiltInFieldsLocal } from '@sisad-pdfme/schemas';

/**
 * Configura PDF.js para el worker  usado por SISAD.
 *
 * Se mantiene en la capa de integración para que los consumidores del host
 * no dependan de detalles internos del converter.
 */
export const configurePdfjsWorker = async () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorkerUrl as string;

  return { pdfjsLib };
};

export const getSchemaCatalog = () =>
  getBuiltInFieldsLocal().map((field, index) => ({
    id: `schema-${String(index + 1).padStart(2, '0')}-${String(field.type || '').trim()}`,
    key: String(field.label || field.type || '').trim(),
    type: String(field.type || '').trim(),
    label: String(field.label || field.type || '').trim(),
    category: String(field.category || 'General').trim() || 'General',
  }));
export const normalizeTemplateForRuntime = (templateValue: unknown) => {
  if (!templateValue || typeof templateValue !== 'object') return null;
  const template = templateValue as Record<string, unknown>;
  const basePdf = String(template.basePdf || '').trim();
  if (!basePdf) return null;
  return {
    ...template,
    basePdf,
    schemas: Array.isArray(template.schemas) ? template.schemas : [[]],
  };
};
