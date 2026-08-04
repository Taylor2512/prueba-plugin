import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';
import type { UIOptions, PluginRegistry } from '@sisad-pdfme/common';
import { I18nContext, OptionsContext, PluginsRegistry } from '@/sisad-pdfme/ui/contexts.js';
import DetailView from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.js';

const setValues = vi.fn();
const getValues = vi.fn(() => ({}));
const validateFields = vi.fn(() => Promise.resolve());

/** Form de sección simulado: en runtime lo aporta cada `<FormRender>`. */
const sectionForm = { validateFields, setValues, getValues } as never;

let capturedDetailProps:
  | {
      watchHandler: (values: Record<string, unknown>, form?: unknown) => void;
      readOnly?: boolean;
      accessState?: { canEditStructure: boolean; isLockedByOther: boolean; isSchemaReadOnly: boolean };
      resetToken?: string;
      hydrationValues?: Record<string, unknown>;
    }
  | null = null;

vi.mock('form-render', () => ({
  useForm: () => ({
    setValues,
    getValues,
    validateFields,
  }),
}));

vi.mock('@/sisad-pdfme/ui/helper.js', async () => {
  const actual = await vi.importActual('@/sisad-pdfme/ui/helper.js');
  return {
    ...actual,
    debounce: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.js', () => ({
  default: (props: unknown) => {
    capturedDetailProps = props as NonNullable<typeof capturedDetailProps>;
    return <div data-testid="detail-view-content" />;
  },
}));

const baseSchema: SchemaForUI = {
  id: 's-1',
  name: 'field_1',
  type: 'text',
  content: 'value',
  position: { x: 12, y: 16 },
  width: 80,
  height: 20,
  readOnly: false,
  required: true,
  rotate: 3,
  opacity: 0.8,
} as SchemaForUI;

const activePlugin = {
  propPanel: {
    defaultSchema: {
      readOnly: false,
      required: true,
      rotate: 0,
      opacity: 1,
    },
    schema: {
      textColor: {
        title: 'Color',
        type: 'string',
      },
    },
  },
};

const pluginsRegistry = {
  findByType: vi.fn(() => activePlugin),
  values: vi.fn(() => []),
};

const renderDetailView = (overrideProps?: Partial<React.ComponentProps<typeof DetailView>>) => {
  const changeSchemas = vi.fn();
  const props: React.ComponentProps<typeof DetailView> = {
    size: { width: 1280, height: 800 },
    schemas: [
      [
        {
          ...baseSchema,
          id: 's-1',
        },
      ],
    ],
    schemasList: [
      [
        {
          ...baseSchema,
          id: 's-1',
        },
      ],
    ],
    pageSize: { width: 210, height: 297 },
    basePdf: {
      width: 210,
      height: 297,
      padding: [0, 0, 0, 0],
    },
    changeSchemas,
    activeElements: [],
    deselectSchema: vi.fn(),
    activeSchema: {
      ...baseSchema,
    },
    selectionCommands: {
      alignSelection: vi.fn(),
      distributeSelection: vi.fn(),
    },
    ...overrideProps,
  };

  const view = render(
    <I18nContext.Provider value={(key: string) => key}>
      <PluginsRegistry.Provider value={pluginsRegistry as unknown as PluginRegistry}>
        <OptionsContext.Provider value={{} as UIOptions}>
          <DetailView {...props} />
        </OptionsContext.Provider>
      </PluginsRegistry.Provider>
    </I18nContext.Provider>,
  );

  return {
    ...view,
    changeSchemas,
  };
};

describe('DetailView', () => {
  beforeEach(() => {
    capturedDetailProps = null;
    setValues.mockClear();
    getValues.mockReset();
    getValues.mockReturnValue({});
    validateFields.mockReset();
    validateFields.mockResolvedValue(undefined);
    pluginsRegistry.findByType.mockReturnValue(activePlugin);
  });

  test('hydrates form values and derives editable from readOnly', async () => {
    renderDetailView({
      activeSchema: {
        ...baseSchema,
        readOnly: true,
      },
    });

    // La hidratación la aplica cada sección con su propio formulario; el
    // DetailView solo publica el snapshot de valores.
    await waitFor(() => {
      expect(capturedDetailProps?.hydrationValues).toBeDefined();
    });

    const values = capturedDetailProps?.hydrationValues as Record<string, unknown>;
    expect(values.readOnly).toBe(true);
    expect(values.editable).toBe(false);
  });

  test('el snapshot de hidratación no cambia de identidad al editar valores', async () => {
    vi.useFakeTimers();
    try {
      renderDetailView();
      await act(async () => {
        vi.runOnlyPendingTimers();
        await Promise.resolve();
      });
      const before = capturedDetailProps?.hydrationValues;

      await act(async () => {
        capturedDetailProps?.watchHandler({ required: false }, sectionForm);
        vi.runOnlyPendingTimers();
        await Promise.resolve();
      });

      // Si cambiara, las secciones se rehidratarían y pisarían lo tecleado.
      expect(capturedDetailProps?.hydrationValues).toBe(before);
    } finally {
      vi.useRealTimers();
    }
  });

  test('filters invalid changes when validateFields reports field errors', async () => {
    validateFields.mockRejectedValueOnce({
      errorFields: [{ name: ['name'], errors: ['duplicado'] }],
    });

    vi.useFakeTimers();
    try {
      const { changeSchemas } = renderDetailView();

      await act(async () => {
        vi.runOnlyPendingTimers();
        await Promise.resolve();
        vi.runOnlyPendingTimers();
        await Promise.resolve();
      });

      expect(typeof capturedDetailProps?.watchHandler).toBe('function');

      await act(async () => {
        capturedDetailProps.watchHandler({
          name: 'duplicated_name',
          width: 90,
        }, sectionForm);
        vi.runOnlyPendingTimers();
        await Promise.resolve();
      });

      await act(async () => {
        vi.runOnlyPendingTimers();
        await Promise.resolve();
      });

      expect(changeSchemas).toHaveBeenCalled();

      const changes = changeSchemas.mock.calls[0][0] as Array<{ key: string; value: unknown }>;
      expect(changes).toEqual([expect.objectContaining({ key: 'width', value: 90 })]);
    } finally {
      vi.useRealTimers();
    }
  });

});

/**
 * INSPECTOR-001/002/003 — política de commit y acceso del inspector.
 */
describe('DetailView — commit de controles discretos', () => {
  beforeEach(() => {
    capturedDetailProps = null;
    setValues.mockClear();
    getValues.mockReset();
    getValues.mockReturnValue({});
    validateFields.mockReset();
    validateFields.mockResolvedValue(undefined);
    pluginsRegistry.findByType.mockReturnValue(activePlugin);
  });

  const settle = async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
      await Promise.resolve();
      vi.runOnlyPendingTimers();
      await Promise.resolve();
    });
  };

  test('un cambio booleano persiste exactamente una vez y sin debounce', async () => {
    vi.useFakeTimers();
    try {
      const { changeSchemas } = renderDetailView();
      await settle();

      // Un clic en el switch: form-render emite el watch con el valor final.
      await act(async () => {
        capturedDetailProps?.watchHandler({ required: false }, sectionForm);
      });

      // Persistido ya, sin esperar los 180 ms del debounce de escritura.
      expect(changeSchemas).toHaveBeenCalledTimes(1);
      expect(changeSchemas.mock.calls[0][0]).toEqual([
        expect.objectContaining({ key: 'required', value: false, schemaId: 's-1' }),
      ]);

      // Y el debounce posterior no vuelve a escribir el mismo cambio.
      await settle();
      expect(changeSchemas).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  test('el switch "editable" escribe readOnly una sola vez', async () => {
    vi.useFakeTimers();
    try {
      const { changeSchemas } = renderDetailView();
      await settle();

      await act(async () => {
        capturedDetailProps?.watchHandler({ editable: false }, sectionForm);
      });

      expect(changeSchemas).toHaveBeenCalledTimes(1);
      expect(changeSchemas.mock.calls[0][0]).toEqual([
        expect.objectContaining({ key: 'readOnly', value: true }),
        expect.objectContaining({ key: 'required', value: false }),
      ]);

      await settle();
      expect(changeSchemas).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  test('los inputs de escritura continua siguen con debounce', async () => {
    vi.useFakeTimers();
    try {
      const { changeSchemas } = renderDetailView();
      await settle();

      await act(async () => {
        capturedDetailProps?.watchHandler({ name: 'nuevo_nombre' }, sectionForm);
      });

      expect(changeSchemas).not.toHaveBeenCalled();

      await settle();
      expect(changeSchemas).toHaveBeenCalledTimes(1);
      expect(changeSchemas.mock.calls[0][0]).toEqual([
        expect.objectContaining({ key: 'name', value: 'nuevo_nombre' }),
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  test('schema.readOnly no pone el inspector en solo lectura', async () => {
    renderDetailView({ activeSchema: { ...baseSchema, readOnly: true } });

    await waitFor(() => expect(capturedDetailProps).not.toBeNull());

    // El diseñador autorizado tiene que poder volver a desactivar "Solo lectura".
    expect(capturedDetailProps?.readOnly).toBe(false);
    expect(capturedDetailProps?.accessState?.canEditStructure).toBe(true);
    expect(capturedDetailProps?.accessState?.isSchemaReadOnly).toBe(true);
  });

  test('el candado ajeno sí pone el inspector en solo lectura', async () => {
    renderDetailView({
      activeSchema: { ...baseSchema, lockedByActorId: 'alice' } as typeof baseSchema,
      collaborationContext: {
        actorId: 'bob',
        canEditStructure: true,
      } as never,
    });

    await waitFor(() => expect(capturedDetailProps).not.toBeNull());

    expect(capturedDetailProps?.readOnly).toBe(true);
    expect(capturedDetailProps?.accessState?.isLockedByOther).toBe(true);
  });

  test('el candado propio no bloquea el inspector', async () => {
    renderDetailView({
      activeSchema: { ...baseSchema, lockedByActorId: 'bob' } as typeof baseSchema,
      collaborationContext: {
        actorId: 'bob',
        canEditStructure: true,
      } as never,
    });

    await waitFor(() => expect(capturedDetailProps).not.toBeNull());

    expect(capturedDetailProps?.readOnly).toBe(false);
    expect(capturedDetailProps?.accessState?.isLockedByOther).toBe(false);
  });

  test('cambiar un valor no altera el resetToken que remonta las secciones', async () => {
    vi.useFakeTimers();
    try {
      renderDetailView();
      await settle();
      const tokenBefore = capturedDetailProps?.resetToken;

      await act(async () => {
        capturedDetailProps?.watchHandler({ required: false }, sectionForm);
      });
      await settle();

      expect(capturedDetailProps?.resetToken).toBe(tokenBefore);
    } finally {
      vi.useRealTimers();
    }
  });
});
