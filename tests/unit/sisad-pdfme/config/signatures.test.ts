import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { featureRegistry } from '@/sisad-pdfme/config/featureRegistry';
import { validateSisadPdfmeConfig } from '@/sisad-pdfme/config/configValidation';
import {
  createModeAwareDisplay,
  normalizeSignatureSchema,
} from '@/sisad-pdfme/schemas/signature/types';

describe('signature configuration contract', () => {
  it('rejects provider mode without configured providers', () => {
    const issues = validateSisadPdfmeConfig({
      signatures: {
        defaultMode: 'provider',
        providers: [],
      },
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'signatures-provider-missing',
          severity: 'error',
          path: 'signatures.providers',
        }),
      ]),
    );
  });

  it('keeps signatures disabled when the feature flag is off', () => {
    const resolved = createSisadPdfmeConfig({
      signatures: {
        enabled: false,
      },
    });

    const state = featureRegistry.signatures.resolve(resolved, { readOnly: false });

    expect(state.enabled).toBe(false);
    expect(state.visible).toBe(false);
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('signatures-disabled');
  });

  it('normalizes provider-only schema state by mode', () => {
    const normalized = normalizeSignatureSchema({
      signatureMode: 'draw',
      signatureType: 'provider',
      signatureProvider: 'provider-x',
      signatureProviderKey: 'provider-x',
      signatureProviderConfig: {
        endpoint: 'https://example.test',
      },
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

  it('hides provider visuals when the provider cannot render them', () => {
    const display = createModeAwareDisplay('provider', {
      showSignerName: true,
      showSignedAt: true,
      showReason: true,
      showLocation: true,
      showCertificateInfo: true,
      showVisualStamp: true,
    }, {
      supportsVisibleSignature: false,
      supportsCertificateMetadata: false,
      supportsReason: true,
      supportsLocation: false,
    });

    expect(display.showVisualStamp).toBe(false);
    expect(display.showCertificateInfo).toBe(false);
    expect(display.showReason).toBe(true);
    expect(display.showLocation).toBe(false);
  });
});
