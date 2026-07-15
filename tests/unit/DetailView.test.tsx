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

let capturedDetailProps: { watchHandler: (...args: unknown[]) => void } | null = null;

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
    capturedDetailProps = props as { watchHandler: (...args: unknown[]) => void };
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

    await waitFor(() => {
      expect(setValues).toHaveBeenCalled();
    });

    const values = setValues.mock.calls[0][0] as Record<string, unknown>;
    expect(values.readOnly).toBe(true);
    expect(values.editable).toBe(false);
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
        });
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
