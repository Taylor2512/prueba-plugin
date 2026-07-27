import { describe, expect, it } from 'vitest';
import * as configApi from '@/sisad-pdfme/config';
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
    const configServiceApi = await import('@/sisad-pdfme/react/useSisadPdfmeConfigService');
    const featureApi = await import('@/sisad-pdfme/react/useSisadPdfmeFeature');
    const actionApi = await import('@/sisad-pdfme/react/useSisadPdfmeAction');
    const componentApi = await import('@/sisad-pdfme/react/useSisadPdfmeComponent');
    expect(typeof configServiceApi.useSisadPdfmeConfigService).toBe('function');
    expect(typeof featureApi.useSisadPdfmeFeature).toBe('function');
    expect(typeof actionApi.useSisadPdfmeAction).toBe('function');
    expect(typeof componentApi.useSisadPdfmeComponent).toBe('function');
  });

  it('resolveSisadPdfmeConfig({}) produces a resolved config', () => {
    const resolved = configApi.resolveSisadPdfmeConfig({});
    expect(resolved).toBeTruthy();
    expect(typeof resolved).toBe('object');
  });
});
