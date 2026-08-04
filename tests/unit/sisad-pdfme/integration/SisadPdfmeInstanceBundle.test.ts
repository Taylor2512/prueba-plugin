import { describe, expect, it } from 'vitest';
import {
  createSisadPdfmeInstanceBundle,
  parseSisadPdfmeInstanceBundle,
  restoreSisadPdfmeInstanceBundle,
  serializeSisadPdfmeInstanceBundle,
  validateSisadPdfmeInstanceBundle,
} from '@/sisad-pdfme/integration/SisadPdfmeInstanceBundle';
import { createDefaultTemplate } from '@/sisad-pdfme/templates/createDefaultTemplate';

describe('SisadPdfmeInstanceBundle', () => {
  it('crea un bundle portable sin adapters y conserva los datos serializables', () => {
    const template = createDefaultTemplate();
    const bundle = createSisadPdfmeInstanceBundle({
      definition: {
        mode: 'designer',
        templateKey: 'contract',
      },
      resources: {
        templates: {
          contract: template,
        },
        adapters: {
          documents: {
            toDocument: (value: unknown) => value,
          },
          recipients: {
            toRecipient: (value: unknown) => value,
          },
        } as never,
      },
    });

    expect(bundle.version).toBe(1);
    expect(bundle.valid).toBe(true);
    expect(bundle.issues).toEqual([]);
    expect(bundle.resources?.templates?.contract).toEqual(template);
    expect(bundle.resources && Object.prototype.hasOwnProperty.call(bundle.resources, 'adapters')).toBe(false);
  });

  it('restaura el bundle sin compartir referencias mutables', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition: {
        mode: 'form',
        defaultState: {
          inputs: [{ name: 'initial' }],
        },
      },
    });

    const restored = restoreSisadPdfmeInstanceBundle(bundle);

    expect(restored).toEqual(bundle);
    expect(restored.definition).not.toBe(bundle.definition);
    expect(restored.resources).toBeUndefined();
  });

  it('valida la versión del bundle y la definición interna', () => {
    const issues = validateSisadPdfmeInstanceBundle({
      version: 2,
      definition: {
        mode: 'bad-mode' as never,
      },
    });

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'instance-mode-invalid',
        'instance-bundle-version-invalid',
      ]),
    );
  });

  it('serializa y lee el bundle sin perder la definición', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition: {
        mode: 'viewer',
        activeDocumentId: 'doc-1',
      },
      resources: {
        documents: [{ id: 'doc-1', title: 'Uno' }],
      },
    });

    const serialized = serializeSisadPdfmeInstanceBundle(bundle);
    const parsed = parseSisadPdfmeInstanceBundle(serialized);

    expect(parsed.valid).toBe(true);
    expect(parsed.issues).toEqual([]);
    expect(parsed.bundle).toEqual(bundle);
  });

  it('no invalida el bundle cuando la definición solo tiene advertencias', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition: {
        mode: 'designer',
        version: -1,
      },
    });

    expect(bundle.valid).toBe(true);
    expect(bundle.issues.some((issue) => issue.severity === 'warning')).toBe(true);
  });
});
