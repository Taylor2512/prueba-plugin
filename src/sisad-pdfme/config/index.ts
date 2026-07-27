/**
 * Barrel público de configuración de SISAD PDFME.
 *
 * Expone el contrato de configuración —valores y tipos— para que el host pueda
 * crear, resolver y tipar la configuración sin imports profundos a archivos
 * internos.
 *
 * Restaurado tras la regresión que vació estos re-exports (CONFIG-001 / Fase 1):
 * `resolveSisadPdfmeConfig` y la mayoría de los tipos públicos habían dejado de
 * exportarse, lo que rompía el barrel público `integration/index.ts`.
 */
export { defaultSisadPdfmeConfig } from './defaultSisadPdfmeConfig.js';
export { createSisadPdfmeConfig } from './createSisadPdfmeConfig.js';
export { resolveSisadPdfmeConfig } from './resolveSisadPdfmeConfig.js';
export { migrateSisadPdfmeConfig } from './configMigration.js';
export { validateSisadPdfmeConfig } from './configValidation.js';
export { classifySisadPdfmeConfigChange } from './configChangeImpact.js';
export { createSisadPdfmeConfigSelectors } from './configSelectors.js';
export { createSisadPdfmeConfigService } from './SisadPdfmeConfigService.js';
export { createInspectorConfigurationResolver } from './InspectorConfigurationResolver.js';

export type {
  SisadPdfmeController,
  SisadPdfmeDocument,
  SisadPdfmeRecipientsAdapter,
  SisadPdfmeDocumentsAdapter,
  SisadPdfmePersistenceAdapter,
  SisadPdfmeSignatureProvider,
  SisadPdfmeSignatureProviderAdapter,
  SisadPdfmeEventName,
  SisadPdfmeEventHandlers,
  SisadPdfmeVisibilityConfig,
  SisadPdfmeUiClassNamesConfig,
  SisadPdfmeUiConfig,
  SisadPdfmeGlobalConfig,
  ResolvedSisadPdfmeConfig,
  SisadPdfmeProviderValue,
  SisadPdfmeProviderProps,
} from './SisadPdfmeConfig.js';
export type {
  SisadPdfmeConfigMigrationIssue,
  SisadPdfmeConfigMigrationResult,
} from './configMigration.js';
export type { SisadPdfmeConfigIssue } from './configValidation.js';
export type { SisadPdfmeConfigChangeImpact } from './configChangeImpact.js';
export type {
  SisadPdfmeConfigSelectors,
  SisadPdfmeConfigSource,
} from './configSelectors.js';
export type {
  SisadPdfmeConfigService,
  SisadPdfmeConfigChange,
  SisadPdfmeConfigServiceListener,
} from './SisadPdfmeConfigService.js';
export type {
  InspectorConfigurationResolver,
} from './InspectorConfigurationResolver.js';

export type { SisadPdfmeRecipient } from '../recipients/recipientTypes.js';
