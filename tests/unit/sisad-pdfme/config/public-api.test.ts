import { describe, expect, it, vi } from 'vitest';
import * as configApi from '@/sisad-pdfme/config';
vi.mock('@/sisad-pdfme/react/SisadPdfmeProvider', () => ({
  SisadPdfmeProvider: () => null,
}));
vi.mock('@/sisad-pdfme/react/SisadPdfmeDesigner', () => ({
  SisadPdfmeDesigner: () => null,
}));
vi.mock('@/sisad-pdfme/react/SisadPdfmeForm', () => ({
  SisadPdfmeForm: () => null,
}));
vi.mock('@/sisad-pdfme/react/SisadPdfmeViewer', () => ({
  SisadPdfmeViewer: () => null,
}));
vi.mock('@/sisad-pdfme/ui/index', () => ({
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
// Import-type of the restored public types: documenta el contrato y lo valida
// bajo `tsc` (CONFIG-001 restauró estos exports en el barrel de config).
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
  SisadPdfmeDocument,
  SisadPdfmeEventHandlers,
  SisadPdfmeVisibilityConfig,
  SisadPdfmeUiConfig,
  SisadPdfmeProviderProps,
  SisadPdfmeProviderValue,
  SisadPdfmeConfigService,
  SisadPdfmeRecipient,
  SisadPdfmeRecipientsAdapter,
  SisadPdfmeDocumentsAdapter,
  SisadPdfmePersistenceAdapter,
  SisadPdfmeSignatureProviderAdapter,
  SisadPdfmeEventName,
  SisadPdfmeUiClassNamesConfig,
  SisadPdfmeConfigMigrationIssue,
  SisadPdfmeConfigMigrationResult,
  SisadPdfmeConfigIssue,
  SisadPdfmeConfigChangeImpact,
  SisadPdfmeConfigSelectors,
  SisadPdfmeConfigSource,
  SisadPdfmeConfigChange,
  SisadPdfmeConfigServiceListener,
  InspectorConfigurationResolver,
} from '@/sisad-pdfme/config';

// Uso de los tipos para que su ausencia rompa el typecheck, no solo el runtime.
type _PublicTypeContract = {
  resolved: ResolvedSisadPdfmeConfig;
  raw: SisadPdfmeGlobalConfig;
  document: SisadPdfmeDocument;
  events: SisadPdfmeEventHandlers;
  visibility: SisadPdfmeVisibilityConfig;
  ui: SisadPdfmeUiConfig;
  providerProps: SisadPdfmeProviderProps;
  providerValue: SisadPdfmeProviderValue;
  configService: SisadPdfmeConfigService;
  recipient: SisadPdfmeRecipient;
  recipientsAdapter: SisadPdfmeRecipientsAdapter;
  documentsAdapter: SisadPdfmeDocumentsAdapter;
  persistenceAdapter: SisadPdfmePersistenceAdapter;
  signatureProviderAdapter: SisadPdfmeSignatureProviderAdapter;
  eventName: SisadPdfmeEventName;
  uiClassNames: SisadPdfmeUiClassNamesConfig;
  migrationIssue: SisadPdfmeConfigMigrationIssue;
  migrationResult: SisadPdfmeConfigMigrationResult;
  configIssue: SisadPdfmeConfigIssue;
  configChangeImpact: SisadPdfmeConfigChangeImpact;
  configSelectors: SisadPdfmeConfigSelectors;
  configSource: SisadPdfmeConfigSource;
  configChange: SisadPdfmeConfigChange;
  configServiceListener: SisadPdfmeConfigServiceListener;
  inspectorResolver: InspectorConfigurationResolver;
};

describe('config public API barrel (CONFIG-001 regression guard)', () => {
  it('exposes the config value exports that the public barrel re-exports', () => {
    // `resolveSisadPdfmeConfig` era el re-export roto que rompía integration/index.ts.
    expect(typeof configApi.resolveSisadPdfmeConfig).toBe('function');
    expect(typeof configApi.createSisadPdfmeConfig).toBe('function');
    expect(configApi.defaultSisadPdfmeConfig).toBeTruthy();
    expect(typeof configApi.defaultSisadPdfmeConfig).toBe('object');
  });

  it('createSisadPdfmeConfig() resolves with no arguments', () => {
    const resolved = configApi.createSisadPdfmeConfig();
    expect(resolved).toBeTruthy();
    expect(typeof resolved).toBe('object');
  });

  it('exposes the new config service hooks through the public react files', async () => {
    const reactApi = await import('@/sisad-pdfme/react');
    expect(typeof reactApi.SisadPdfmeProvider).toBe('function');
    expect(typeof reactApi.useSisadPdfmeConfig).toBe('function');
    expect(typeof reactApi.useSisadPdfmeController).toBe('function');
    expect(typeof reactApi.useSisadPdfmeConfigService).toBe('function');
    expect(typeof reactApi.useSisadPdfmeFeature).toBe('function');
    expect(typeof reactApi.useSisadPdfmeAction).toBe('function');
    expect(typeof reactApi.useSisadPdfmeComponent).toBe('function');
  });

  it('resolveSisadPdfmeConfig({}) produces a resolved config', () => {
    const resolved = configApi.resolveSisadPdfmeConfig({});
    expect(resolved).toBeTruthy();
    expect(typeof resolved).toBe('object');
  });

  it('exposes the public config helpers from the barrel', () => {
    const resolved = configApi.createSisadPdfmeConfig({
      runtime: { readonly: true },
      visibility: {
        inspector: {
          visible: true,
        },
      },
    });
    const selectors = configApi.createSisadPdfmeConfigSelectors(resolved);
    const service = configApi.createSisadPdfmeConfigService(resolved);
    const resolver = configApi.createInspectorConfigurationResolver(resolved);
    const migration = configApi.migrateSisadPdfmeConfig({});
    const issues = configApi.validateSisadPdfmeConfig({});
    const impact = configApi.classifySisadPdfmeConfigChange(
      configApi.createSisadPdfmeConfig().config,
      resolved.config,
    );

    expect(selectors.selectVisibilityConfig()).toBeTruthy();
    expect(service.getResolvedConfig()).toBeTruthy();
    expect(resolver.inspectorVisible).toBe(true);
    expect(migration.config).toBeTruthy();
    expect(Array.isArray(issues)).toBe(true);
    expect(Array.isArray(impact.touchedPaths)).toBe(true);
  });

  it('exposes the integration barrel and adapter entry points', async () => {
    const integrationApi = await import('@/sisad-pdfme/integration');
    expect(typeof integrationApi.createSchemaController).toBe('function');
    expect(typeof integrationApi.createDocumentsAdapter).toBe('function');
    expect(typeof integrationApi.createRecipientRegistry).toBe('function');
  });
});
