import { describe, expect, it } from 'vitest';
import { createDefaultTemplate } from '@/sisad-pdfme/templates/createDefaultTemplate';
import { createTemplateFromRecipe } from '@/sisad-pdfme/templates/createTemplateFromRecipe';
import {
  resolveSisadPdfmeInstance,
} from '@/sisad-pdfme/integration/resolveSisadPdfmeInstance';

describe('resolveSisadPdfmeInstance', () => {
  it('resuelve el template desde resources y monta el Designer por defecto', () => {
    const template = createDefaultTemplate({
      pageSize: { width: 420, height: 594 },
    });

    const resolved = resolveSisadPdfmeInstance({
      definition: {
        templateKey: 'contract',
      },
      resources: {
        templates: {
          contract: template,
        },
      },
    });

    expect(resolved.mode).toBe('designer');
    expect(resolved.surface).toBe('designer');
    expect(resolved.props.template).toEqual(template);
    expect(resolved.props.documents).toEqual([]);
    expect(resolved.props.recipients).toEqual([]);
  });

  it('usa values sobre inputs en Form y conserva el surface correcto', () => {
    const template = createDefaultTemplate();

    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'form',
        template,
        inputs: [{ name: 'fallback' }],
        values: [{ name: 'preferred' }],
      },
    });

    expect(resolved.mode).toBe('form');
    expect(resolved.surface).toBe('form');
    expect(resolved.props.template).toEqual(template);
    expect(resolved.props.inputs).toEqual([{ name: 'preferred' }]);
    expect('onInputChange' in resolved.props).toBe(true);
  });

  it('monta Viewer sin exponer onInputChange', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'viewer',
      },
    });

    expect(resolved.mode).toBe('viewer');
    expect(resolved.surface).toBe('viewer');
    expect('onInputChange' in resolved.props).toBe(false);
  });

  it('construye un template desde templateRecipe cuando no hay template explícito', () => {
    const template = createTemplateFromRecipe({
      groups: [
        {
          title: 'Datos',
          types: ['text', 'number'],
        },
      ],
    });

    const resolved = resolveSisadPdfmeInstance({
      definition: {
        templateRecipe: {
          groups: [
            {
              title: 'Datos',
              types: ['text', 'number'],
            },
          ],
        },
      },
    });

    expect(template.schemas[0]).toHaveLength(2);
    expect(resolved.props.template).toEqual(template);
  });

  it('prefiere state sobre defaultState para inputs y activeRecipientId', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'form',
        defaultState: {
          inputs: [{ name: 'default' }],
          activeRecipientId: 'default-recipient',
        },
        state: {
          inputs: [{ name: 'controlled' }],
          activeRecipientId: null,
        },
      },
    });

    expect(resolved.state.inputs.source).toBe('state');
    expect(resolved.state.inputs.value).toEqual([{ name: 'controlled' }]);
    expect(resolved.state.activeRecipientId.source).toBe('state');
    expect(resolved.state.activeRecipientId.value).toBeNull();
    expect(resolved.props.inputs).toEqual([{ name: 'controlled' }]);
    expect(resolved.props.activeRecipientId).toBe('');
  });
});
