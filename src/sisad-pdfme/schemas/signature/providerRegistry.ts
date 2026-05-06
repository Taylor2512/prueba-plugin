import type { DesignerEngine } from '../../ui/designerEngine.js';
import type { SignatureProviderConfig, SignatureProviderKey } from './types.js';

export type SignatureProviderDefinition = {
  key: string;
  label: string;
  description?: string;
  internal?: boolean;
  badges?: string[];
  capabilities: {
    supportsVisibleSignature: boolean;
    supportsWebhook: boolean;
    supportsPolling: boolean;
    supportsCertificateMetadata: boolean;
    supportsReason: boolean;
    supportsLocation: boolean;
    supportsOtp: boolean;
    supportsBiometric: boolean;
  };
  defaultConfig?: SignatureProviderConfig;
  configFields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'password' | 'select' | 'switch' | 'number';
    required?: boolean;
    options?: Array<{ label: string; value: string }>;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
  }>;
  sanitizeConfig?: (input: SignatureProviderConfig) => SignatureProviderConfig;
  validateConfig?: (input: SignatureProviderConfig) => string[];
};

export type SignatureProviderSource = {
  providers?: SignatureProviderDefinition[];
};

const registry = new Map<string, SignatureProviderDefinition>();

const cloneDefinition = (definition: SignatureProviderDefinition): SignatureProviderDefinition => ({
  ...definition,
  badges: definition.badges ? [...definition.badges] : undefined,
  capabilities: { ...definition.capabilities },
  defaultConfig: definition.defaultConfig ? { ...definition.defaultConfig } : undefined,
  configFields: definition.configFields?.map((field) => ({
    ...field,
    options: field.options?.map((option) => ({ ...option })),
  })),
});

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const mergeProviderLists = (
  base: SignatureProviderDefinition[],
  overrides: SignatureProviderDefinition[] = [],
) => {
  const merged = new Map<string, SignatureProviderDefinition>();
  [...base, ...overrides].forEach((definition) => {
    const key = normalizeText(definition?.key);
    if (!key) return;
    merged.set(key, cloneDefinition({ ...definition, key }));
  });
  return Array.from(merged.values());
};

export const registerSignatureProvider = (definition: SignatureProviderDefinition) => {
  const key = normalizeText(definition?.key);
  if (!key) return null;
  const normalized = cloneDefinition({ ...definition, key });
  registry.set(key, normalized);
  return cloneDefinition(normalized);
};

export const registerSignatureProviders = (definitions: SignatureProviderDefinition[] = []) => {
  definitions.forEach((definition) => registerSignatureProvider(definition));
  return getAvailableSignatureProviders(undefined, { includeInternal: true });
};

export const resolveSignatureProviderSource = (value: unknown): SignatureProviderSource => {
  if (!value || typeof value !== 'object') return {};
  const candidate = value as {
    providers?: SignatureProviderDefinition[];
    signature?: { providers?: SignatureProviderDefinition[] };
    designerEngine?: DesignerEngine;
  };
  if (Array.isArray(candidate.providers)) return { providers: candidate.providers };
  if (candidate.signature && Array.isArray(candidate.signature.providers)) {
    return { providers: candidate.signature.providers };
  }
  if (candidate.designerEngine) return resolveSignatureProviderSource(candidate.designerEngine);
  return {};
};

export const getAvailableSignatureProviders = (
  source?: SignatureProviderSource,
  options: { includeInternal?: boolean } = {},
) => {
  const providers = mergeProviderLists(Array.from(registry.values()), source?.providers || []);
  if (options.includeInternal) return providers;
  return providers.filter((provider) => provider.internal !== true);
};

export const getSignatureProvider = (
  key: SignatureProviderKey | null | undefined,
  source?: SignatureProviderSource,
) => {
  const normalizedKey = normalizeText(key);
  if (!normalizedKey) return null;
  return (
    getAvailableSignatureProviders(source, { includeInternal: true }).find((provider) => provider.key === normalizedKey) ||
    null
  );
};

export const hasSignatureProvider = (key: SignatureProviderKey | null | undefined, source?: SignatureProviderSource) =>
  Boolean(getSignatureProvider(key, source));

export const sanitizeSignatureProviderConfig = (
  key: SignatureProviderKey | null | undefined,
  input: SignatureProviderConfig = {},
  source?: SignatureProviderSource,
) => {
  const provider = getSignatureProvider(key, source);
  if (!provider) return { ...(input || {}) };
  return provider.sanitizeConfig ? provider.sanitizeConfig({ ...(input || {}) }) : { ...(input || {}) };
};

export const validateSignatureProviderConfig = (
  key: SignatureProviderKey | null | undefined,
  input: SignatureProviderConfig = {},
  source?: SignatureProviderSource,
) => {
  const provider = getSignatureProvider(key, source);
  if (!provider) {
    return key ? ['El proveedor seleccionado no esta registrado.'] : ['Selecciona un proveedor externo.'];
  }

  const sanitized = sanitizeSignatureProviderConfig(provider.key, input, source);
  const errors: string[] = [];

  (provider.configFields || []).forEach((field) => {
    if (!field.required) return;
    const value = sanitized[field.key];
    if (field.type === 'switch') {
      if (value === undefined || value === null) errors.push(`Completa ${field.label}.`);
      return;
    }
    if (value === undefined || value === null || String(value).trim() === '') {
      errors.push(`Completa ${field.label}.`);
    }
  });

  if (provider.validateConfig) {
    errors.push(...provider.validateConfig(sanitized));
  }

  return errors;
};

registerSignatureProviders([
  {
    key: 'local_draw',
    label: 'Firma dibujada local',
    description: 'Renderizado interno para firma dibujada.',
    internal: true,
    badges: ['local'],
    capabilities: {
      supportsVisibleSignature: true,
      supportsWebhook: false,
      supportsPolling: false,
      supportsCertificateMetadata: false,
      supportsReason: false,
      supportsLocation: false,
      supportsOtp: false,
      supportsBiometric: false,
    },
    defaultConfig: {},
  },
  {
    key: 'local_image',
    label: 'Imagen local',
    description: 'Renderizado interno para firma por imagen.',
    internal: true,
    badges: ['local'],
    capabilities: {
      supportsVisibleSignature: true,
      supportsWebhook: false,
      supportsPolling: false,
      supportsCertificateMetadata: false,
      supportsReason: false,
      supportsLocation: false,
      supportsOtp: false,
      supportsBiometric: false,
    },
    defaultConfig: {},
  },
  {
    key: 'local_p12',
    label: 'P12 local',
    description: 'Configuracion local para firma con certificado P12.',
    internal: true,
    badges: ['local', 'p12'],
    capabilities: {
      supportsVisibleSignature: true,
      supportsWebhook: false,
      supportsPolling: false,
      supportsCertificateMetadata: true,
      supportsReason: true,
      supportsLocation: true,
      supportsOtp: false,
      supportsBiometric: false,
    },
    defaultConfig: {},
  },
]);