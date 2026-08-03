import { act, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SisadPdfmeInstance } from '@/sisad-pdfme/integration/SisadPdfmeInstance';
import { createDefaultTemplate } from '@/sisad-pdfme/templates/createDefaultTemplate';
import { createTemplateFromRecipe } from '@/sisad-pdfme/templates/createTemplateFromRecipe';
import {
  resolveSisadPdfmeInstance,
} from '@/sisad-pdfme/integration/resolveSisadPdfmeInstance';
import {
  validateSisadPdfmeInstanceDefinition,
} from '@/sisad-pdfme/integration/validateSisadPdfmeInstanceDefinition';
import { defineSisadPdfmeInstance } from '@/sisad-pdfme/integration/defineSisadPdfmeInstance';

const surfacePropsSpy = vi.hoisted(() => vi.fn());

vi.mock('@/sisad-pdfme/react/index.js', () => ({
  SisadPdfmeDesigner: (props: Record<string, unknown>) => {
    surfacePropsSpy(props);
    return null;
  },
  SisadPdfmeForm: (props: Record<string, unknown>) => {
    surfacePropsSpy(props);
    return null;
  },
  SisadPdfmeViewer: (props: Record<string, unknown>) => {
    surfacePropsSpy(props);
    return null;
  },
}));

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
    expect(resolved.props.activeRecipientId).toBeNull();
  });

  it('conserva activeRecipientId nulo en global view aunque existan recipients', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'designer',
      },
      resources: {
        recipients: [
          { id: 'alice', label: 'Alice' },
          { id: 'bob', label: 'Bob' },
        ],
        config: {
          collaboration: {
            isGlobalView: true,
          },
        } as any,
      },
    });

    expect(resolved.props.activeRecipientId).toBeNull();
    expect(resolved.normalized.activeRecipientId).toBe('alice');
  });

  it('combina state parcial de definition y resources por campo', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'form',
        state: {
          activeRecipientId: 'definition-recipient',
        },
      },
      resources: {
        state: {
          inputs: [{ name: 'resource-input' }],
        },
      },
    });

    expect(resolved.state.inputs.source).toBe('state');
    expect(resolved.state.inputs.value).toEqual([{ name: 'resource-input' }]);
    expect(resolved.state.activeRecipientId.source).toBe('state');
    expect(resolved.state.activeRecipientId.value).toBe('definition-recipient');
  });

  it('resuelve activeDocumentId y lo pasa al Designer', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'designer',
        documents: [
          { id: 'doc-1', title: 'Uno' },
          { id: 'doc-2', title: 'Dos' },
        ],
        activeDocumentId: 'doc-2',
      },
    });

    expect(resolved.state.activeDocumentId.value).toBe('doc-2');
    expect(resolved.props.activeDocumentId).toBe('doc-2');
  });

  it('usa el template del documento activo cuando existe', () => {
    const activeDocumentTemplate = createDefaultTemplate({
      pageSize: { width: 420, height: 594 },
    });

    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'viewer',
        state: {
          activeDocumentId: 'doc-2',
        },
      },
      resources: {
        documents: [
          { id: 'doc-1', label: 'Uno', template: createDefaultTemplate() },
          { id: 'doc-2', label: 'Dos', template: activeDocumentTemplate },
        ],
      },
    });

    expect(resolved.props.activeDocumentId).toBe('doc-2');
    expect(resolved.props.template).toEqual(activeDocumentTemplate);
  });

  it('combina config anidada de resources y definition', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'designer',
        config: {
          collaboration: {
            canEditStructure: false,
          },
        },
      },
      resources: {
        config: {
          collaboration: {
            enabled: true,
            isGlobalView: true,
          },
        },
      },
    });

    expect((resolved.props.config as Record<string, unknown>).collaboration).toMatchObject({
      enabled: true,
      isGlobalView: true,
      canEditStructure: false,
    });
  });

  it('cae a designer cuando el mode es inválido y reporta una issue', () => {
    const resolved = resolveSisadPdfmeInstance({
      definition: {
        mode: 'invalid-mode' as never,
      },
    });

    expect(resolved.mode).toBe('designer');
    expect(resolved.valid).toBe(false);
    expect(resolved.issues.some((issue) => issue.code === 'instance-mode-invalid')).toBe(true);
  });
});

describe('SisadPdfmeInstance', () => {
  beforeEach(() => {
    surfacePropsSpy.mockClear();
  });

  it('preserva inputs vacíos explícitos en Form', () => {
    render(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'form',
          defaultState: {
            inputs: [],
          },
        },
      }),
    );

    const props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([]);
  });

  it('conserva cambios internos cuando el Form no está controlado', () => {
    const { rerender } = render(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'form',
          defaultState: {
            inputs: [{ name: 'initial' }],
          },
        },
      }),
    );

    let props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'initial' }]);

    act(() => {
      props?.onInputChange?.({ index: 0, name: 'name', value: 'edited' });
    });

    rerender(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'form',
          defaultState: {
            inputs: [{ name: 'initial' }],
          },
        },
      }),
    );

    props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'edited' }]);
  });

  it('emite onStateChange cuando cambia un Form no controlado', () => {
    const onStateChange = vi.fn();

    render(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'form',
          defaultState: {
            inputs: [{ name: 'initial' }],
          },
        },
        handlers: {
          onStateChange,
        },
      }),
    );

    const props = surfacePropsSpy.mock.calls.at(-1)?.[0];

    act(() => {
      props?.onInputChange?.({ index: 0, name: 'name', value: 'edited' });
    });

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        inputs: [{ name: 'edited' }],
      }),
      {
        field: 'inputs',
        source: 'user',
      },
    );
  });

  it('conserva documentos subidos y activeDocumentId en Designer no controlado', () => {
    const { rerender } = render(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'designer',
          defaultState: {
            documents: [{ id: 'doc-1', title: 'Uno' }],
            activeDocumentId: 'doc-1',
          },
        },
      }),
    );

    let props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.documents?.[0]?.id).toBe('doc-1');
    expect(props?.activeDocumentId).toBe('doc-1');

    act(() => {
      props?.onUploadedDocumentsChange?.(
        [{ id: 'doc-2', title: 'Dos' }],
        'doc-2',
      );
    });

    rerender(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'designer',
          defaultState: {
            documents: [{ id: 'doc-1', title: 'Uno' }],
            activeDocumentId: 'doc-1',
          },
        },
      }),
    );

    props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.documents?.[0]?.id).toBe('doc-2');
    expect(props?.activeDocumentId).toBe('doc-2');
  });

  it('reinicia el estado interno cuando cambia el id de la instancia registrada', () => {
    const firstInstance = defineSisadPdfmeInstance({
      id: 'contract-a',
      revision: 1,
      definition: {
        mode: 'form',
        defaultState: {
          inputs: [{ name: 'initial-a' }],
        },
      },
    });
    const secondInstance = defineSisadPdfmeInstance({
      id: 'contract-b',
      revision: 1,
      definition: {
        mode: 'form',
        defaultState: {
          inputs: [{ name: 'initial-b' }],
        },
      },
    });

    const { rerender } = render(
      React.createElement(SisadPdfmeInstance, {
        instance: firstInstance,
      }),
    );

    let props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'initial-a' }]);

    act(() => {
      props?.onInputChange?.({ index: 0, name: 'name', value: 'edited-a' });
    });

    rerender(
      React.createElement(SisadPdfmeInstance, {
        instance: secondInstance,
      }),
    );

    props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'initial-b' }]);
  });

  it('conserva el estado interno cuando se rerenderiza la misma instancia registrada', () => {
    const instance = defineSisadPdfmeInstance({
      id: 'contract-stable',
      revision: 1,
      definition: {
        mode: 'form',
        defaultState: {
          inputs: [{ name: 'initial-stable' }],
        },
      },
    });

    const { rerender } = render(
      React.createElement(SisadPdfmeInstance, {
        instance,
      }),
    );

    let props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'initial-stable' }]);

    act(() => {
      props?.onInputChange?.({ index: 0, name: 'name', value: 'edited-stable' });
    });

    rerender(
      React.createElement(SisadPdfmeInstance, {
        instance: defineSisadPdfmeInstance({
          id: 'contract-stable',
          revision: 1,
          definition: {
            mode: 'form',
            defaultState: {
              inputs: [{ name: 'initial-stable-2' }],
            },
          },
        }),
      }),
    );

    props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'edited-stable' }]);
  });

  it('no pisa un Form controlado con cambios internos', () => {
    const { rerender } = render(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'form',
          state: {
            inputs: [{ name: 'controlled' }],
          },
        },
      }),
    );

    let props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'controlled' }]);

    act(() => {
      props?.onInputChange?.({ index: 0, name: 'name', value: 'edited' });
    });

    rerender(
      React.createElement(SisadPdfmeInstance, {
        definition: {
          mode: 'form',
          state: {
            inputs: [{ name: 'controlled' }],
          },
        },
      }),
    );

    props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'controlled' }]);
  });
});

describe('createTemplateFromRecipe', () => {
  it('corrige pageNumber al pasar a la siguiente página', () => {
    const template = createTemplateFromRecipe({
      pageSize: { width: 20, height: 20 },
      padding: [2, 2, 2, 2],
      groups: [
        {
          title: 'Datos',
          types: ['text', 'text'],
        },
      ],
    });

    expect(template.schemas).toHaveLength(2);
    expect(template.schemas[0][0].pageNumber).toBe(1);
    expect(template.schemas[1][0].pageNumber).toBe(2);
  });
});

describe('validateSisadPdfmeInstanceDefinition', () => {
  it('detecta definiciones invalidas', () => {
    const issues = validateSisadPdfmeInstanceDefinition({
      mode: 'bad-mode' as never,
      state: [] as never,
      activeDocumentId: 1 as never,
    });

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'instance-mode-invalid',
        'instance-state-invalid',
        'instance-active-document-id-invalid',
      ]),
    );
  });
});
