import { createDesignerRuntimeEventHub } from '../ui/components/Designer/shared/designerExtensions.js';
import { DesignerEngineBuilder } from '../ui/designerEngine.js';
import { buildRuntimeOptions } from '../runtime/options.js';
import { defaultSisadPdfmeConfig, defaultSisadPdfmeVisibilityConfig } from './defaultSisadPdfmeConfig.js';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
  SisadPdfmeDocumentsAdapter,
  SisadPdfmePersistenceAdapter,
  SisadPdfmeRecipientsAdapter,
  SisadPdfmeSignatureProviderAdapter,
  SisadPdfmeSignatureProvider,
} from './SisadPdfmeConfig.js';

const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const deepMerge = <T extends Record<string, unknown>>(base: T, patch?: Record<string, unknown>): T => {
  if (!isObject(patch)) return { ...base };
  const next = { ...base } as Record<string, unknown>;
  Object.entries(patch).forEach(([key, value]) => {
    const current = next[key];
    if (isObject(current) && isObject(value)) {
      next[key] = deepMerge(current, value);
      return;
    }
    if (Array.isArray(value)) {
      next[key] = value.slice();
      return;
    }
    next[key] = value;
  });
  return next as T;
};

const normalizeText = (value: unknown) => String(value ?? '').trim();

const createRecipientsAdapter = (): SisadPdfmeRecipientsAdapter<unknown> => ({
  toRecipient(input) {
    if (isObject(input)) {
      const id = normalizeText(input.id ?? input.recipientId ?? input.userId);
      return {
        id: id || normalizeText(input.label ?? input.name) || 'recipient',
        label: normalizeText(input.label ?? input.name) || id || 'Recipient',
        role: normalizeText(input.role) || undefined,
        email: normalizeText(input.email) || undefined,
        color: normalizeText(input.color) || undefined,
        metadata: input,
      };
    }
    const value = normalizeText(input);
    return { id: value || 'recipient', label: value || 'Recipient' };
  },
  toRecipients(input) {
    return Array.isArray(input) ? input.map((entry) => this.toRecipient(entry)) : [];
  },
});

const createDocumentsAdapter = (): SisadPdfmeDocumentsAdapter<unknown> => ({
  toDocument(input) {
    if (isObject(input)) {
      const id = normalizeText(input.id ?? input.documentId ?? input.fileId);
      return {
        id: id || normalizeText(input.label ?? input.name) || 'document',
        label: normalizeText(input.label ?? input.name) || id || 'Document',
        pageCount: typeof input.pageCount === 'number' ? input.pageCount : undefined,
        basePdf: input.basePdf,
        metadata: input,
      };
    }
    const value = normalizeText(input);
    return { id: value || 'document', label: value || 'Document' };
  },
  toDocuments(input) {
    return Array.isArray(input) ? input.map((entry) => this.toDocument(entry)) : [];
  },
});

const createPersistenceAdapter = (): SisadPdfmePersistenceAdapter<unknown> => ({
  serializeSnapshot(snapshot) {
    return JSON.stringify(snapshot ?? null);
  },
  deserializeSnapshot(value) {
    if (!value) return null;
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return null;
    }
  },
});

const createSignatureProviderAdapter = (): SisadPdfmeSignatureProviderAdapter<unknown> => ({
  toProvider(input) {
    if (isObject(input)) {
      return {
        key: normalizeText(input.key) || normalizeText(input.id) || 'provider',
        label: normalizeText(input.label) || normalizeText(input.name) || 'Provider',
        description: normalizeText(input.description) || undefined,
        capabilities: isObject(input.capabilities) ? (input.capabilities as Record<string, boolean>) : undefined,
        metadata: input,
      };
    }
    const value = normalizeText(input);
    return { key: value || 'provider', label: value || 'Provider' };
  },
  toProviders(input) {
    return Array.isArray(input) ? input.map((entry) => this.toProvider(entry)) : [];
  },
});

export const resolveSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): ResolvedSisadPdfmeConfig => {
  const config = deepMerge(defaultSisadPdfmeConfig as unknown as Record<string, unknown>, input as Record<string, unknown>) as ResolvedSisadPdfmeConfig['config'];
  const visibility = deepMerge(
    defaultSisadPdfmeVisibilityConfig as unknown as Record<string, unknown>,
    input.visibility as Record<string, unknown> | undefined,
  ) as ResolvedSisadPdfmeConfig['visibility'];
  const hiddenCatalogTypes = Object.entries(visibility.schemas.catalog || {})
    .filter(([, isVisible]) => isVisible === false)
    .map(([schemaType]) => schemaType);
  const designerEngine = new DesignerEngineBuilder()
    .withCanvasFeatureToggles({
      selecto: config.canvas.selecto,
      moveable: config.canvas.moveable,
      snapLines: config.canvas.snapLines,
      guides: config.canvas.guides,
    })
    .withCanvasUseDefaultStyles(true)
    .withAutoAttachIdentity(config.schemas.autoAttachIdentity)
    .withSignatureProviders((config.signatures.providers || []).map((provider: SisadPdfmeSignatureProvider) => ({
      key: provider.key,
      label: provider.label,
      description: provider.description,
      internal: false,
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
    })))
    .withSignatureDefaultProviderKey(config.signatures.defaultMode === 'provider' ? config.signatures.providers?.[0]?.key || null : null)
    .withCollaboration({
      enabled: Boolean(config.collaboration.enabled),
      // `recipients.activeRecipientId` es la fuente preferida; `collaboration`
      // se mantiene como compatibilidad para configs previas al registry.
      activeRecipientId:
        config.recipients.activeRecipientId ?? config.collaboration.activeRecipientId ?? null,
      canEditStructure: config.collaboration.canEditStructure,
    })
    .build();

  return {
    raw: input,
    config,
    visibility,
    runtimeOptions: buildRuntimeOptions({
      lang: config.app.locale || 'es',
      runtimeOptions: {
        readonly: config.runtime.readonly,
        isolateDomEvents: config.runtime.isolateDomEvents,
        preserveSelectionOnModalClose: config.runtime.preserveSelectionOnModalClose,
        runtimeMode: config.runtime.mode,
        app: config.app,
        runtime: config.runtime,
        theme: config.theme,
        canvas: config.canvas,
        sidebars: config.sidebars,
        schemas: config.schemas,
        recipients: config.recipients,
        collaboration: config.collaboration,
        assignment: config.assignment,
        documents: config.documents,
        signatures: config.signatures,
        persistence: config.persistence,
        debug: config.debug,
        visibility,
        hiddenCatalogTypes,
      },
      themeToken: config.theme.tokens as never,
    }),
    designerEngine,
    adapters: {
      recipients: createRecipientsAdapter(),
      documents: createDocumentsAdapter(),
      persistence: createPersistenceAdapter(),
      signatures: createSignatureProviderAdapter(),
    },
    eventHub: createDesignerRuntimeEventHub(),
  };
};
