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
const DESIGNER_OPTION_BOX_BG = 'rgba(161, 239, 242, 0.58)';

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

// ─── PDF output policy ─────────────────────────────────────────────────────────

/**
 * Decides whether a field's background fill should be painted in the FINAL PDF.
 *
 * Recipient tints and field background colors are designer/form chrome, not
 * document content. The generated PDF must be clean ("sin formato"), so the
 * background is suppressed by default and only printed when a template
 * explicitly opts in via `__designer.printBackground === true`.
 *
 * Centralized here (Facade) so every pdfRender path shares one rule instead of
 * each plugin deciding on its own.
 */
export const shouldRenderFieldBackgroundInPdf = (schema: unknown): boolean => {
  if (!schema || typeof schema !== 'object') return false;
  const designer = (schema as { __designer?: unknown }).__designer;
  if (!designer || typeof designer !== 'object') return false;
  return (designer as { printBackground?: unknown }).printBackground === true;
};

// ─── FieldChromePolicy (Strategy by mode + state) ─────────────────────────────

export type SchemaRenderMode = 'designer' | 'form' | 'viewer' | 'pdf';

type FieldChromePolicyState =
  | 'idle'
  | 'hover'
  | 'selected'
  | 'empty'
  | 'filled'
  | 'invalid'
  | 'readonly'
  | 'locked';

type FieldChromePolicyInput = {
  mode: SchemaRenderMode;
  /** Base owner/recipient color. */
  tone: string;
  state?: FieldChromePolicyState;
  family?: string;
  compact?: boolean;
  /** Source schema, used only for the pdf printBackground opt-in. */
  schema?: unknown;
  /** Designer-supplied border override (keeps existing designer look). */
  outline?: string;
};

type FieldChromePolicyResult = {
  className: string;
  dataAttributes: Record<string, string>;
  styleVars: Record<string, string>;
  surface: string;
  border: string;
  showDesignerChrome: boolean;
  showFormControls: boolean;
  showViewerChrome: boolean;
  printBackground: boolean;
};

const mix = (tone: string, pct: number, base = 'white'): string =>
  `color-mix(in srgb, ${tone} ${pct}%, ${base})`;

const normalizeColor = (value: unknown): string =>
  typeof value === 'string' && value.trim() ? value.trim() : '';

/**
 * Single source of truth for a schema's OWNERSHIP tone (who the field belongs
 * to), independent of any semantic content color (approve=green, decline=red…).
 *
 * Priority: ownerColor → userColor → recipientColor → __designer.ownerColor →
 * __designer.recipientColor → caller fallback (active recipient for NEW schemas
 * / catalog cards only) → #2563EB.
 *
 * Deliberately does NOT read buttonColor/textColor/schema.color — those are
 * semantic/content colors, never ownership.
 */
type OwnerColorAwareSchema = {
  ownerColor?: string;
  userColor?: string;
  recipientColor?: string;
  __designer?: {
    ownerColor?: string;
    recipientColor?: string;
    collaboration?: { recipientColor?: string };
  };
};

/**
 * Raw ownership color: same chain as `resolveSchemaOwnerTone` but WITHOUT any
 * fallback — returns '' when the schema has no owner color at all. Use this
 * when the consumer needs to distinguish "no owner" (e.g. data attributes)
 * from "render something anyway" (chrome tones).
 */
export const resolveSchemaOwnerColorValue = (schema: unknown): string => {
  const source = schema as OwnerColorAwareSchema | null | undefined;
  return (
    normalizeColor(source?.ownerColor) ||
    normalizeColor(source?.userColor) ||
    normalizeColor(source?.recipientColor) ||
    normalizeColor(source?.__designer?.collaboration?.recipientColor) ||
    normalizeColor(source?.__designer?.ownerColor) ||
    normalizeColor(source?.__designer?.recipientColor) ||
    ''
  );
};

/**
 * Tono de dueño para el chrome del schema.
 *
 * Prioridad: color de dueño materializado → fallback del caller → gris neutro.
 * El respaldo final es NEUTRO (no azul) para que un schema sin dueño resuelto no
 * parezca asignado al recipient azul por defecto.
 */
export const resolveSchemaOwnerTone = (
  schema: unknown,
  fallback?: string | null,
): string =>
  resolveSchemaOwnerColorValue(schema) || normalizeColor(fallback) || '#94A3B8';

const resolveSchemaOwnerStyleVars = (
  schema: unknown,
  fallback?: string | null,
): Record<string, string> => {
  const tone = resolveSchemaOwnerTone(schema, fallback);
  return {
    '--schema-owner-color': tone,
    '--schema-tone': tone,
    '--schema-border-tone': tone,
    '--schema-text-tone': tone,
  };
};

/**
 * Central visual policy: given mode + state + tone, returns the chrome pieces
 * (surface/border + CSS vars + data attributes + capability flags).
 *
 * Single decision point so new modes/states extend here, not in each schema
 * (OCP). Returns small composable pieces (ISP). No `any`.
 */
const resolveFieldChromePolicy = (
  input: FieldChromePolicyInput,
): FieldChromePolicyResult => {
  const { mode, tone, state = 'idle', compact = false, schema, outline } = input;

  let surface = 'transparent';
  let borderColor = 'transparent';
  let borderWidth = '1px';
  let showDesignerChrome = false;
  let showFormControls = false;
  let showViewerChrome = false;
  let printBackground = false;

  if (!compact) {
    switch (mode) {
      case 'designer':
        showDesignerChrome = true;
        surface = mix(tone, 14);
        borderColor = mix(tone, 64);
        break;
      case 'form':
        // Subtle owner tint, compact fields — not the heavy designer surface.
        showFormControls = true;
        surface = mix(tone, 7);
        borderColor = mix(tone, 38);
        break;
      case 'viewer':
        // Clean read: final value, no edit chrome.
        showViewerChrome = true;
        surface = 'transparent';
        borderColor = 'transparent';
        break;
      case 'pdf':
        surface = 'transparent';
        borderColor = 'transparent';
        printBackground = shouldRenderFieldBackgroundInPdf(schema);
        break;
    }
  } else if (mode === 'designer') {
    showDesignerChrome = true;
  } else if (mode === 'form') {
    showFormControls = true;
  } else if (mode === 'viewer') {
    showViewerChrome = true;
  }

  // State overrides (apply after mode baseline).
  if ((state === 'readonly' || state === 'locked') && mode !== 'designer') {
    surface = mode === 'form' ? mix('#94a3b8', 8) : 'transparent';
    borderColor = mode === 'form' ? mix('#94a3b8', 30) : 'transparent';
  }
  if (state === 'selected' && mode === 'designer') {
    borderColor = 'var(--sisad-schema-selected-color, #4200ca)';
    borderWidth = '1.5px';
  }
  if (state === 'invalid') {
    borderColor = 'var(--color-danger, #dc2626)';
  }

  const border = mode === 'designer' && outline ? outline : `${borderWidth} solid ${borderColor}`;

  return {
    className: 'sisad-pdfme-field-chrome',
    dataAttributes: {
      'data-render-mode': mode,
      'data-schema-visual-state': state,
    },
    styleVars: {
      '--schema-tone': tone,
      '--schema-owner-color': tone,
      '--schema-surface-tone': surface,
      '--schema-border-tone': borderColor,
      '--schema-text-tone': tone,
    },
    surface,
    border,
    showDesignerChrome,
    showFormControls,
    showViewerChrome,
    printBackground,
  };
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
  /** Runtime render mode; when set, stamps data-render-mode + policy CSS vars. */
  renderMode?: SchemaRenderMode;
};

const toPolicyState = (state: SchemaVisualState): FieldChromePolicyState => {
  switch (state) {
    case 'multi-selected':
      return 'selected';
    case 'required':
      return 'idle';
    default:
      return state;
  }
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
  // Ownership tone (who the field belongs to). `ownerColor` here is the caller
  // fallback — the active recipient for NEW schemas/preview only; existing
  // schemas keep their own ownerColor/userColor and are unaffected by it.
  const tone = resolveSchemaOwnerTone(schema, ownerColor);
  const state = deriveVisualState(options);

  element.classList.add('sisad-pdfme-field-chrome');
  element.dataset.schemaFamily = family;
  element.dataset.schemaState = state;
  element.dataset.schemaRequired = String(Boolean(schema.required));
  element.dataset.schemaReadonly = String(Boolean(schema.readOnly || schema.readonly));
  element.dataset.schemaLocked = String(Boolean(schema.locked));
  element.dataset.schemaCompact = String(Boolean(compact));
  element.dataset.schemaOwnerColor = tone;
  element.style.setProperty('--schema-tone', tone);
  element.style.setProperty('--schema-owner-color', tone);

  Object.assign(element.style, {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    fontSize: 'var(--sisad-schema-font-size)',
    lineHeight: 'var(--sisad-schema-line-height)',
    color: 'var(--text-primary, #1f2937)',
    overflow: 'hidden',
    border: '1px solid color-mix(in srgb, var(--schema-tone, #2563eb) var(--sisad-schema-border-alpha-pct, 64%), transparent)',
    background: 'color-mix(in srgb, var(--schema-tone, #2563eb) var(--sisad-schema-surface-alpha-pct, 14%), white)',
    borderRadius: 'var(--sisad-schema-radius)',
  });

  if (state === 'selected' && options.renderMode === 'designer') {
    element.style.border = '1.5px solid var(--sisad-schema-selected-color, #4200ca)';
    element.style.boxShadow = 'var(--sisad-schema-selected-shadow)';
  }
  if (state === 'multi-selected' && options.renderMode === 'designer') {
    element.style.border = '1px solid var(--sisad-schema-selected-color, #4200ca)';
  }
  if (state === 'readonly') {
    element.style.opacity = '0.72';
  }
  if (state === 'locked') {
    element.style.cursor = 'not-allowed';
  }

  if (family === 'option-based') {
    element.style.background = 'transparent';
    element.style.borderStyle = 'dashed';
  } else if (family === 'boolean') {
    element.style.display = 'inline-flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
  } else if (family === 'signing-based') {
    element.style.background = `color-mix(in srgb, ${tone} 12%, white)`;
  } else if (family === 'action-based') {
    element.style.border = '0';
    element.style.background = 'transparent';
    element.style.borderRadius = 'var(--sisad-schema-radius)';
    element.style.overflow = 'visible';
  }

  if (state === 'invalid') {
    element.style.border = '1px solid var(--color-danger, #dc2626)';
  }

  // When the runtime mode is known, delegate any remaining mode-specific vars
  // to the central policy and stamp data-render-mode for debugging/inspection.
  if (options.renderMode) {
    const policy = resolveFieldChromePolicy({
      mode: options.renderMode,
      tone,
      state: toPolicyState(state),
      family,
      compact,
      schema,
    });
    element.dataset.renderMode = policy.dataAttributes['data-render-mode'];
    element.dataset.schemaVisualState = policy.dataAttributes['data-schema-visual-state'];
    Object.entries(policy.styleVars).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
    Object.assign(element.style, {
      border: policy.border,
      background: policy.surface,
      boxShadow: policy.showViewerChrome
        ? 'none'
        : state === 'selected' && options.renderMode === 'designer'
          ? 'var(--sisad-schema-selected-shadow)'
          : 'none',
    });

    if (options.renderMode === 'viewer' || options.renderMode === 'pdf') {
      element.style.background = 'transparent';
      element.style.borderColor = 'transparent';
      element.style.boxShadow = 'none';
    }

    if (options.renderMode === 'form' && (schema.readOnly || schema.readonly)) {
      element.style.background = 'color-mix(in srgb, #94a3b8 8%, white)';
      element.style.border = '1px solid color-mix(in srgb, #94a3b8 30%, white)';
    }

    if (state === 'invalid') {
      element.style.border = '1px solid var(--color-danger, #dc2626)';
    }
  }
};
