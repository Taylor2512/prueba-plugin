/**
 * FASE 10 — Tests: Signature Policy y Provider Registry
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  signatureProviderRegistry,
  ProviderNotRegisteredError,
  getAvailableProvidersForSchema,
  getDefaultProviderForSchema,
  type SignatureProvider,
  type SignaturePolicy,
} from '../../src/sisad-pdfme/shared/signatureRegistry.js';

// Provider de prueba mínimo
function makeProvider(key: string): SignatureProvider {
  return {
    key,
    displayName: `Provider ${key}`,
    icon: 'EditOutlined',
    supportsValidation: false,
    requiresBackend: false,
    renderCapture: () => null as unknown as ReturnType<SignatureProvider['renderCapture']>,
    execute: async () => ({ success: true, value: `signed-by-${key}` }),
    validate: () => ({ valid: true }),
  };
}

beforeEach(() => {
  signatureProviderRegistry._clearForTest();
  // Registrar providers base
  signatureProviderRegistry.register(makeProvider('draw'));
  signatureProviderRegistry.register(makeProvider('image'));
  signatureProviderRegistry.register(makeProvider('p12'));
});

describe('SignatureProviderRegistry', () => {
  it('get retorna el provider registrado', () => {
    const p = signatureProviderRegistry.get('draw');
    expect(p.key).toBe('draw');
  });

  it('get lanza ProviderNotRegisteredError para key desconocida', () => {
    expect(() => signatureProviderRegistry.get('nonexistent'))
      .toThrow(ProviderNotRegisteredError);
    expect(() => signatureProviderRegistry.get('nonexistent'))
      .toThrow(/nonexistent/);
    expect(() => signatureProviderRegistry.get('nonexistent'))
      .toThrow(/draw/); // debe mencionar providers disponibles
  });

  it('tryGet retorna undefined sin lanzar', () => {
    expect(signatureProviderRegistry.tryGet('nonexistent')).toBeUndefined();
  });

  it('isRegistered funciona correctamente', () => {
    expect(signatureProviderRegistry.isRegistered('draw')).toBe(true);
    expect(signatureProviderRegistry.isRegistered('nonexistent')).toBe(false);
  });

  it('getAvailable retorna solo los registrados que están en la lista', () => {
    const available = signatureProviderRegistry.getAvailable(['draw', 'nonexistent']);
    expect(available).toHaveLength(1);
    expect(available[0].key).toBe('draw');
  });
});

describe('getAvailableProvidersForSchema', () => {
  const basePolicy: SignaturePolicy = {
    allowedProviders: ['draw'],
    defaultProvider: 'draw',
  };

  it('política global: solo muestra providers permitidos', () => {
    const result = getAvailableProvidersForSchema('schema-1', undefined, basePolicy);
    expect(result.map((p) => p.key)).toEqual(['draw']);
    expect(result.map((p) => p.key)).not.toContain('image');
  });

  it('recipientPolicy sobreescribe política global', () => {
    const policy: SignaturePolicy = {
      ...basePolicy,
      recipientPolicy: {
        'vip': { allowedProviders: ['draw', 'p12'], defaultProvider: 'p12' },
      },
    };
    const result = getAvailableProvidersForSchema('schema-1', 'vip', policy);
    expect(result.map((p) => p.key)).toContain('p12');
    expect(result).toHaveLength(2);
  });

  it('schemaPolicy con forceProvider retorna solo ese provider', () => {
    const policy: SignaturePolicy = {
      ...basePolicy,
      schemaPolicy: {
        'schema-forced': { allowedProviders: ['draw', 'p12'], forceProvider: 'p12' },
      },
    };
    const result = getAvailableProvidersForSchema('schema-forced', 'r-1', policy);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('p12');
  });

  it('provider no registrado en allowedProviders no aparece (no crash)', () => {
    const policy: SignaturePolicy = {
      allowedProviders: ['draw', 'docusign-not-registered'],
      defaultProvider: 'draw',
    };
    const result = getAvailableProvidersForSchema('schema-1', undefined, policy);
    expect(result.map((p) => p.key)).not.toContain('docusign-not-registered');
    expect(result).toHaveLength(1); // solo draw
  });
});

describe('getDefaultProviderForSchema', () => {
  it('retorna el provider por defecto global', () => {
    const policy: SignaturePolicy = { allowedProviders: ['draw', 'p12'], defaultProvider: 'draw' };
    const p = getDefaultProviderForSchema('schema-1', undefined, policy);
    expect(p?.key).toBe('draw');
  });

  it('recipientPolicy sobreescribe el default', () => {
    const policy: SignaturePolicy = {
      allowedProviders: ['draw', 'p12'],
      defaultProvider: 'draw',
      recipientPolicy: { 'r-vip': { allowedProviders: ['draw', 'p12'], defaultProvider: 'p12' } },
    };
    const p = getDefaultProviderForSchema('schema-1', 'r-vip', policy);
    expect(p?.key).toBe('p12');
  });
});
