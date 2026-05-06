import { describe, expect, it, vi } from 'vitest';
import type { BasePdf, GlobalToken, Template, UIOptions } from '@sisad-pdfme/common';
import generate from '../../src/sisad-pdfme/generator/generate.js';
import {
  builtInSchemaDefinitionsByType,
  flatSchemaPlugins,
} from '../../src/sisad-pdfme/schemas/index.js';
import { validateSignatureSchema } from '../../src/sisad-pdfme/schemas/signature/validation.js';
import { registerSignatureProvider } from '../../src/sisad-pdfme/schemas/signature/providerRegistry.js';
import { normalizeSignatureSchema } from '../../src/sisad-pdfme/schemas/signature/types.js';

const PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9pX6lzQAAAAASUVORK5CYII=';

const basePdf: BasePdf = { width: 210, height: 297, padding: [0, 0, 0, 0] };
const theme = { colorPrimaryBg: '#1677ff' } as GlobalToken;
const options = {} as UIOptions;

describe('signature schema plugin', () => {
  it('registers signature in the built-in schema metadata maps', () => {
    expect(builtInSchemaDefinitionsByType.signature).toMatchObject({
      type: 'signature',
      label: 'Firma',
      category: 'Firma',
    });
    expect(flatSchemaPlugins.signature?.propPanel?.defaultSchema?.type).toBe('signature');
  });

  it('renders an empty signature field with draw affordances by default', () => {
    const rootElement = document.createElement('div');
    const onChange = vi.fn();

    flatSchemaPlugins.signature.ui({
      schema: { ...flatSchemaPlugins.signature.propPanel.defaultSchema, id: 'signature-empty' },
      basePdf,
      mode: 'form',
      value: '',
      onChange,
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.querySelector('button')?.textContent).toContain('Dibujar');
    expect(rootElement.querySelector('input[type="file"]')).toBeNull();
    expect(rootElement.innerHTML.length).toBeGreaterThan(0);
  });

  it('shows upload affordances only in image mode', () => {
    const rootElement = document.createElement('div');

    flatSchemaPlugins.signature.ui({
      schema: {
        ...flatSchemaPlugins.signature.propPanel.defaultSchema,
        id: 'signature-image-mode',
        signatureMode: 'image',
      },
      basePdf,
      mode: 'form',
      value: '',
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.querySelector('input[type="file"]')).not.toBeNull();
    expect(rootElement.textContent).not.toContain('Dibujar');
  });

  it('renders the uploaded image when a signature value exists', () => {
    const rootElement = document.createElement('div');

    flatSchemaPlugins.signature.ui({
      schema: { ...flatSchemaPlugins.signature.propPanel.defaultSchema, id: 'signature-filled' },
      basePdf,
      mode: 'viewer',
      value: PNG_DATA_URL,
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    const image = rootElement.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toContain('data:image/png');
  });

  it('exports a signature field through generator built-ins without explicit plugin injection', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        ...flatSchemaPlugins.signature.propPanel.defaultSchema,
        name: 'signatureField',
        readOnly: true,
        content: PNG_DATA_URL,
      }]],
    };

    const output = await generate({
      template,
      inputs: [{}],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });

  it('validates provider mode against registered provider config', () => {
    registerSignatureProvider({
      key: 'provider.remoto.test',
      label: 'Proveedor remoto',
      capabilities: {
        supportsVisibleSignature: true,
        supportsWebhook: true,
        supportsPolling: false,
        supportsCertificateMetadata: false,
        supportsReason: true,
        supportsLocation: false,
        supportsOtp: false,
        supportsBiometric: false,
      },
      configFields: [
        { key: 'baseUrl', label: 'Base URL', type: 'text', required: true },
      ],
      defaultConfig: {},
    });

    expect(
      validateSignatureSchema({
        type: 'signature',
        name: 'firma_remota',
        signatureMode: 'provider',
        signatureProviderKey: 'provider.remoto.test',
        signatureProviderConfig: {},
      }).isValid,
    ).toBe(false);

    expect(
      validateSignatureSchema({
        type: 'signature',
        name: 'firma_remota',
        signatureMode: 'provider',
        signatureProviderKey: 'provider.remoto.test',
        signatureProviderConfig: { baseUrl: 'https://firma.example.com' },
      }).isValid,
    ).toBe(true);
  });

  it('migrates legacy signatureProvider local_draw to draw mode without external provider key', () => {
    const normalized = normalizeSignatureSchema({
      type: 'signature',
      name: 'legacy_signature',
      signatureProvider: 'local_draw',
      signatureMetadata: {
        digestAlgorithm: 'SHA-256',
      },
    });

    expect(normalized.signatureMode).toBe('draw');
    expect(normalized.signatureProviderKey).toBeNull();
    expect(normalized.signatureMetadata?.digestAlgorithm).toBeUndefined();
  });
});