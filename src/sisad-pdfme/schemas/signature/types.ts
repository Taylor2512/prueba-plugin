import type { Schema } from '@sisad-pdfme/common';

export type SignatureMode = 'draw' | 'image' | 'p12' | 'provider';
export type SignatureProviderKey = string;
export type SignatureProviderConfig = Record<string, unknown>;
export type SignatureProviderStatus = 'pending' | 'ready' | 'completed' | 'failed' | 'expired';
export type SignatureProviderDisplay = {
  label?: string;
  badge?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
};

export type SignatureCapabilities = {
  allowDraw: boolean;
  allowUploadImage: boolean;
  allowP12: boolean;
  allowExternalProvider: boolean;
  allowClear: boolean;
  allowReplace: boolean;
  allowPreview: boolean;
};

export type SignatureDisplayConfig = {
  showSignerName: boolean;
  showSignedAt: boolean;
  showReason: boolean;
  showLocation: boolean;
  showCertificateInfo: boolean;
  showVisualStamp: boolean;
};

export type SignatureProviderSupport = {
  supportsVisibleSignature?: boolean;
  supportsCertificateMetadata?: boolean;
  supportsReason?: boolean;
  supportsLocation?: boolean;
};

export const SIGNATURE_MODE_OPTIONS: Array<{ value: SignatureMode; label: string }> = [
  { value: 'draw', label: 'Firma dibujada' },
  { value: 'image', label: 'Firma por imagen' },
  { value: 'p12', label: 'Firma con certificado P12' },
  { value: 'provider', label: 'Proveedor externo' },
];

export const SIGNATURE_TYPE_OPTIONS = SIGNATURE_MODE_OPTIONS;

export const DEFAULT_SIGNATURE_CAPABILITIES: SignatureCapabilities = {
  allowDraw: true,
  allowUploadImage: true,
  allowP12: true,
  allowExternalProvider: true,
  allowClear: true,
  allowReplace: true,
  allowPreview: true,
};

export const DEFAULT_SIGNATURE_DISPLAY: SignatureDisplayConfig = {
  showSignerName: true,
  showSignedAt: true,
  showReason: false,
  showLocation: false,
  showCertificateInfo: false,
  showVisualStamp: true,
};

const MODE_CAPABILITIES: Record<SignatureMode, SignatureCapabilities> = {
  draw: {
    allowDraw: true,
    allowUploadImage: false,
    allowP12: false,
    allowExternalProvider: false,
    allowClear: true,
    allowReplace: true,
    allowPreview: true,
  },
  image: {
    allowDraw: false,
    allowUploadImage: true,
    allowP12: false,
    allowExternalProvider: false,
    allowClear: true,
    allowReplace: true,
    allowPreview: true,
  },
  p12: {
    allowDraw: false,
    allowUploadImage: false,
    allowP12: true,
    allowExternalProvider: false,
    allowClear: false,
    allowReplace: true,
    allowPreview: true,
  },
  provider: {
    allowDraw: false,
    allowUploadImage: false,
    allowP12: false,
    allowExternalProvider: true,
    allowClear: false,
    allowReplace: true,
    allowPreview: true,
  },
};

const MODE_DISPLAY: Record<SignatureMode, SignatureDisplayConfig> = {
  draw: {
    showSignerName: true,
    showSignedAt: true,
    showReason: false,
    showLocation: false,
    showCertificateInfo: false,
    showVisualStamp: true,
  },
  image: {
    showSignerName: true,
    showSignedAt: true,
    showReason: false,
    showLocation: false,
    showCertificateInfo: false,
    showVisualStamp: true,
  },
  p12: {
    showSignerName: true,
    showSignedAt: true,
    showReason: true,
    showLocation: true,
    showCertificateInfo: true,
    showVisualStamp: true,
  },
  provider: {
    showSignerName: true,
    showSignedAt: true,
    showReason: true,
    showLocation: false,
    showCertificateInfo: false,
    showVisualStamp: true,
  },
};

const LEGACY_PROVIDER_MODE_MAP: Record<string, SignatureMode> = {
  local_draw: 'draw',
  local_image: 'image',
  local_p12: 'p12',
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const SIGNATURE_PROVIDER_STATUS_VALUES = new Set<SignatureProviderStatus>([
  'pending',
  'ready',
  'completed',
  'failed',
  'expired',
]);

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : {};

const normalizeSignatureProviderDisplay = (
  value: unknown,
): SignatureProviderDisplay | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  const toneValue = normalizeText(record.tone);
  const tone = toneValue === 'neutral' || toneValue === 'success' || toneValue === 'warning' || toneValue === 'danger'
    ? toneValue
    : undefined;

  return {
    label: normalizeText(record.label) || undefined,
    badge: normalizeText(record.badge) || undefined,
    tone,
  };
};

const normalizeSignatureProviderStatus = (value: unknown): SignatureProviderStatus | undefined => {
  const normalized = normalizeText(value);
  return SIGNATURE_PROVIDER_STATUS_VALUES.has(normalized as SignatureProviderStatus)
    ? (normalized as SignatureProviderStatus)
    : undefined;
};

const isSignatureMode = (value: unknown): value is SignatureMode =>
  value === 'draw' || value === 'image' || value === 'p12' || value === 'provider';

export const resolveLegacySignatureMode = (schema: Partial<SignatureSchema> | undefined): SignatureMode => {
  const explicitMode = schema?.signatureMode;
  if (isSignatureMode(explicitMode)) return explicitMode;

  const legacyType = schema?.signatureType;
  if (isSignatureMode(legacyType)) return legacyType;

  const providerKey = normalizeText(schema?.signatureProviderKey || schema?.signatureProvider);
  if (!providerKey) return 'draw';
  if (LEGACY_PROVIDER_MODE_MAP[providerKey]) return LEGACY_PROVIDER_MODE_MAP[providerKey];
  return 'provider';
};

export const resolveSignatureProviderKey = (schema: Partial<SignatureSchema> | undefined, mode?: SignatureMode) => {
  const resolvedMode = mode || resolveLegacySignatureMode(schema);
  if (resolvedMode !== 'provider') return null;

  const explicitProviderKey = normalizeText(schema?.signatureProviderKey);
  const legacyProvider = normalizeText(schema?.signatureProvider);
  const providerKey = explicitProviderKey || legacyProvider;
  if (!providerKey) return undefined;
  return providerKey;
};

export const sanitizeSignatureMetadata = (
  input: Record<string, unknown> | undefined,
  mode: SignatureMode,
) => {
  const next = asRecord(input);

  if (mode !== 'p12') {
    delete next.digestAlgorithm;
    delete next.certSubject;
    delete next.certIssuer;
    delete next.certSerial;
  }
  if (mode !== 'provider') {
    delete next.providerStatus;
    delete next.callbackUrl;
    delete next.flow;
  }
  if (mode !== 'image') {
    delete next.imageFit;
    delete next.transparentBackground;
  }
  if (mode !== 'draw') {
    delete next.guideText;
  }
  if (mode !== 'p12' && mode !== 'provider') {
    delete next.reason;
    delete next.location;
  }

  next.signedAt = next.signedAt ?? null;

  if (mode === 'p12') {
    next.digestAlgorithm = normalizeText(next.digestAlgorithm) || 'SHA-256';
    next.certSubject = normalizeText(next.certSubject);
    next.certIssuer = normalizeText(next.certIssuer);
    next.certSerial = normalizeText(next.certSerial);
    next.reason = normalizeText(next.reason);
    next.location = normalizeText(next.location);
  }

  if (mode === 'provider') {
    next.providerStatus = normalizeText(next.providerStatus) || 'pending';
  }

  if (mode === 'image') {
    next.imageFit = normalizeText(next.imageFit) || 'contain';
    next.transparentBackground = next.transparentBackground === true;
  }

  if (mode === 'draw') {
    next.guideText = normalizeText(next.guideText);
  }

  return next;
};

export const createModeAwareCapabilities = (
  mode: SignatureMode,
  current?: Partial<SignatureCapabilities>,
): SignatureCapabilities => ({
  allowDraw: MODE_CAPABILITIES[mode].allowDraw,
  allowUploadImage: MODE_CAPABILITIES[mode].allowUploadImage,
  allowP12: MODE_CAPABILITIES[mode].allowP12,
  allowExternalProvider: MODE_CAPABILITIES[mode].allowExternalProvider,
  allowClear: current?.allowClear ?? MODE_CAPABILITIES[mode].allowClear,
  allowReplace: current?.allowReplace ?? MODE_CAPABILITIES[mode].allowReplace,
  allowPreview: current?.allowPreview ?? MODE_CAPABILITIES[mode].allowPreview,
});

export const createModeAwareDisplay = (
  mode: SignatureMode,
  current?: Partial<SignatureDisplayConfig>,
  providerSupport?: SignatureProviderSupport,
): SignatureDisplayConfig => {
  const next: SignatureDisplayConfig = {
    ...MODE_DISPLAY[mode],
    ...(current || {}),
  };

  if (providerSupport?.supportsVisibleSignature === false) next.showVisualStamp = false;
  if (providerSupport?.supportsCertificateMetadata === false) next.showCertificateInfo = false;
  if (providerSupport?.supportsReason === false) next.showReason = false;
  if (providerSupport?.supportsLocation === false) next.showLocation = false;

  return next;
};

export interface SignatureSchema extends Schema {
  placeholderText?: string;
  strokeColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  signatureMode?: SignatureMode;
  signatureType?: SignatureMode | string;
  signatureProvider?: string | null;
  signatureProviderKey?: SignatureProviderKey | null;
  signatureProviderConfig?: SignatureProviderConfig;
  signatureProviderStatus?: SignatureProviderStatus;
  signatureProviderDisplay?: SignatureProviderDisplay;
  signatureCapabilities?: Partial<SignatureCapabilities>;
  signatureDisplay?: Partial<SignatureDisplayConfig>;
  signatureMetadata?: Record<string, unknown>;
}

export const normalizeSignatureSchema = (
  schema: Partial<SignatureSchema> | undefined,
  providerSupport?: SignatureProviderSupport,
): SignatureSchema => {
  const baseSchema = (schema || {}) as SignatureSchema;
  const signatureMode = resolveLegacySignatureMode(baseSchema);
  const signatureProviderKey = resolveSignatureProviderKey(baseSchema, signatureMode);
  const signatureProviderConfig = signatureMode === 'provider' ? asRecord(baseSchema.signatureProviderConfig) : {};
  const signatureProviderStatus =
    signatureMode === 'provider' ? normalizeSignatureProviderStatus(baseSchema.signatureProviderStatus) : undefined;
  const signatureProviderDisplay =
    signatureMode === 'provider' ? normalizeSignatureProviderDisplay(baseSchema.signatureProviderDisplay) : undefined;
  return {
    ...baseSchema,
    signatureMode,
    signatureType: signatureMode,
    signatureProvider: signatureMode === 'provider' ? normalizeText(baseSchema.signatureProvider) || undefined : undefined,
    signatureProviderKey,
    signatureProviderConfig,
    signatureProviderStatus,
    signatureProviderDisplay,
    signatureCapabilities: createModeAwareCapabilities(signatureMode, baseSchema.signatureCapabilities),
    signatureDisplay: createModeAwareDisplay(signatureMode, baseSchema.signatureDisplay, providerSupport),
    signatureMetadata: sanitizeSignatureMetadata(baseSchema.signatureMetadata, signatureMode),
  };
};
