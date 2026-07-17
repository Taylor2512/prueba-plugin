import { describe, expect, it } from 'vitest';
import { validateSignatureSchema } from '@/sisad-pdfme/schemas/signature/validation';

describe('signature validation', () => {
  it('acepta firma draw sin provider externo', () => {
    const result = validateSignatureSchema({ signatureMode: 'draw' } as any);
    expect(result.isValid).toBe(true);
  });

  it('exige providerKey para modo provider', () => {
    const result = validateSignatureSchema({ signatureMode: 'provider' } as any);
    expect(result.isValid).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain('signature.provider.required');
  });

  it('detecta provider incompatible con modo no-provider', () => {
    const result = validateSignatureSchema({
      signatureMode: 'draw',
      signatureProviderKey: 'oneshot',
    } as any);
    expect(result.errors.map((error) => error.code)).toContain('signature.provider.incompatibleMode');
  });

  it('exige metadata P12 completa', () => {
    const invalid = validateSignatureSchema({ signatureMode: 'p12', signatureMetadata: {} } as any);
    expect(invalid.errors.filter((error) => error.code === 'signature.p12.metadata')).toHaveLength(4);

    const valid = validateSignatureSchema({
      signatureMode: 'p12',
      signatureMetadata: {
        digestAlgorithm: 'SHA256',
        certSubject: 'CN=Tester',
        certIssuer: 'CN=Issuer',
        certSerial: '123',
      },
    } as any);
    expect(valid.isValid).toBe(true);
  });
});
