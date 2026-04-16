import React from 'react';
import type { PropPanelWidgetProps } from '@pdfme/common';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { Divider, Input, Popover, Tooltip } from 'antd';
import AlignWidget from './AlignWidget.js';
import ButtonGroupWidget from './ButtonGroupWidget.js';
import WidgetRenderer from './WidgetRenderer.js';
import SchemaConnectionsWidget from './SchemaConnectionsWidget.js';

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

const ColorPickerWidget = ({
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
            onClick={() => onChange?.(preset)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            className={DESIGNER_CLASSNAME + 'button-auto'}
          />
        </Tooltip>
      ))}
    </div>
  );

  return (
    <div className={`${DESIGNER_CLASSNAME}color-picker-container`}>
      <Popover content={swatches} trigger="click" placement="bottomLeft">
        <button title="Elegir color" className={DESIGNER_CLASSNAME + 'button-auto'} />
      </Popover>
      <input
        type="color"
        className={`${DESIGNER_CLASSNAME}color-picker-input`}
        value={hex}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Color picker"
      />
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
  options: unknown;
  token: unknown;
  typedI18n: (key: string) => string;
  normalizeColorHex: (value: unknown) => string;
  props: Record<string, unknown>;
};

export const buildDetailWidgets = ({
  pluginsRegistry,
  options,
  token,
  typedI18n,
  normalizeColorHex,
  props,
}: BuildWidgetsParams): Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> => {
  const widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element> = {
    AlignWidget: (p) => <AlignWidget {...p} {...props} options={options} selectionCommands={props.selectionCommands} />,
    Divider: () => <Divider className={`${DESIGNER_CLASSNAME}detail-view-divider`} />,
    ButtonGroup: (p) => <ButtonGroupWidget {...p} {...props} options={options} />,
    nativeColor: (p) => (
      <ColorPickerWidget value={p.value} onChange={p.onChange} normalizeHex={normalizeColorHex} />
    ),
    SchemaConnectionsWidget: (p) => <SchemaConnectionsWidget {...p} {...props} />,
  };

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
