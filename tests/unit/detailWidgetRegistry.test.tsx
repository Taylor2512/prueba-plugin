import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import buildDetailWidgets from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.js';
import type { PropPanelWidgetProps } from '../../src/sisad-pdfme/common/index.js';

const alignSpy = vi.fn();
const buttonGroupSpy = vi.fn();
const connectionsSpy = vi.fn();
const collaborationSpy = vi.fn();
const commentsSpy = vi.fn();
const colorPickerSpy = vi.fn();

vi.mock('../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.js', () => ({
  default: (props: unknown) => {
    alignSpy(props);
    return <div data-testid="align-widget" />;
  },
}));

vi.mock('../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.js', () => ({
  default: (props: unknown) => {
    buttonGroupSpy(props);
    return <div data-testid="button-group-widget" />;
  },
}));

vi.mock('../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.js', () => ({
  default: (props: unknown) => {
    connectionsSpy(props);
    return <div data-testid="connections-widget" />;
  },
}));

vi.mock('../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.js', () => ({
  default: (props: unknown) => {
    collaborationSpy(props);
    return <div data-testid="collaboration-widget" />;
  },
}));

vi.mock('../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.js', () => ({
  default: (props: unknown) => {
    commentsSpy(props);
    return <div data-testid="comments-widget" />;
  },
}));

vi.mock('../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.js', () => ({
  ColorPickerWidget: (props: unknown) => {
    colorPickerSpy(props);
    return <div data-testid="native-color-widget" />;
  },
}));

vi.mock('../../src/sisad-pdfme/schemas/schemaFamilies.js', () => ({
  INLINE_EDITABLE_TEXT_TYPES: new Set(['text']),
  getSchemaTypeInspectorPreset: vi.fn(() => ({
    supportsComments: true,
    supportsConnections: true,
    supportsCollaboration: true,
  })),
}));

const makeBaseParams = () => ({
  pluginsRegistry: {
    values: () => [],
  },
  options: {},
  token: {
    colorText: '#111111',
  },
  typedI18n: (key: string) => key,
  normalizeColorHex: (value: unknown) => String(value || '#000000'),
  props: {
    size: { width: 1200, height: 800 },
    schemas: [[]],
    schemasList: [[]],
    pageSize: { width: 210, height: 297 },
    basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] as [number, number, number, number] },
    changeSchemas: vi.fn(),
    activeElements: [Object.assign(document.createElement('div'), { id: 'schema-1' })],
    deselectSchema: vi.fn(),
    activeSchema: {
      id: 'schema-1',
      type: 'text',
      name: 'field',
      content: 'text',
      position: { x: 10, y: 10 },
      width: 80,
      height: 20,
    },
    selectionCommands: {
      canEditStructure: true,
      alignSelection: vi.fn(),
      distributeSelection: vi.fn(),
      renameLabel: vi.fn(),
      editTextInline: vi.fn(),
      deleteSelection: () => false,
      deleteSchemasByIds: () => false,
      duplicateSelection: () => undefined,
      toggleRequired: () => undefined,
      toggleReadOnly: () => undefined,
      bringForward: () => undefined,
      sendBackward: () => undefined,
      openProperties: () => undefined,
    },
    designerEngine: {},
    schemaConfig: { collaboration: { ownerColor: '#2563EB' } },
    updateSchemaConfig: vi.fn(),
  },
});

describe('detailWidgetRegistry', () => {
  beforeEach(() => {
    alignSpy.mockClear();
    buttonGroupSpy.mockClear();
    connectionsSpy.mockClear();
    collaborationSpy.mockClear();
    commentsSpy.mockClear();
    colorPickerSpy.mockClear();
  });

  test('registers core widgets and passes selectionCommands into AlignWidget', () => {
    const params = makeBaseParams();
    const widgets = buildDetailWidgets(params as never);

    expect(widgets.AlignWidget).toBeDefined();
    expect(widgets.ButtonGroup).toBeDefined();
    expect(widgets.nativeColor).toBeDefined();
    expect(widgets.InlineEditActionsWidget).toBeDefined();

    render(widgets.AlignWidget({} as PropPanelWidgetProps));
    expect(screen.getByTestId('align-widget')).toBeInTheDocument();
    const received = alignSpy.mock.calls.at(0)?.[0] as { selectionCommands?: unknown };
    expect(received.selectionCommands).toBe(params.props.selectionCommands);
  });

  test('registers collaboration/comments/connections widgets only when preset supports them', async () => {
    const schemaFamilies = await import('../../src/sisad-pdfme/schemas/schemaFamilies.js');
    const getSchemaTypeInspectorPreset = vi.mocked(schemaFamilies.getSchemaTypeInspectorPreset);

    getSchemaTypeInspectorPreset.mockReturnValueOnce({
      supportsComments: false,
      supportsConnections: true,
      supportsCollaboration: false,
    } as never);

    const widgets = buildDetailWidgets(makeBaseParams() as never);

    expect(widgets.SchemaConnectionsWidget).toBeDefined();
    expect(widgets.SchemaCollaborationWidget).toBeUndefined();
    expect(widgets.SchemaFieldCommentsWidget).toBeUndefined();
  });

  test('passes designerEngine/schemaConfig/updateSchemaConfig into specialized widgets', () => {
    const params = makeBaseParams();
    const widgets = buildDetailWidgets(params as never);

    render(widgets.SchemaConnectionsWidget({} as PropPanelWidgetProps));
    render(widgets.SchemaCollaborationWidget({} as PropPanelWidgetProps));

    const connectionProps = connectionsSpy.mock.calls.at(0)?.[0] as { designerEngine?: unknown; schemaConfig?: unknown; updateSchemaConfig?: unknown };
    const collaborationProps = collaborationSpy.mock.calls.at(0)?.[0] as { designerEngine?: unknown; schemaConfig?: unknown; updateSchemaConfig?: unknown };

    expect(connectionProps.designerEngine).toBe(params.props.designerEngine);
    expect(connectionProps.schemaConfig).toBe(params.props.schemaConfig);
    expect(connectionProps.updateSchemaConfig).toBe(params.props.updateSchemaConfig);

    expect(collaborationProps.designerEngine).toBe(params.props.designerEngine);
    expect(collaborationProps.schemaConfig).toBe(params.props.schemaConfig);
  });

  test('does not break when plugin has no widgets and keeps nativeColor operational', () => {
    const params = makeBaseParams();
    const widgets = buildDetailWidgets({
      ...params,
      pluginsRegistry: {
        values: () => [{ propPanel: {} }],
      },
    } as never);

    expect(() => render(widgets.nativeColor({ value: '#ffffff' } as PropPanelWidgetProps))).not.toThrow();
    expect(colorPickerSpy).toHaveBeenCalled();
  });
});
