/**
 * detailWidgets — widgets visuales especializados del inspector.
 *
 * Actualmente contiene el selector de color híbrido usado por `nativeColor`, con
 * paleta rápida, input nativo y campo HEX. Sus eventos se aíslan para evitar
 * interferencia con Selecto, Moveable o drop del canvas.
 */
import React from 'react';
import { Input, Popover, Tooltip } from 'antd';
import { Palette, Pipette } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import { stopInspectorPointerEvent } from './inspectorInteractionGuards.js';

/**
 * Paleta rápida de colores frecuentes para el inspector.
 */
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

/**
 * Selector de color híbrido con presets, input nativo y campo HEX.
 *
 * @param props Valor actual, callback de cambio y normalizador hexadecimal.
 * @returns Widget de color aislado de eventos del canvas.
 */
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
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'color-picker-swatches', 'grid grid-cols-8 gap-1 p-1')}
      data-sisad-inspector-interactive="true"
      data-selecto-ignore="true"
      data-moveable-ignore="true"
      data-canvas-drop-ignore="true"
      onPointerDown={stopInspectorPointerEvent}
      onMouseDown={stopInspectorPointerEvent}
      onClick={stopInspectorPointerEvent}
    >
      {COLOR_PRESETS.map((preset) => (
        <Tooltip key={preset} title={preset} placement="top">
          <button
            type="button"
            onPointerDown={stopInspectorPointerEvent}
            onClick={(event) => {
              stopInspectorPointerEvent(event);
              onChange?.(preset);
            }}
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'color-picker-swatch-option',
              'h-5 w-5 rounded-md border border-slate-200 shadow-sm transition hover:scale-105 hover:border-slate-400',
            )}
            style={{ backgroundColor: preset }}
            aria-label={`Aplicar color ${preset}`}
          />
        </Tooltip>
      ))}
    </div>
  );

  return (
    <div
      className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-container`, 'flex flex-wrap items-center gap-2')}
      data-sisad-inspector-interactive="true"
      data-selecto-ignore="true"
      data-moveable-ignore="true"
      data-canvas-drop-ignore="true"
      onPointerDown={stopInspectorPointerEvent}
      onMouseDown={stopInspectorPointerEvent}
      onClick={stopInspectorPointerEvent}
    >
      <Popover content={swatches} trigger="click" placement="bottomLeft">
        <button
          type="button"
          title="Paleta de colores"
          aria-label="Paleta de colores"
          onPointerDown={stopInspectorPointerEvent}
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}color-picker-trigger`,
            'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50',
          )}
        >
          <span
            className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-preview`, 'h-3.5 w-3.5 rounded-full border border-slate-200')}
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
          <Palette size={12} aria-hidden="true" />
        </button>
      </Popover>
      <label
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}color-picker-trigger`,
          'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50',
        )}
        aria-label="Selector nativo de color"
        title="Selector nativo de color"
        onPointerDown={stopInspectorPointerEvent}
      >
        <span
          className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-preview`, 'h-3.5 w-3.5 rounded-full border border-slate-200')}
          style={{ backgroundColor: hex }}
          aria-hidden="true"
        />
        <Pipette size={12} aria-hidden="true" />
        <input
          type="color"
          id={`${DESIGNER_CLASSNAME}color-picker-native`}
          name={`${DESIGNER_CLASSNAME}color-picker-native`}
          className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-input`, 'h-4 w-4 cursor-pointer overflow-hidden rounded-full border-0 bg-transparent p-0')}
          value={hex}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="Selector nativo de color"
        />
      </label>
      <Input
        id={`${DESIGNER_CLASSNAME}color-picker-hex`}
        name={`${DESIGNER_CLASSNAME}color-picker-hex`}
        className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-hex`, 'min-w-[7rem] rounded-xl border-slate-200 shadow-sm')}
        value={currentColor}
        onChange={(e) => onChange?.(e.target.value)}
        onPointerDown={stopInspectorPointerEvent}
        placeholder="#000000"
        size="small"
      />
    </div>
  );
};
