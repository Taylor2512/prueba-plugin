/**
 * detailWidgets — widgets visuales especializados del inspector.
 *
 * Actualmente contiene el selector de color híbrido usado por `nativeColor`, con
 * paleta rápida, input nativo y campo HEX. Sus eventos se aíslan para evitar
 * interferencia con Selecto, Moveable o drop del canvas.
 */
import { Input, Popover, Tooltip } from 'antd';
import { Palette, Pipette } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { stopInspectorPointerEvent } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';

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
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'color-picker-swatches',
        'grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] gap-[0.375rem]',
      )}
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
              'w-[1.5rem] h-[1.5rem] rounded-full border border-slate-200 p-0 cursor-pointer transition-transform transition-shadow transition-colors hover:-translate-y-px hover:border-slate-400 hover:shadow-[0_2px_8px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:border-[var(--color-primary-40)] focus-visible:shadow-[0_0_0_2px_var(--color-primary-10)]',
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
      className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-container`, 'flex flex-wrap items-stretch gap-[0.375rem] w-full min-w-0')}
      data-sisad-inspector-interactive="true"
      data-selecto-ignore="true"
      data-moveable-ignore="true"
      data-canvas-drop-ignore="true"
      onPointerDown={stopInspectorPointerEvent}
      onMouseDown={stopInspectorPointerEvent}
      onClick={stopInspectorPointerEvent}
    >
      <Popover content={swatches} trigger="click" placement="bottomLeft">
        <Tooltip title="Paleta de colores" placement="top">
          <button
            type="button"
            aria-label="Paleta de colores"
            onPointerDown={stopInspectorPointerEvent}
            className={mergeClassNames(
              `${DESIGNER_CLASSNAME}color-picker-trigger`,
              'relative inline-flex items-center justify-center gap-[0.25rem] shrink-0 w-[2rem] h-[2rem] min-w-[2rem] rounded-[var(--radius-md)] border border-[var(--color-border-20)] bg-[linear-gradient(180deg,_var(--color-white),_var(--color-gray-50))] p-0 text-[var(--color-gray-700)] cursor-pointer transition-colors transition-shadow transition-[border-color,_background,_box-shadow] hover:border-[var(--color-primary-30)] hover:bg-[linear-gradient(180deg,_var(--color-primary-04),_var(--color-white))] hover:shadow-[0_2px_8px_var(--color-gray-900-10)] focus-visible:outline-none focus-visible:border-[var(--color-primary-40)] focus-visible:shadow-[0_0_0_2px_var(--color-primary-10)]',
            )}
          >
            <span
              className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-preview`, 'w-[0.75rem] h-[0.75rem] rounded-full border border-[var(--color-border-20)] [box-shadow:inset_0_0_0_1px_var(--color-white-70)]')}
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
            <Palette size={12} aria-hidden="true" />
          </button>
        </Tooltip>
      </Popover>
      <Tooltip title="Selector nativo de color" placement="top">
        <label
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}color-picker-trigger`,
            'relative inline-flex items-center justify-center gap-[0.25rem] shrink-0 w-[2rem] h-[2rem] min-w-[2rem] rounded-[var(--radius-md)] border border-[var(--color-border-20)] bg-[linear-gradient(180deg,_var(--color-white),_var(--color-gray-50))] p-0 text-[var(--color-gray-700)] cursor-pointer transition-colors transition-shadow transition-[border-color,_background,_box-shadow] hover:border-[var(--color-primary-30)] hover:bg-[linear-gradient(180deg,_var(--color-primary-04),_var(--color-white))] hover:shadow-[0_2px_8px_var(--color-gray-900-10)] focus-within:outline-none focus-within:border-[var(--color-primary-40)] focus-within:shadow-[0_0_0_2px_var(--color-primary-10)]',
          )}
          aria-label="Selector nativo de color"
          onPointerDown={stopInspectorPointerEvent}
        >
          <span
            className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-preview`, 'w-[0.75rem] h-[0.75rem] rounded-full border border-[var(--color-border-20)] [box-shadow:inset_0_0_0_1px_var(--color-white-70)]')}
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
          <Pipette size={12} aria-hidden="true" />
          <input
            type="color"
            id={`${DESIGNER_CLASSNAME}color-picker-native`}
            name={`${DESIGNER_CLASSNAME}color-picker-native`}
            className={mergeClassNames(`${DESIGNER_CLASSNAME}color-picker-input`, 'absolute inset-0 w-full h-full opacity-0 cursor-pointer')}
            value={hex}
            onChange={(e) => onChange?.(e.target.value)}
            aria-label="Selector nativo de color"
          />
        </label>
      </Tooltip>
      <Input
        id={`${DESIGNER_CLASSNAME}color-picker-hex`}
        name={`${DESIGNER_CLASSNAME}color-picker-hex`}
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}color-picker-hex`,
          'flex-1 min-w-0 h-[1.625rem] text-[0.6875rem] [font-family:var(--font-family-mono)] tracking-[0.02em] transition-[border-color,_box-shadow] border-slate-200 shadow-sm',
        )}
        value={currentColor}
        onChange={(e) => onChange?.(e.target.value)}
        onPointerDown={stopInspectorPointerEvent}
        placeholder="#000000"
        size="small"
      />
    </div>
  );
};
