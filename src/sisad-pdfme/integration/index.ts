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
} from '@sisad-pdfme/converter';
export {
  buildRuntimeOptions,
  buildDesignerRuntimeOptions,
  buildRuntimeFormOptions,
  buildRuntimeViewerOptions,
  DEFAULT_RUNTIME_THEME_TOKEN,
} from '@sisad-pdfme/runtime/options';
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
