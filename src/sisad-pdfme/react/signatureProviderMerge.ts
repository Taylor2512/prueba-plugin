/**
 * Normalización y merge de `signatureProviders` entregados por el host.
 *
 * Vive fuera de `SisadPdfmeDesigner` porque el Designer no es la única
 * superficie que adopta firmas: el runtime de formulario recibe la misma prop
 * pública y debe resolverla con las mismas reglas. Duplicar la normalización
 * fue precisamente lo que dejó `signatureProviders` declarado pero inerte en
 * `SisadPdfmePreviewRuntime`.
 */
import type { SignatureProviderDefinition } from '../schemas/signature/providerRegistry.js';

/**
 * Convierte un provider opaco del host en una definición tipada.
 *
 * Devuelve `null` si el valor no es un objeto: el host puede mandar `null`,
 * strings o entradas a medio construir y el runtime no debe romperse por ello.
 */
export const normalizeSignatureProvider = (
  provider: unknown,
): SignatureProviderDefinition | null => {
  if (!provider || typeof provider !== 'object') return null;
  const record = provider as Record<string, unknown>;
  const capabilities =
    record.capabilities && typeof record.capabilities === 'object'
      ? (record.capabilities as Record<string, boolean>)
      : {};
  return {
    key: String(record.key ?? '').trim() || 'provider',
    label: String(record.label ?? '').trim() || 'Provider',
    description: String(record.description ?? '').trim() || undefined,
    internal: false,
    capabilities: {
      supportsVisibleSignature: capabilities.supportsVisibleSignature !== false,
      supportsWebhook: capabilities.supportsWebhook === true,
      supportsPolling: capabilities.supportsPolling === true,
      supportsCertificateMetadata: capabilities.supportsCertificateMetadata === true,
      supportsReason: capabilities.supportsReason === true,
      supportsLocation: capabilities.supportsLocation === true,
      supportsOtp: capabilities.supportsOtp === true,
      supportsBiometric: capabilities.supportsBiometric === true,
    },
    defaultConfig:
      record.metadata && typeof record.metadata === 'object'
        ? (record.metadata as Record<string, unknown>)
        : undefined,
  };
};

/**
 * Une los providers de la configuración con los del host.
 *
 * El host gana ante una colisión de `key`: es quien conoce credenciales y
 * endpoints reales de la instalación.
 */
export const mergeSignatureProviders = (
  baseProviders: readonly SignatureProviderDefinition[] | undefined,
  hostProviders: unknown[] | undefined,
): SignatureProviderDefinition[] => {
  const extraProviders = Array.isArray(hostProviders)
    ? (hostProviders
        .map(normalizeSignatureProvider)
        .filter(Boolean) as SignatureProviderDefinition[])
    : [];
  const byKey = new Map<string, SignatureProviderDefinition>();
  [...(baseProviders || []), ...extraProviders].forEach((provider) => {
    if (!provider?.key) return;
    byKey.set(provider.key, provider);
  });
  return Array.from(byKey.values());
};
