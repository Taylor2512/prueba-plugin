/**
 * FASE 8 — Provider Registry de Firma (shared)
 *
 * sisad-pdfme NO sabe qué providers existen.
 * El registry es un contenedor de plugins.
 * DigitalAgreements registra providers externos ANTES de montar el designer.
 *
 * Sin import de React aquí — la interfaz usa un tipo opaco para el elemento
 * de captura para evitar dependencias de entorno en el módulo shared.
 *
 * Providers base registrados automáticamente (en ui/):
 *   'draw'  → LocalDrawProvider
 *   'image' → LocalImageProvider
 *   'p12'   → LocalP12Provider (advertencia: clave en cliente, baja seguridad)
 */

// ── Contratos del provider ──────────────────────────────────────────────────

export interface SignatureCaptureContext {
  schemaUid: string;
  recipientId?: string;
  config: Record<string, unknown>;
  onComplete: (result: SignatureResult) => void;
  onCancel: () => void;
}

export interface SignatureExecutionContext extends SignatureCaptureContext {
  documentId: string;
  pageNumber: number;
  templateVersion: string;
}

export type SignatureResult =
  | { success: true; value: string; metadata?: Record<string, unknown> }
  | { success: false; reason: string; recoverable: boolean };

export type SignatureValidation =
  | { valid: true }
  | { valid: false; reason: string };

/**
 * Contrato que todo provider de firma debe implementar.
 * renderCapture retorna un ReactElement — tipado como unknown aquí para
 * no importar React en el módulo shared. Los providers concretos lo tipan correctamente.
 */
export interface SignatureProvider {
  key: string;
  displayName: string;
  icon: string;
  supportsValidation: boolean;
  requiresBackend: boolean;
  renderCapture(ctx: SignatureCaptureContext): unknown;
  execute(ctx: SignatureExecutionContext): Promise<SignatureResult>;
  validate(value: unknown): SignatureValidation;
}

export interface ExternalSignatureAdapter extends SignatureProvider {
  mapSchemaToProviderTab(schema: unknown): unknown;
  reconcileSignatureState(envelopeData: unknown): Map<string, SignatureResult>;
}

// ── Policy ──────────────────────────────────────────────────────────────────

export interface SignaturePolicy {
  allowedProviders: string[];
  defaultProvider: string;
  recipientPolicy?: Record<string, {
    allowedProviders: string[];
    defaultProvider: string;
  }>;
  schemaPolicy?: Record<string, {
    allowedProviders: string[];
    forceProvider?: string;
  }>;
}

// ── Registry ────────────────────────────────────────────────────────────────

export class ProviderNotRegisteredError extends Error {
  constructor(key: string, availableKeys: string[]) {
    super(
      `SignatureProvider '${key}' no está registrado. ` +
      `Registra el provider antes de montar el Designer. ` +
      `Providers disponibles: [${availableKeys.join(', ')}]`,
    );
    this.name = 'ProviderNotRegisteredError';
  }
}

class SignatureProviderRegistryImpl {
  private providers = new Map<string, SignatureProvider>();

  register(provider: SignatureProvider): void {
    this.providers.set(provider.key, provider);
  }

  get(key: string): SignatureProvider {
    const provider = this.providers.get(key);
    if (!provider) {
      throw new ProviderNotRegisteredError(key, Array.from(this.providers.keys()));
    }
    return provider;
  }

  tryGet(key: string): SignatureProvider | undefined {
    return this.providers.get(key);
  }

  getAvailable(allowedKeys: string[]): SignatureProvider[] {
    return allowedKeys
      .map((k) => this.providers.get(k))
      .filter((p): p is SignatureProvider => p !== undefined);
  }

  isRegistered(key: string): boolean {
    return this.providers.has(key);
  }

  getAll(): SignatureProvider[] {
    return Array.from(this.providers.values());
  }

  _clearForTest(): void {
    this.providers.clear();
  }
}

export const signatureProviderRegistry = new SignatureProviderRegistryImpl();

// ── Resolución de providers para el inspector ────────────────────────────────

export function getAvailableProvidersForSchema(
  schemaUid: string,
  currentRecipientId: string | undefined,
  policy: SignaturePolicy,
): SignatureProvider[] {
  const schemaRule = policy.schemaPolicy?.[schemaUid];
  if (schemaRule?.forceProvider) {
    const forced = signatureProviderRegistry.tryGet(schemaRule.forceProvider);
    return forced ? [forced] : [];
  }
  const allowedKeys =
    schemaRule?.allowedProviders ??
    (currentRecipientId
      ? policy.recipientPolicy?.[currentRecipientId]?.allowedProviders
      : undefined) ??
    policy.allowedProviders;
  return signatureProviderRegistry.getAvailable(allowedKeys);
}

export function getDefaultProviderForSchema(
  schemaUid: string,
  currentRecipientId: string | undefined,
  policy: SignaturePolicy,
): SignatureProvider | undefined {
  const schemaRule = policy.schemaPolicy?.[schemaUid];
  if (schemaRule?.forceProvider) {
    return signatureProviderRegistry.tryGet(schemaRule.forceProvider);
  }
  const defaultKey =
    (currentRecipientId
      ? policy.recipientPolicy?.[currentRecipientId]?.defaultProvider
      : undefined) ??
    policy.defaultProvider;
  return signatureProviderRegistry.tryGet(defaultKey);
}
