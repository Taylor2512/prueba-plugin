import { describe, expect, it } from 'vitest';
import { validateSignatureSchema } from '@/sisad-pdfme/schemas/signature/validation';

describe('sisad-pdfme/schemas/signature/validation.ts', () => {
  it('flags empty P12 metadata fields as invalid', () => {
    const result = validateSignatureSchema({
      signatureMode: 'p12',
      signatureMetadata: {
        digestAlgorithm: 'SHA-256',
        certSubject: '   ',
        certIssuer: '',
        certSerial: null,
      },
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.map((error) => error.field)).toEqual(
      expect.arrayContaining([
        'signatureMetadata.certSubject',
        'signatureMetadata.certIssuer',
        'signatureMetadata.certSerial',
      ]),
    );
  });

  it('accepts complete P12 metadata', () => {
    const result = validateSignatureSchema({
      signatureMode: 'p12',
      signatureMetadata: {
        digestAlgorithm: 'SHA-512',
        certSubject: 'CN=Signer',
        certIssuer: 'CN=Issuer',
        certSerial: '123456',
      },
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
