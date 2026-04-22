import React from 'react';
import type { PropPanelWidgetProps, UIOptions } from '@sisad-pdfme/common';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { Divider, Input, Popover, Tooltip } from 'antd';
import { Palette, Pipette } from 'lucide-react';
import AlignWidget from './AlignWidget.js';
import ButtonGroupWidget from './ButtonGroupWidget.js';
import WidgetRenderer from './WidgetRenderer.js';
import SchemaCollaborationWidget from './SchemaCollaborationWidget.js';
import SchemaConnectionsWidget from './SchemaConnectionsWidget.js';
import { getSchemaTypeInspectorPreset } from '../../../../../schemas/schemaFamilies.js';

const COLOR_PRESETS = [
  '#000000',
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#1e3a5f',
  '#7c3aed',
  '#065f46',
  '#78350f',
];

export const ColorPickerWidget = ({
  value,
  onChange,
  normalizeHex,
}: {
  value: unknown;
  onChange?: (_nextValue: string) => void;
  normalizeHex: (_nextValue: unknown) => string;
}) => {
  const currentColor = typeof value === 'string' ? value : '#000000';
  const hex = normalizeHex(currentColor);

  const swatches = (
    <div className={DESIGNER_CLASSNAME + 'color-picker-swatches'}>
      {COLOR_PRESETS.map((preset) => (
        <Tooltip key={preset} title={preset} placement="top">
          <button
            type="button"
            onClick={() => onChange?.(preset)}
            className={DESIGNER_CLASSNAME + 'color-picker-swatch-option'}
            style={{ backgroundColor: preset }}
            aria-label={`Aplicar color ${preset}`}
          />
        </Tooltip>
      ))}
    </div>
  );

  return (
    <div className={`${DESIGNER_CLASSNAME}color-picker-container`}>
      <Popover content={swatches} trigger="click" placement="bottomLeft">
        <button
          type="button"
          title="Paleta de colores"
          aria-label="Paleta de colores"
          className={`${DESIGNER_CLASSNAME}color-picker-trigger`}
        >
          <span
            className={`${DESIGNER_CLASSNAME}color-picker-preview`}
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
          <Palette size={12} aria-hidden="true" />
        </button>
      </Popover>
      <label
        className={`${DESIGNER_CLASSNAME}color-picker-trigger`}
        aria-label="Selector nativo de color"
        title="Selector nativo de color"
      >
        <span
          className={`${DESIGNER_CLASSNAME}color-picker-preview`}
          style={{ backgroundColor: hex }}
          aria-hidden="true"
        />
        <Pipette size={12} aria-hidden="true" />
        <input
          type="color"
          className={`${DESIGNER_CLASSNAME}color-picker-input`}
          value={hex}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="Selector nativo de color"
        />
      </label>
      <Input
        className={`${DESIGNER_CLASSNAME}color-picker-hex`}
        value={currentColor}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="#000000"
        size="small"
      />
    </div>
  );
};

type BuildWidgetsParams = {
  pluginsRegistry: {
    values: () => Iterable<{
      propPanel: {
        widgets?: Record<string, (props: PropPanelWidgetProps) => void>;
      };
    }>;
  };
  options: UIOptions;
  token: any;
  typedI18n: (key: string) => string;
  normalizeColorHex: (value: unknown) => string;
  props: any;
};

export const buildDetailWidgets = ({
  pluginsRegistry,
  options,
  token,
  typedI18n,
  normalizeColorHex,
  props,
}: BuildWidgetsParams): Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> => {
  const activeSchemaType = typeof props?.activeSchema?.type === 'string' ? props.activeSchema.type : '';
  const familyPreset = getSchemaTypeInspectorPreset(activeSchemaType);
  const widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> = {
    AlignWidget: (p) => <AlignWidget {...p} {...props} options={options} selectionCommands={props.selectionCommands} />,
    Divider: () => <Divider className={`${DESIGNER_CLASSNAME}detail-view-divider`} />,
    ButtonGroup: (p) => <ButtonGroupWidget {...p} {...props} options={options} />,
    nativeColor: (p) => (
      <ColorPickerWidget value={p.value} onChange={p.onChange} normalizeHex={normalizeColorHex} />
    ),
  };

  if (familyPreset.supportsConnections) {
    const SchemaConnectionsWidgetRenderer = function SchemaConnectionsWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaConnectionsWidget {...p} {...props} />;
    };
    SchemaConnectionsWidgetRenderer.displayName = 'SchemaConnectionsWidget';
    widgets.SchemaConnectionsWidget = SchemaConnectionsWidgetRenderer;
  }

  if (familyPreset.supportsCollaboration) {
    const SchemaCollaborationWidgetRenderer = function SchemaCollaborationWidgetRenderer(
      p: PropPanelWidgetProps,
    ) {
      return <SchemaCollaborationWidget {...p} {...props} />;
    };
    SchemaCollaborationWidgetRenderer.displayName = 'SchemaCollaborationWidget';
    widgets.SchemaCollaborationWidget = SchemaCollaborationWidgetRenderer;
  }

  for (const plugin of pluginsRegistry.values()) {
    const pluginWidgets = plugin.propPanel.widgets || {};
    Object.entries(pluginWidgets).forEach(([widgetKey, widgetValue]) => {
      widgets[widgetKey] = (p) => (
        <WidgetRenderer
          {...p}
          {...props}
          options={options}
          theme={token}
          i18n={typedI18n}
          widget={widgetValue}
        />
      );
    });
  }

  return widgets;
};
