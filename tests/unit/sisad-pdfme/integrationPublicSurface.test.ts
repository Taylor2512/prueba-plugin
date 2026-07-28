import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/sisad-pdfme/ui/index.ts', () => ({
  Designer: () => null,
  Form: () => null,
  Viewer: () => null,
  PdfEditor: () => null,
  PdfEditorEngineBuilder: class PdfEditorEngineBuilder {},
  PdfFormView: () => null,
  PdfViewer: () => null,
  RuntimeFormPanel: () => null,
  createDesignerRuntimeEventHub: () => ({}),
}));

vi.mock('../../../src/sisad-pdfme/react/index.ts', () => ({
  SisadPdfmeProvider: () => null,
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
  useSisadPdfmeConfigService: () => null,
  useSisadPdfmeConfig: () => null,
  useSisadPdfmeController: () => null,
  useSisadPdfmeFeature: () => null,
  useSisadPdfmeAction: () => null,
  useSisadPdfmeComponent: () => null,
}));

import * as integrationApi from '@/sisad-pdfme/integration';
import type {
  ExternalFormRuntimeState,
  ExternalFormRuntimeStateOptions,
  ExternalFormSchemaState,
  ExternalFormRunnerProps,
  SchemaVisibility,
  ResolvedSisadPdfmeConfig,
  SisadPdfmeController,
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
  InspectorConfigurationResolver,
  SchemaOwnerAppearance,
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsConfig,
  SisadPdfmeRecipientsSnapshot,
} from '@/sisad-pdfme/integration';

type _IntegrationTypeContract = {
  externalFormRuntimeState: ExternalFormRuntimeState;
  externalFormRuntimeStateOptions: ExternalFormRuntimeStateOptions;
  externalFormSchemaState: ExternalFormSchemaState;
  externalFormRunnerProps: ExternalFormRunnerProps;
  schemaVisibility: SchemaVisibility;
  resolvedConfig: ResolvedSisadPdfmeConfig;
  controller: SisadPdfmeController;
  document: SisadPdfmeDocument;
  documentsAdapter: SisadPdfmeDocumentsAdapter;
  eventHandlers: SisadPdfmeEventHandlers;
  eventName: SisadPdfmeEventName;
  globalConfig: SisadPdfmeGlobalConfig;
  persistenceAdapter: SisadPdfmePersistenceAdapter;
  providerProps: SisadPdfmeProviderProps;
  providerValue: SisadPdfmeProviderValue;
  recipient: SisadPdfmeRecipient;
  recipientsAdapter: SisadPdfmeRecipientsAdapter;
  signatureProvider: SisadPdfmeSignatureProvider;
  signatureProviderAdapter: SisadPdfmeSignatureProviderAdapter;
  uiClassNames: SisadPdfmeUiClassNamesConfig;
  uiConfig: SisadPdfmeUiConfig;
  visibilityConfig: SisadPdfmeVisibilityConfig;
  inspectorResolver: InspectorConfigurationResolver;
  schemaOwnerAppearance: SchemaOwnerAppearance;
  assignmentChangePayload: SisadPdfmeAssignmentChangePayload;
  recipientRegistry: SisadPdfmeRecipientRegistry;
  recipientRegistryState: SisadPdfmeRecipientRegistryState;
  recipientsConfig: SisadPdfmeRecipientsConfig;
  recipientsSnapshot: SisadPdfmeRecipientsSnapshot;
};

describe('sisad-pdfme integration public surface', () => {
  it('exposes the integration barrel exports', () => {
    const integrationSurface = [
      integrationApi.getSchemaVisibility,
      integrationApi.areAllRequiredFieldsComplete,
      integrationApi.resolveExternalFormRuntimeState,
      integrationApi.InMemoryExternalFormStorage,
      integrationApi.Designer,
      integrationApi.Form,
      integrationApi.Viewer,
      integrationApi.PdfEditor,
      integrationApi.PdfEditorEngineBuilder,
      integrationApi.PdfFormView,
      integrationApi.PdfViewer,
      integrationApi.RuntimeFormPanel,
      integrationApi.createDesignerRuntimeEventHub,
      integrationApi.createSisadPdfmeConfig,
      integrationApi.defaultSisadPdfmeConfig,
      integrationApi.resolveSisadPdfmeConfig,
      integrationApi.createInspectorConfigurationResolver,
      integrationApi.SisadPdfmeProvider,
      integrationApi.SisadPdfmeDesigner,
      integrationApi.SisadPdfmeForm,
      integrationApi.SisadPdfmeViewer,
      integrationApi.useSisadPdfmeConfigService,
      integrationApi.useSisadPdfmeConfig,
      integrationApi.useSisadPdfmeController,
      integrationApi.useSisadPdfmeFeature,
      integrationApi.useSisadPdfmeAction,
      integrationApi.useSisadPdfmeComponent,
      integrationApi.createRecipientRegistry,
      integrationApi.normalizeRecipients,
      integrationApi.resolveSchemaOwnerAppearance,
      integrationApi.resolveOwnerRecipientId,
      integrationApi.buildCollaborationSyncFromRegistry,
      integrationApi.buildAssignmentContextFromRegistry,
      integrationApi.buildRecipientOptionsFromRegistry,
      integrationApi.resolveRecipientColors,
      integrationApi.buildRecipientColorMap,
      integrationApi.createRecipientPermissionResolver,
      integrationApi.recipientsToSnapshot,
      integrationApi.recipientsFromSnapshot,
      integrationApi.useRecipientRegistry,
      integrationApi.createDocumentsAdapter,
      integrationApi.createPersistenceAdapter,
      integrationApi.createRecipientsAdapter,
      integrationApi.createSignatureProviderAdapter,
      integrationApi.generateTemplatePdf,
      integrationApi.generatePdf,
      integrationApi.generatePdfBuffer,
      integrationApi.generatePdfWithPreflight,
      integrationApi.buildDynamicTemplate,
      integrationApi.convertImagesToPdf,
      integrationApi.getPdfPageImages,
      integrationApi.getPdfPageSizes,
      integrationApi.buildRuntimeOptions,
      integrationApi.buildDesignerRuntimeOptions,
      integrationApi.buildRuntimeFormOptions,
      integrationApi.buildRuntimeViewerOptions,
      integrationApi.DEFAULT_RUNTIME_THEME_TOKEN,
      integrationApi.normalizeTemplatePagesForDocument,
      integrationApi.normalizeDocuments,
      integrationApi.resolveActiveDocument,
      integrationApi.pdfToImages,
      integrationApi.pdfToPageSizes,
      integrationApi.imagesToPdf,
      integrationApi.getDocumentPdfPageSizes,
      integrationApi.filterSchemasByFileAndPage,
      integrationApi.reconcileTemplateDocuments,
      integrationApi.mergeDesignerDocumentIntoFile,
      integrationApi.configurePdfjsLegacyWorker,
      integrationApi.getSchemaCatalog,
      integrationApi.normalizeTemplateForRuntime,
      integrationApi.CommandBus,
      integrationApi.createCommandBus,
      integrationApi.designerCommands,
      integrationApi.schemaCommands,
      integrationApi.commentCommands,
      integrationApi.documentCommands,
      integrationApi.registerDesignerCommands,
      integrationApi.createPageSnapshotCommand,
      integrationApi.createTemplateSnapshotCommand,
      integrationApi.createCommentCommandEvent,
      integrationApi.buildTopLevelCommentEntry,
      integrationApi.createSelectionCommands,
      integrationApi.emitInlineEditRequest,
      integrationApi.setInlineEditRequestHandler,
      integrationApi.parsePdfmeSnapshot,
      integrationApi.extractDocumentsFromSnapshot,
      integrationApi.resolveDocumentSnapshot,
      integrationApi.resolveDocumentTemplate,
      integrationApi.extractOriginalFormFromSnapshot,
      integrationApi.extractAssignmentsFromSnapshot,
      integrationApi.serializeSnapshotForTxt,
      integrationApi.snapshotAdapter,
      integrationApi.makeEmptySnapshot,
      integrationApi.SNAPSHOT_VERSION,
      integrationApi.getSchemaPluginByType,
      integrationApi.getBuiltInFields,
      integrationApi.getSchemaDefinition,
      integrationApi.getSchemaFamily,
      integrationApi.registerFieldPlugin,
      integrationApi.registerPlugins,
      integrationApi.validateSchemaNameUniqueness,
      integrationApi.generateUniqueSchemaName,
      integrationApi.createSchemaController,
    ];

    expect(integrationSurface.length).toBeGreaterThan(0);
  });
});
