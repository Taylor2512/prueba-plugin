import { describe, it, expect } from 'vitest';
import {
  createModeAwareCapabilities,
  normalizeSignatureSchema,
  resolveLegacySignatureMode,
} from '@/sisad-pdfme/schemas/signature/types';

describe('sisad-pdfme/schemas/signature/types.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(normalizeSignatureSchema).toBeTruthy();
  });

  it('normalizes signatureType to the resolved signatureMode', () => {
    const normalized = normalizeSignatureSchema({
      signatureMode: 'provider',
      signatureType: 'legacy-draw',
      signatureProviderKey: 'external-provider',
    });

    expect(normalized.signatureMode).toBe('provider');
    expect(normalized.signatureType).toBe('provider');
    expect(resolveLegacySignatureMode(normalized)).toBe('provider');
  });

  it('resolves legacy signatureType when signatureMode is missing', () => {
    const normalized = normalizeSignatureSchema({
      signatureType: 'image',
      signatureProviderKey: null,
    });

    expect(normalized.signatureMode).toBe('image');
    expect(normalized.signatureType).toBe('image');
    expect(resolveLegacySignatureMode(normalized)).toBe('image');
  });

  it('clears provider state when the mode is not provider', () => {
    const normalized = normalizeSignatureSchema({
      signatureMode: 'draw',
      signatureType: 'provider',
      signatureProvider: 'provider-x',
      signatureProviderKey: 'provider-x',
      signatureProviderConfig: { endpoint: 'https://example.com' },
      signatureProviderStatus: 'ready',
      signatureProviderDisplay: {
        label: 'Provider X',
        badge: 'Ready',
        tone: 'success',
      },
    });

    expect(normalized.signatureMode).toBe('draw');
    expect(normalized.signatureType).toBe('draw');
    expect(normalized.signatureProvider).toBeUndefined();
    expect(normalized.signatureProviderKey).toBeNull();
    expect(normalized.signatureProviderConfig).toEqual({});
    expect(normalized.signatureProviderStatus).toBeUndefined();
    expect(normalized.signatureProviderDisplay).toBeUndefined();
  });

  it('clamps mode-specific capabilities while preserving generic ones', () => {
    const capabilities = createModeAwareCapabilities('draw', {
      allowDraw: false,
      allowUploadImage: true,
      allowP12: true,
      allowExternalProvider: true,
      allowClear: false,
      allowReplace: false,
      allowPreview: false,
    });

    expect(capabilities).toEqual({
      allowDraw: true,
      allowUploadImage: false,
      allowP12: false,
      allowExternalProvider: false,
      allowClear: false,
      allowReplace: false,
      allowPreview: false,
    });
  });
});
