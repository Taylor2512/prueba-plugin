/**
 * Shared visual chrome helpers for schema UI elements.
 *
 * Two layers:
 * 1. Designer compact boxes: CSS classes + custom properties (option group squares/stacks).
 * 2. Field chrome: `applyFieldChrome` stamps class + data attributes + --schema-tone variable
 *    so CSS can drive all visual state without inline Object.assign(style).
 */
import type { SchemaVisualFamily, SchemaVisualState, SisadSchemaBase } from './schemaTypes.js';

// ─── Designer option box constants ────────────────────────────────────────────
// Used in JS indicator builders AND in CSS (same literal value).

export const DESIGNER_OPTION_BOX_BORDER = '#65d8de';
export const DESIGNER_OPTION_BOX_BG = 'rgba(161, 239, 242, 0.58)';

// ─── Designer compact box element ────────────────────────────────────────────

/**
 * Creates a compact designer option box element (CSS-class based).
 * Callers must set data-option-id and any schema-specific data attribute after calling.
 */
export const createDesignerOptionBoxEl = (sizeInPx: number): HTMLDivElement => {
  const box = document.createElement('div');
  box.className = 'sisad-pdfme-designer-option-box';
  box.style.setProperty('--designer-box-size', `${sizeInPx}px`);
  return box;
};

// ─── Designer group stack wrapper ─────────────────────────────────────────────

/**
 * Creates a vertical stack wrapper for designer option boxes (CSS-class based).
 * Callers may add data attributes (e.g. data-checkbox-group-root) after calling.
 */
export const createDesignerGroupStack = (gapPx: number): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.className = 'sisad-pdfme-designer-group-stack';
  wrapper.style.setProperty('--designer-box-gap', `${gapPx}px`);
  return wrapper;
};

// ─── Field chrome (generic schema visual state) ───────────────────────────────

export type ApplyFieldChromeOptions<TSchema extends SisadSchemaBase> = {
  schema: TSchema;
  family: SchemaVisualFamily;
  selected?: boolean;
  multiSelected?: boolean;
  hovered?: boolean;
  invalid?: boolean;
  ownerColor?: string;
  compact?: boolean;
};

function deriveVisualState<TSchema extends SisadSchemaBase>(
  options: ApplyFieldChromeOptions<TSchema>,
): SchemaVisualState {
  if (options.invalid) return 'invalid';
  if (options.multiSelected) return 'multi-selected';
  if (options.selected) return 'selected';
  if (options.schema.locked) return 'locked';
  if (options.schema.readOnly || options.schema.readonly) return 'readonly';
  if (options.hovered) return 'hover';
  if (options.schema.required) return 'required';
  return 'idle';
}

/**
 * Applies the `sisad-pdfme-field-chrome` class + semantic data attributes
 * + `--schema-tone` CSS variable to an element.
 *
 * Does NOT modify x/y/width/height. Does NOT touch Moveable/Selecto/Snapshot.
 * Apply to an inner container element, not directly to rootElement if
 * rootElement is measured by Moveable.
 */
export const applyFieldChrome = <TSchema extends SisadSchemaBase>(
  element: HTMLElement,
  options: ApplyFieldChromeOptions<TSchema>,
): void => {
  const { schema, family, ownerColor, compact } = options;
  const tone = ownerColor ?? schema.ownerColor ?? schema.recipientColor ?? '#2563eb';
  const state = deriveVisualState(options);

  element.classList.add('sisad-pdfme-field-chrome');
  element.dataset.schemaFamily = family;
  element.dataset.schemaState = state;
  element.dataset.schemaRequired = String(Boolean(schema.required));
  element.dataset.schemaReadonly = String(Boolean(schema.readOnly || schema.readonly));
  element.dataset.schemaLocked = String(Boolean(schema.locked));
  element.dataset.schemaCompact = String(Boolean(compact));
  element.style.setProperty('--schema-tone', tone);
};
