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
export const hexAlpha = (hex: string, alpha: number): string => {
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
    border: `1px dashed ${hexAlpha(color, 0.45)}`,
    borderRadius: '4px',
    padding: '3px 4px 3px 4px',
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    flexWrap: isHorizontal ? 'wrap' : 'nowrap',
    gap: `${Math.max(1, gap)}px`,
    background: hexAlpha(color, 0.04),
    overflow: 'hidden',
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
  const { color, isHorizontal, editable } = opts;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', opts.role);
  btn.setAttribute(opts.dataAttr, opts.optionId);
  btn.setAttribute('data-option-id', opts.optionId);
  applyStyles(btn, {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '1px 3px 1px 2px',
    border: 'none',
    background: 'transparent',
    borderRadius: '3px',
    color: hexAlpha(color, 0.85),
    cursor: editable ? 'pointer' : 'default',
    fontSize: '10px',
    textAlign: 'left',
    width: isHorizontal ? 'auto' : '100%',
    minHeight: '0',
    flexShrink: '0',
    userSelect: 'none',
    outline: 'none',
    transition: 'background 100ms ease',
  });
  if (editable) {
    btn.addEventListener('mouseenter', () => {
      btn.style.background = hexAlpha(color, 0.08);
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
    });
  }
  return btn;
};

const checkSvg = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="100%" height="100%"><polyline points="1.5,5 4,8 8.5,2" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Checkbox indicator (square with optional checkmark). */
export const buildCheckboxIndicator = (color: string, isChecked: boolean): HTMLSpanElement => {
  const el = document.createElement('span');
  applyStyles(el, {
    width: '10px',
    height: '10px',
    minWidth: '10px',
    borderRadius: '2px',
    border: `1px solid ${hexAlpha(color, isChecked ? 0.9 : 0.55)}`,
    background: isChecked ? color : 'rgba(255,255,255,0.9)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    transition: 'background 100ms ease, border-color 100ms ease',
  });
  if (isChecked) {
    el.innerHTML = checkSvg('#fff');
  }
  return el;
};

/** Radio indicator (circle with optional center dot). */
export const buildRadioIndicator = (color: string, isSelected: boolean): HTMLSpanElement => {
  const el = document.createElement('span');
  applyStyles(el, {
    width: '10px',
    height: '10px',
    minWidth: '10px',
    borderRadius: '50%',
    border: `1px solid ${hexAlpha(color, isSelected ? 0.9 : 0.55)}`,
    background: isSelected ? color : 'rgba(255,255,255,0.9)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    transition: 'background 100ms ease, border-color 100ms ease',
  });
  if (isSelected) {
    const dot = document.createElement('span');
    applyStyles(dot, {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#fff',
      display: 'block',
    });
    el.appendChild(dot);
  }
  return el;
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
  btn.title = title;
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
