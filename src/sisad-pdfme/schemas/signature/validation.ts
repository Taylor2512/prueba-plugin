import { getSignatureProvider, validateSignatureProviderConfig, type SignatureProviderDefinition } from './providerRegistry.js';
import { normalizeSignatureSchema, type SignatureSchema } from './types.js';

export type SignatureValidationResult = {
  isValid: boolean;
  errors: Array<{
    code: string;
    field: string;
    message: string;
  }>;
};

export const validateSignatureSchema = (
  schema: Partial<SignatureSchema>,
  providers?: SignatureProviderDefinition[],
): SignatureValidationResult => {
  const source = { providers };
  const provider = getSignatureProvider(schema.signatureProviderKey || schema.signatureProvider, source);
  const normalized = normalizeSignatureSchema(schema, provider?.capabilities);
  const errors: SignatureValidationResult['errors'] = [];

  if (normalized.signatureMode === 'provider') {
    if (!normalized.signatureProviderKey) {
      errors.push({
        code: 'signature.provider.required',
        field: 'signatureProviderKey',
        message: 'Selecciona un proveedor externo para la firma.',
      });
    }

    const configErrors = validateSignatureProviderConfig(
      normalized.signatureProviderKey,
      normalized.signatureProviderConfig || {},
      source,
    );
    configErrors.forEach((message) => {
      errors.push({
        code: 'signature.provider.config',
        field: 'signatureProviderConfig',
        message,
      });
    });
  }

  if (normalized.signatureMode === 'p12') {
    const metadata = normalized.signatureMetadata || {};
    const hasMeaningfulValue = (value: unknown) =>
      typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
    ['digestAlgorithm', 'certSubject', 'certIssuer', 'certSerial'].forEach((field) => {
      if (!hasMeaningfulValue(metadata[field])) {
        errors.push({
          code: 'signature.p12.metadata',
          field: `signatureMetadata.${field}`,
          message: `Falta ${field} en la metadata de firma P12.`,
        });
      }
    });
  }

  if (normalized.signatureMode !== 'provider' && normalized.signatureProviderKey) {
    errors.push({
      code: 'signature.provider.incompatibleMode',
      field: 'signatureProviderKey',
      message: 'El proveedor externo solo aplica cuando el modo es provider.',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
