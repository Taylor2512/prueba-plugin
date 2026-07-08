const DEFAULT_THEME_TOKEN = Object.freeze({
  colorPrimary: "#1e0b4a",
  colorBgContainer: "#ffffff",
  colorBgBase: "#ffffff",
  borderRadius: 4,
});

const mergeThemeToken = (themeToken = DEFAULT_THEME_TOKEN) => ({
  ...DEFAULT_THEME_TOKEN,
  ...(themeToken && typeof themeToken === "object" ? themeToken : {}),
});

const mergeRuntimeOptions = (runtimeOptions = {}, themeToken = DEFAULT_THEME_TOKEN) => {
  const next = runtimeOptions && typeof runtimeOptions === "object" ? { ...runtimeOptions } : {};
  next.theme = {
    ...(next.theme && typeof next.theme === "object" ? next.theme : {}),
    token: mergeThemeToken(themeToken),
  };
  return next;
};

export const buildRuntimeOptions = ({
  i18n,
  lang = "es",
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
} = {}) => {
  const next = mergeRuntimeOptions(runtimeOptions, themeToken);
  next.lang = lang;
  next.i18n = i18n;
  return next;
};

export const buildDesignerRuntimeOptions = ({
  designerEngine,
  themePreset = "sisad",
  i18n,
  lang = "es",
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
} = {}) => {
  const next = buildRuntimeOptions({ i18n, lang, themeToken, runtimeOptions });
  next.themePreset = themePreset;
  if (designerEngine) {
    next.designerEngine = designerEngine;
  }
  return next;
};

export const buildRuntimeFormOptions = ({
  i18n,
  lang = "es",
  zoomLevel = 1,
  signatureSessionKey = "",
  signatureSigner = {},
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
} = {}) => {
  const next = buildRuntimeOptions({ i18n, lang, themeToken, runtimeOptions });
  next.zoomLevel = zoomLevel;
  next.signatureModalFlow = true;
  next.signatureSessionKey = signatureSessionKey;
  next.signatureSigner = signatureSigner;
  return next;
};

export const buildRuntimeViewerOptions = ({
  i18n,
  lang = "es",
  themeToken = DEFAULT_THEME_TOKEN,
  runtimeOptions = {},
} = {}) => buildRuntimeOptions({ i18n, lang, themeToken, runtimeOptions });

export { DEFAULT_THEME_TOKEN as DEFAULT_RUNTIME_THEME_TOKEN };
