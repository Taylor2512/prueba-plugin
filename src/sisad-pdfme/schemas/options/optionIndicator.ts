export type OptionIndicatorShape = 'square' | 'circle';
type OptionIndicatorMode = 'designer' | 'form' | 'viewer' | 'pdf';

export type OptionIndicatorParams = {
  shape: OptionIndicatorShape;
  checked: boolean;
  color: string;
  ownerColor?: string;
  mode: OptionIndicatorMode;
  size?: number;
  readOnly?: boolean;
  disabled?: boolean;
  /**
   * When true the indicator fills its container (square, driven by the row
   * height) instead of a fixed `size`. Lets the group markers scale when the
   * schema box is resized. Inner parts (core/dot) become percentage-based.
   */
  fill?: boolean;
};

const isHexColor = (value: string): boolean => /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim());

const hexToRgb = (hex: string): [number, number, number] | null => {
  const clean = hex.replace('#', '').trim();
  if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(clean)) return null;
  const expanded = clean.length === 3 || clean.length === 4 ? clean.split('').map((ch) => ch + ch).join('') : clean;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);
  if (![r, g, b].every((n) => Number.isFinite(n))) return null;
  return [r, g, b];
};

const colorWithAlpha = (color: string, alpha: number): string => {
  const trimmed = String(color || '').trim();
  if (!trimmed) return `rgba(0, 157, 189, ${alpha})`;
  const rgb = isHexColor(trimmed) ? hexToRgb(trimmed) : null;
  if (!rgb) {
    if (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(') || trimmed.startsWith('var(') || trimmed.startsWith('color-mix(')) {
      return trimmed;
    }
    return trimmed;
  }
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const resolveTone = (params: Pick<OptionIndicatorParams, 'color' | 'ownerColor'>): string => {
  const ownerTone = String(params.ownerColor || '').trim();
  if (ownerTone) return ownerTone;

  const semanticTone = String(params.color || '').trim();
  if (semanticTone && semanticTone.toLowerCase() !== '#1677ff') return semanticTone;

  return '#4200ca';
};

const createCheckSvg = (tone: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="100%" height="100%" aria-hidden="true" focusable="false"><polyline points="2.1,6.2 4.8,8.7 9.4,3.5" fill="none" stroke="${tone}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const createSvgMarkup = (params: OptionIndicatorParams): string => {
  const tone = resolveTone(params);
  const checked = Boolean(params.checked);
  const outerFill = 'rgba(165, 237, 252, 0.72)';
  const outerStroke = colorWithAlpha('#009dbd', params.disabled || params.readOnly ? 0.55 : 0.95);
  const coreSize = 8;
  const coreX = (16 - coreSize) / 2;
  const coreY = coreX;
  const innerTone = params.shape === 'circle'
    ? '#ffffff'
    : (checked ? tone : '#ffffff');
  const innerStroke = checked
    ? (params.shape === 'circle' ? 'rgba(148, 163, 184, 0.92)' : tone)
    : 'rgba(148, 163, 184, 0.92)';

  if (params.shape === 'circle') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%" aria-hidden="true" focusable="false">
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="${outerFill}" stroke="${outerStroke}" stroke-width="1"/>
        <circle cx="8" cy="8" r="4.1" fill="${innerTone}" stroke="${innerStroke}" stroke-width="0.9"/>
        ${
          checked
            ? `<circle cx="8" cy="8" r="2.9" fill="${tone}"/>`
            : ''
        }
      </svg>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="${outerFill}" stroke="${outerStroke}" stroke-width="1"/>
      <rect x="${coreX}" y="${coreY}" width="${coreSize}" height="${coreSize}" rx="1.5" fill="${innerTone}" stroke="${innerStroke}" stroke-width="0.85"/>
      ${checked ? `<polyline points="4.05,8.05 6.2,10.2 11.05,5.1" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
    </svg>
  `;
};

export const getOptionIndicatorAriaRole = (
  params: Pick<OptionIndicatorParams, 'mode' | 'shape' | 'readOnly' | 'disabled'>,
): string => {
  // The indicator itself is decorative outside interactive form controls: in
  // designer the root/row owns selection, and viewer/pdf/readOnly are static.
  // Only an interactive form control exposes a real checkbox/radio role.
  if (params.mode === 'viewer' || params.mode === 'pdf' || params.mode === 'designer') return 'presentation';
  if (params.readOnly || params.disabled) return 'presentation';
  return params.shape === 'circle' ? 'radio' : 'checkbox';
};

export const getOptionIndicatorIcon = (
  params: Pick<OptionIndicatorParams, 'shape' | 'checked'>,
): 'check' | 'dot' | null => (params.checked ? (params.shape === 'circle' ? 'dot' : 'check') : null);

export const renderOptionIndicatorSvg = (params: OptionIndicatorParams): string => createSvgMarkup(params);

export const createOptionIndicatorElement = (params: OptionIndicatorParams): HTMLSpanElement => {
  const size = Math.max(12, Math.round(Number(params.size) || 16));
  const checked = Boolean(params.checked);
  const interactive = params.mode !== 'viewer' && params.mode !== 'pdf' && !params.disabled && !params.readOnly;
  const role = getOptionIndicatorAriaRole(params);
  const tone = resolveTone(params);
  const el = document.createElement('span');

  el.className = 'sisad-pdfme-option-indicator';
  el.dataset.optionIndicatorShape = params.shape;
  el.dataset.optionIndicatorState = checked ? 'checked' : 'empty';
  el.dataset.optionIndicatorMode = params.mode;
  el.setAttribute('role', role);
  if (role === 'presentation') {
    el.setAttribute('aria-hidden', 'true');
  } else {
    el.setAttribute('aria-checked', String(checked));
    if (params.disabled || params.readOnly) {
      el.setAttribute('aria-disabled', 'true');
    }
  }

  const fill = Boolean(params.fill);
  const baseContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    flexShrink: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    opacity: params.disabled || params.readOnly ? '0.82' : '1',
    transition: 'opacity 100ms ease, transform 100ms ease',
  } as const;
  const dimensions = fill
    ? {
        height: '100%',
        width: 'auto',
        aspectRatio: '1 / 1',
        maxWidth: '100%',
        maxHeight: '100%',
      }
    : {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      };

  Object.assign(el.style, baseContainerStyle, dimensions);

  const outer = document.createElement('span');
  outer.className = 'sisad-pdfme-option-indicator__outer';
  Object.assign(outer.style, {
    width: '100%',
    height: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: '4px',
    background: 'rgba(165, 237, 252, 0.72)',
    border: `1px solid ${colorWithAlpha('#009dbd', params.disabled || params.readOnly ? 0.58 : 0.95)}`,
    boxSizing: 'border-box',
    overflow: 'hidden',
  });

  const core = document.createElement('span');
  core.className = 'sisad-pdfme-option-indicator__core';
  Object.assign(core.style, {
    width: fill ? '62%' : `${Math.max(7, size - 6)}px`,
    height: fill ? '62%' : `${Math.max(7, size - 6)}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: params.shape === 'circle' ? '999px' : '2px',
    background: checked ? tone : 'rgba(255, 255, 255, 0.94)',
    border: `1px solid ${checked ? tone : 'rgba(148, 163, 184, 0.84)'}`,
    color: tone,
    overflow: 'hidden',
  });

  if (checked) {
    if (params.shape === 'square') {
      core.innerHTML = createCheckSvg('#ffffff');
    } else {
      const dot = document.createElement('span');
      dot.className = 'sisad-pdfme-option-indicator__dot';
      // Dot fills roughly half the inner core so the selected radio reads clearly
      // (the previous 0.18 ratio rendered a ~3px dot that looked almost empty).
      const dotSize = Math.max(5, Math.round(size * 0.34));
      Object.assign(dot.style, fill
        ? {
            width: '52%',
            height: '52%',
            borderRadius: '999px',
            background: tone,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.35)',
          }
        : {
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: '999px',
            background: tone,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.35)',
          });
      core.style.background = 'rgba(255, 255, 255, 0.94)';
      core.style.border = '1px solid rgba(148, 163, 184, 0.84)';
      core.innerHTML = '';
      core.appendChild(dot);
    }
  }

  outer.appendChild(core);
  el.appendChild(outer);

  if (!interactive) {
    el.tabIndex = -1;
  }

  return el;
};