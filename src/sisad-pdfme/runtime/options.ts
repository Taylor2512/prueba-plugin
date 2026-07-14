/**
 * Runtime options builder for SISAD PDFME.
 *
 * Responsibility:
 * - Build normalized options for Designer/Form/Viewer.
 * - Centralize theme token defaults.
 * - Keep host-specific runtime flags outside the PDFME core.
 *
 * Important:
 * This file should remain a pure builder module. It should not import React,
 * access the DOM, create runtime instances, or know about SISAD business flows.
 */
/** Default Ant Design theme token used when the host does not provide one. */
const DEFAULT_THEME_TOKEN = Object.freeze({
  colorPrimary: "#1e0b4a",
  colorBgContainer: "#ffffff",
  colorBgBase: "#ffffff",
  borderRadius: 4,
});

/**
 * Merges a host-provided theme token with the SISAD runtime defaults.
 *
 * This prevents incomplete host themes from removing required token values
 * such as colorPrimary, colorBgContainer or borderRadius.
 */
const mergeThemeToken = (themeToken = DEFAULT_THEME_TOKEN) => ({
  ...DEFAULT_THEME_TOKEN,
  ...(themeToken && typeof themeToken === "object" ? themeToken : {}),
});

/**
 * Creates a shallow copy of runtimeOptions and normalizes its `theme.token`.
 *
 * The function avoids mutating the original host options object.
 */
const mergeRuntimeOptions = (runtimeOptions = {}, themeToken = DEFAULT_THEME_TOKEN) => {
  const next = runtimeOptions && typeof runtimeOptions === "object" ? { ...(runtimeOptions as Record<string, unknown>) } : {};
  next.theme = {
    ...(next.theme && typeof next.theme === "object" ? next.theme : {}),
    token: mergeThemeToken(themeToken),
  };
  return next;
};

/**
 * Builds the base options shared by Designer, Form and Viewer.
 *
 * The host can inject i18n labels, language and low-level runtime options,
 * while this helper guarantees a complete theme token.
 */
type RuntimeOptionsInput = {
  i18n?: unknown;
  lang?: string;
  themeToken?: Record<string, unknown>;
  runtimeOptions?: Record<string, unknown>;
};

type DesignerRuntimeOptionsInput = RuntimeOptionsInput & {
  designerEngine?: unknown;
  themePreset?: string;
};

type FormRuntimeOptionsInput = RuntimeOptionsInput & {
  zoomLevel?: number;
  signatureSessionKey?: string;
  signatureSigner?: unknown;
};

export const buildRuntimeOptions = ({
  i18n,
  lang = "es",
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
}: RuntimeOptionsInput = {}) => {
  const next = mergeRuntimeOptions(runtimeOptions, themeToken);
  next.lang = lang;
  next.i18n = i18n;
  return next;
};

/**
 * Builds options for the Designer runtime.
 *
 * Adds designer-only configuration such as themePreset and optional
 * designerEngine, while preserving the normalized base runtime options.
 */
export const buildDesignerRuntimeOptions = ({
  designerEngine,
  themePreset = "sisad",
  i18n,
  lang = "es",
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
}: DesignerRuntimeOptionsInput = {}) => {
  const next = buildRuntimeOptions({ i18n, lang, themeToken, runtimeOptions });
  next.themePreset = themePreset;
  if (designerEngine) {
    next.designerEngine = designerEngine;
  }
  return next;
};

/**
 * Builds options for the Form runtime.
 *
 * Adds form-specific settings such as zoomLevel and signature-session context.
 * Signature behavior remains generic; the actual provider flow belongs to the host.
 */
export const buildRuntimeFormOptions = ({
  i18n,
  lang = "es",
  zoomLevel = 1,
  signatureSessionKey = "",
  signatureSigner = {},
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
}: FormRuntimeOptionsInput = {}) => {
  const next = buildRuntimeOptions({ i18n, lang, themeToken, runtimeOptions });
  next.zoomLevel = zoomLevel;
  next.signatureModalFlow = true;
  next.signatureSessionKey = signatureSessionKey;
  next.signatureSigner = signatureSigner;
  return next;
};

/**
 * Builds options for the Viewer runtime.
 *
 * Viewer uses the generic runtime options only: language, i18n and theme.
 */
export const buildRuntimeViewerOptions = ({
  i18n,
  lang = "es",
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
} = {}) => buildRuntimeOptions({ i18n, lang, themeToken, runtimeOptions });

/** Public alias used by hosts that want to reuse the SISAD default token. */
export { DEFAULT_THEME_TOKEN as DEFAULT_RUNTIME_THEME_TOKEN };
