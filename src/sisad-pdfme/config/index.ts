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
export { defaultSisadPdfmeConfig } from '@sisad-pdfme/config/defaultSisadPdfmeConfig';
export { createSisadPdfmeConfig } from '@sisad-pdfme/config/createSisadPdfmeConfig';
export { resolveSisadPdfmeConfig } from '@sisad-pdfme/config/resolveSisadPdfmeConfig';
export { createProfiledConfig, deepMergeProfileConfig } from '@sisad-pdfme/config/profiledConfig';
export { normalizeSisadPdfmeConfig } from '@sisad-pdfme/config/configNormalizer';
export { validateSisadPdfmeConfig } from '@sisad-pdfme/config/configValidation';
export { classifySisadPdfmeConfigChange } from '@sisad-pdfme/config/configChangeImpact';
export { createSisadPdfmeConfigSelectors } from '@sisad-pdfme/config/configSelectors';
export { createSisadPdfmeConfigService } from '@sisad-pdfme/config/SisadPdfmeConfigService';
export { createInspectorConfigurationResolver } from '@sisad-pdfme/config/InspectorConfigurationResolver';
export {
  capabilityInventory,
  capabilityId,
  capabilityIds,
  capabilitiesOfKind,
  findCapability,
  SCHEMA_SURFACES,
  CONTROLLER_DOMAINS,
} from '@sisad-pdfme/config/capabilityInventory';
export { createCapabilityGraph, resolveCapabilityState } from '@sisad-pdfme/config/capabilityGraph';
export { createSchemaCapabilityResolver } from '@sisad-pdfme/config/schemaCapabilityResolver';
export { compileSisadPdfmeConfig, hashResolvedConfig } from '@sisad-pdfme/config/configCompiler';
export {
  CONFIG_PRECEDENCE,
  resolveConfigValue,
  resolveConfigRecord,
} from '@sisad-pdfme/config/configPrecedence';
export {
  planConfigChange,
  disabledCapabilities,
  enabledCapabilities,
  CAPABILITY_FLAGS,
} from '@sisad-pdfme/config/configEffectPlan';

export type {
  CapabilityDescriptor,
  CapabilityId,
  CapabilityKind,
  SchemaSurface,
} from '@sisad-pdfme/config/capabilityInventory';
export type {
  CapabilityGraph,
  CapabilityResolutionContext,
  CapabilityState,
} from '@sisad-pdfme/config/capabilityGraph';
export type {
  SchemaCapabilityContext,
  SchemaCapabilityState,
  SchemaCapabilitySnapshot,
  SchemaCapabilityResolver,
} from '@sisad-pdfme/config/schemaCapabilityResolver';
export type {
  CompiledSisadPdfmeConfig,
  ResolvedConfigIdentity,
} from '@sisad-pdfme/config/configCompiler';
export type {
  ConfigPrecedenceLayer,
  ConfigPrecedenceLayers,
  ResolvedConfigValue,
} from '@sisad-pdfme/config/configPrecedence';
export type {
  CapabilityFlag,
  CapabilityTransition,
  ConfigChangeSet,
  ConfigEffectKind,
} from '@sisad-pdfme/config/configEffectPlan';

export type {
  SisadPdfmeController,
  SisadPdfmeControllerCapabilityDomain,
  SisadPdfmeControllerCapabilityState,
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
} from '@sisad-pdfme/config/SisadPdfmeConfig';
export type {
  SisadPdfmeConfigNormalizationIssue,
  SisadPdfmeConfigNormalizationResult,
} from '@sisad-pdfme/config/configNormalizer';
export type { SisadPdfmeConfigIssue } from '@sisad-pdfme/config/configValidation';
export type { SisadPdfmeConfigChangeImpact } from '@sisad-pdfme/config/configChangeImpact';
export type {
  SisadPdfmeConfigSelectors,
  SisadPdfmeConfigSource,
} from '@sisad-pdfme/config/configSelectors';
export type {
  SisadPdfmeConfigService,
  SisadPdfmeConfigChange,
  SisadPdfmeConfigServiceListener,
} from '@sisad-pdfme/config/SisadPdfmeConfigService';
export type {
  InspectorConfigurationResolver,
} from '@sisad-pdfme/config/InspectorConfigurationResolver';

export type { SisadPdfmeRecipient } from '@sisad-pdfme/recipients/recipientTypes';
