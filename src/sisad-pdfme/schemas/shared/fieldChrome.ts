/**
 * Shared visual chrome helpers for schema UI elements.
 *
 * Two layers:
 * 1. Designer compact boxes: CSS classes + custom properties (option group squares/stacks).
 * 2. Field chrome: `applyFieldChrome` stamps class + data attributes + --schema-tone variable
 *    so CSS can drive all visual state without inline Object.assign(style).
 */
import type { SchemaVisualFamily, SchemaVisualState, SisadSchemaBase } from '@sisad-pdfme/schemas/shared/schemaTypes';
import { resolveSchemaOwnerColorValue as resolveSchemaOwnerColorValueFromAppearance } from '@sisad-pdfme/collaboration/schemaOwnershipAppearance';

// ─── Designer option box constants ────────────────────────────────────────────
// Used in JS indicator builders AND in CSS (same literal value).

/**
 * Respaldo de las cajas de opción del Designer cuando el schema no tiene dueño
 * resuelto. No es la paleta por defecto: con dueño, la caja usa su tono.
 */
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

/**
 * Translucidez por mezcla, no por `opacity`.
 *
 * `opacity` en el contenedor atenuaría también texto, iconos y trazos hijos.
 * `color-mix` produce un color concreto y sólo afecta a la propiedad donde se
 * usa. Además acepta cualquier notación CSS (hex, rgb, hsl, `var()`), a
 * diferencia de un helper hex→rgba, que falla con los tonos que llegan como
 * variable.
 */
const mix = (tone: string, pct: number, base = 'white'): string =>
  `color-mix(in srgb, ${tone} ${pct}%, ${base})`;

const normalizeColor = (value: unknown): string =>
  typeof value === 'string' && value.trim() ? value.trim() : '';

/** Convierte `#rgb`/`#rrggbb` a componentes; `null` si no es un hex válido. */
const parseHexColor = (value: string): [number, number, number] | null => {
  const match = value.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;
  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : match[1];
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
};

/**
 * Color de texto legible sobre un fondo dado.
 *
 * Necesario en cuanto el fondo deja de ser una constante y pasa a ser el color
 * del destinatario: un texto blanco fijo se vuelve ilegible sobre tonos claros
 * (amarillo, cian) y uno oscuro desaparece sobre tonos intensos.
 */
export const readableTextColor = (background: string, dark = '#1f2937', light = '#ffffff'): string => {
  const rgb = parseHexColor(background);
  if (!rgb) return light;
  // Luminancia relativa aproximada (ITU-R BT.601), suficiente para decidir
  // entre dos extremos sin traer una librería de color.
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? dark : light;
};

/**
 * Equivalente de `mix()` que devuelve un hex concreto.
 *
 * `color-mix()` sirve para CSS, pero no dentro de un SVG serializado como
 * `data:` URI ni en las rutas de canvas/PDF: ahí hace falta un color ya
 * resuelto. Si el tono no es hex (por ejemplo `var(--x)`), se devuelve tal cual
 * para no romper al llamador.
 */
export const mixHexColor = (tone: string, pct: number, base = '#FFFFFF'): string => {
  const toneRgb = parseHexColor(tone);
  const baseRgb = parseHexColor(base);
  if (!toneRgb || !baseRgb) return tone;

  const ratio = Math.max(0, Math.min(100, pct)) / 100;
  const channels = toneRgb.map((channel, index) =>
    Math.round(channel * ratio + baseRgb[index] * (1 - ratio)),
  );
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

// ─── Contrato visual único (COLOR-001) ────────────────────────────────────────

/**
 * Cómo convive el color del destinatario con el color propio del contenido.
 *
 * - `owner-surface`: toda la superficie es del dueño. El contenido no aporta
 *   color de fondo (sí icono, placeholder, texto o trazos).
 * - `owner-surface-with-semantic-content`: la superficie es del dueño y el
 *   contenido conserva un color con significado propio —verde aprobar, rojo
 *   rechazar, ámbar nota, estado marcado— que vive **dentro**, sin cubrir el
 *   borde exterior.
 * - `content-preserved`: el contenido no se recolorea nunca (imagen, SVG,
 *   código de barras, tabla, o una forma con `fill` explícito). Sólo recibe
 *   chrome exterior.
 */
export type SchemaColorPolicy =
  | 'owner-surface'
  | 'owner-surface-with-semantic-content'
  | 'content-preserved';

/**
 * Salida única del tono de un schema. Toda superficie —Canvas, ListView,
 * DetailHeader, Designer, Form, Viewer— debe derivar de aquí en vez de
 * recalcular su propia paleta.
 */
export type SchemaVisualTone = {
  ownerColor: string;
  ownerBackground: string;
  ownerBackgroundStrong: string;
  ownerBorder: string;
  ownerText: string;
  policy: SchemaColorPolicy;
  /** Acento con significado, sólo en `owner-surface-with-semantic-content`. */
  semanticColor?: string;
  semanticBackground?: string;
  semanticText?: string;
};

/**
 * Acentos semánticos por tipo. Viven aquí para que las familias los consuman en
 * COLOR-004/005 en vez de repetir literales: hoy `approve.ts`, `decline.ts` y
 * `note.ts` declaran los suyos por separado.
 */
const SCHEMA_SEMANTIC_ACCENTS: Record<
  string,
  { color: string; background: string; text: string }
> = {
  approve: { color: '#16a34a', background: '#16a34a', text: '#ffffff' },
  decline: { color: '#dc2626', background: '#dc2626', text: '#ffffff' },
  note: { color: '#fde047', background: '#fefce8', text: '#713f12' },
};

/** Tipos cuyo contenido nunca se recolorea. */
const CONTENT_PRESERVED_TYPES = new Set([
  'image',
  'svg',
  'table',
  'line',
  'rectangle',
  'ellipse',
  'qrcode',
  'ean13',
  'ean8',
  'code39',
  'code128',
  'itf14',
  'upca',
  'upce',
  'gs1datamatrix',
  'pdf417',
  'japanpost',
  'nw7',
]);

/** Familias cuyo contenido nunca se recolorea. */
const CONTENT_PRESERVED_FAMILIES = new Set<SchemaVisualFamily>([
  'media',
  'shape',
  'table',
]);

/** Familias con estado interno significativo (marcado / sin marcar). */
const SEMANTIC_CONTENT_FAMILIES = new Set<SchemaVisualFamily>([
  'option-based',
  'boolean',
]);

const normalizeTypeKey = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

/**
 * Decide la política de color de un schema.
 *
 * El tipo manda sobre la familia: `action-based` agrupa `attachment` —que no
 * tiene color propio— con `approve`, `decline` y `note` —que sí—, así que
 * resolver sólo por familia daría a los cuatro el mismo trato.
 */
export const resolveSchemaColorPolicy = (
  schema: unknown,
  family?: SchemaVisualFamily,
): SchemaColorPolicy => {
  const type = normalizeTypeKey((schema as { type?: unknown } | null)?.type);

  if (SCHEMA_SEMANTIC_ACCENTS[type]) return 'owner-surface-with-semantic-content';
  if (CONTENT_PRESERVED_TYPES.has(type)) return 'content-preserved';
  if (family && CONTENT_PRESERVED_FAMILIES.has(family)) return 'content-preserved';
  if (family && SEMANTIC_CONTENT_FAMILIES.has(family)) {
    return 'owner-surface-with-semantic-content';
  }
  return 'owner-surface';
};

/**
 * Resuelve el tono completo de un schema: color de dueño, superficies derivadas
 * y política semántica. Punto único de verdad del contrato visual.
 *
 * `fallbackColor` es el respaldo del llamador (por ejemplo el destinatario
 * activo para un schema nuevo o una previsualización); nunca pisa el color ya
 * materializado en el schema.
 */
export const resolveSchemaVisualTone = (
  schema: unknown,
  options: { family?: SchemaVisualFamily; fallbackColor?: string | null } = {},
): SchemaVisualTone => {
  const ownerColor = resolveSchemaOwnerTone(schema, options.fallbackColor);
  const policy = resolveSchemaColorPolicy(schema, options.family);
  const accent = SCHEMA_SEMANTIC_ACCENTS[
    normalizeTypeKey((schema as { type?: unknown } | null)?.type)
  ];

  return {
    ownerColor,
    ownerBackground: mix(ownerColor, 14),
    ownerBackgroundStrong: mix(ownerColor, 28),
    ownerBorder: mix(ownerColor, 64),
    ownerText: mix(ownerColor, 82, 'black'),
    policy,
    ...(policy === 'owner-surface-with-semantic-content' && accent
      ? {
          semanticColor: accent.color,
          semanticBackground: accent.background,
          semanticText: accent.text,
        }
      : {}),
  };
};

/**
 * Raw ownership color: same chain as `resolveSchemaOwnerTone` but WITHOUT any
 * fallback — returns '' when the schema has no owner color at all. Use this
 * when the consumer needs to distinguish "no owner" (e.g. data attributes)
 * from "render something anyway" (chrome tones).
 */
export const resolveSchemaOwnerColorValue = (schema: unknown): string =>
  resolveSchemaOwnerColorValueFromAppearance(
    schema as Parameters<typeof resolveSchemaOwnerColorValueFromAppearance>[0],
  );

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

/**
 * Proyecta un tono en las cuatro variables CSS que consume el chrome.
 *
 * wrapper-check: allow resolveSchemaOwnerStyleVars — no republica el resultado
 * delegado: lo abre en cuatro nombres distintos, que es la traducción que evita
 * que cada consumidor repita los nombres de las variables.
 */
export const resolveSchemaOwnerStyleVars = (
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
    // Compacto (action-based) también debe declarar dueño: sin tono, un botón
    // Aprobar/Rechazar o una nota no dicen de quién son. Más tenue que el
    // chrome normal para no competir con el color semántico del contenido.
    showDesignerChrome = true;
    surface = mix(tone, 10);
    borderColor = mix(tone, 48);
  } else if (mode === 'form') {
    showFormControls = true;
    surface = mix(tone, 6);
    borderColor = mix(tone, 32);
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
    // El chrome de dueño se conserva (borde + fondo tenue): el contenido de la
    // acción mantiene su color semántico —verde aprobar, rojo rechazar— y el
    // tono de alrededor dice a quién pertenece el campo.
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
