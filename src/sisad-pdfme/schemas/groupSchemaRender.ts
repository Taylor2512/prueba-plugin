/**
 * groupSchemaRender.ts
 *
 * Shared DOM-rendering helpers for checkboxGroup and radioGroup schemas.
 * Centralises all visual logic to avoid duplication and ensure consistent
 * styling across both group types.
 *
 * Visual design intent:
 * - PDF document stays the primary element.
 * - Group container: thin dashed border at low opacity, very light tint fill.
 * - Option rows: NO per-row borders. Clean indicator + label only.
 * - States: idle (no fill), hover (very light tint), selected (indicator filled).
 */

/** Hex → rgba with a given alpha (0–1). Handles both 6 and 3-char hex. */
import { createOptionIndicatorElement } from './options/optionIndicator.js';
import { isRecord } from '../shared/objectGuards.js';

const hexAlpha = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const applyStyles = (element: HTMLElement, styles: Record<string, string>): void => {
  Object.assign(element.style, styles);
};

/**
 * Marker-only groups hide visible labels unless the schema explicitly opts in.
 */
export const shouldShowOptionLabels = (schemaOrConfig: unknown): boolean => {
  if (!isRecord(schemaOrConfig)) return false;
  const designer = isRecord(schemaOrConfig.__designer) ? schemaOrConfig.__designer : null;
  return Boolean(designer && designer.showOptionLabels === true);
};

export const applyOptionGroupBodyVariant = (
  element: HTMLElement,
  options: { showOptionLabels: boolean; isHorizontal: boolean },
): void => {
  element.dataset.optionGroupVariant = options.showOptionLabels ? 'labelled' : 'marker-only';
  if (!options.showOptionLabels && !options.isHorizontal) {
    Object.assign(element.style, {
      width: 'fit-content',
      maxWidth: '100%',
      alignSelf: 'flex-start',
    });
  }
};

export const applyOptionGroupRowVariant = (
  element: HTMLElement,
  options: { showOptionLabels: boolean },
): void => {
  element.dataset.optionLabelHidden = String(!options.showOptionLabels);
  if (!options.showOptionLabels) {
    Object.assign(element.style, {
      width: 'auto',
      minWidth: '14px',
      padding: '0',
      gap: '0',
      justifyContent: 'center',
      background: 'transparent',
    });
  }
};

export type GroupRenderOptions = {
  color: string;
  gap: number;
  isHorizontal: boolean;
  groupName?: string;
};

/** Builds the outer wrapper (relative, full-size). */
export const buildGroupWrapper = (): HTMLDivElement => {
  const el = document.createElement('div');
  applyStyles(el, {
    position: 'relative',
    width: '100%',
    height: '100%',
  });
  return el;
};

/** Builds the group container with a light dashed border. */
export const buildGroupContainer = (opts: GroupRenderOptions): HTMLDivElement => {
  const { color, gap, isHorizontal } = opts;
  const el = document.createElement('div');
  applyStyles(el, {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    border: `1px dashed ${hexAlpha(color, 0.28)}`,
    borderRadius: '4px',
    padding: '2px 3px',
    display: 'inline-flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    flexWrap: isHorizontal ? 'wrap' : 'nowrap',
    gap: `${Math.max(1, gap - 1)}px`,
    background: hexAlpha(color, 0.015),
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  });
  return el;
};

/** Builds an optional group name label above the options. */
export const buildGroupLabel = (name: string, color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.textContent = name;
  applyStyles(el, {
    width: '100%',
    fontSize: '8.5px',
    fontWeight: '700',
    color: hexAlpha(color, 0.7),
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    lineHeight: '1.2',
    marginBottom: '1px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexShrink: '0',
  });
  return el;
};

/** Builds one option row (no per-row border, clean layout). */
export const buildOptionRow = (opts: {
  color: string;
  isHorizontal: boolean;
  editable: boolean;
  role: 'checkbox' | 'radio';
  optionId: string;
  dataAttr: string;
}): HTMLButtonElement => {
  const { color, editable } = opts;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', opts.role);
  btn.setAttribute(opts.dataAttr, opts.optionId);
  btn.setAttribute('data-option-id', opts.optionId);
  // The DocuSign-like chip (light-cyan fill + cyan border + radius + padding)
  // is drawn in CSS (option-group__option), so it stays overridable and hot-
  // reloadable. Here we only set layout-neutral props (no inline bg/border that
  // would beat the CSS).
  applyStyles(btn, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    color: hexAlpha(color, 0.8),
    cursor: editable ? 'pointer' : 'default',
    fontSize: '9px',
    textAlign: 'left',
    minHeight: '0',
    flexShrink: '0',
    userSelect: 'none',
    outline: 'none',
    transition: 'background 100ms ease',
  });
  return btn;
};

/** Checkbox indicator (square with optional checkmark). */
export const buildCheckboxIndicator = (color: string, isChecked: boolean): HTMLSpanElement => {
  return createOptionIndicatorElement({
    shape: 'square',
    checked: isChecked,
    color,
    mode: 'viewer',
    size: 9,
    readOnly: true,
  });
};

/** Radio indicator (circle with optional center dot). */
export const buildRadioIndicator = (color: string, isSelected: boolean): HTMLSpanElement => {
  return createOptionIndicatorElement({
    shape: 'circle',
    checked: isSelected,
    color,
    mode: 'viewer',
    size: 9,
    readOnly: true,
  });
};

/** Option label text span. */
export const buildOptionLabel = (text: string, color: string): HTMLSpanElement => {
  const el = document.createElement('span');
  el.textContent = text;
  applyStyles(el, {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1',
    lineHeight: '1.3',
    color: hexAlpha(color, 0.82),
  });
  return el;
};

/** The "+" add-option button (designer-only, anchored at bottom center).
 *  Kept at bottom: 1px (INSIDE the schema bounds) to stay hit-testable —
 *  anything fully outside is covered by the paper page's stacking context. */
export const buildAddOptionButton = (color: string, title: string, dataAttr: string): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '+';
  btn.setAttribute('aria-label', title);
  btn.setAttribute('data-tooltip', title);
  btn.setAttribute(dataAttr, 'true');
  applyStyles(btn, {
    position: 'absolute',
    bottom: '1px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `1.5px solid ${color}`,
    background: '#fff',
    color,
    fontSize: '13px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: '30',
    padding: '0',
    boxShadow: `0 1px 4px ${hexAlpha(color, 0.25)}`,
    fontWeight: '700',
    transition: 'box-shadow 100ms ease, background 100ms ease',
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.background = hexAlpha(color, 0.08);
    btn.style.boxShadow = `0 2px 6px ${hexAlpha(color, 0.35)}`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '#fff';
    btn.style.boxShadow = `0 1px 4px ${hexAlpha(color, 0.25)}`;
  });
  return btn;
};
