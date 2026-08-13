/**
 * AppContextProvider centraliza los contextos globales del runtime SISAD PDFME.
 *
 * Responsabilidades:
 * - aplicar tema Ant Design/default/SISAD;
 * - mezclar overrides de tema y etiquetas;
 * - publicar i18n, fuentes, plugins y opciones UI;
 * - mantener al árbol React desacoplado de la configuración externa.
 */
import React, { useCallback, useMemo } from 'react';
import { ConfigProvider as ThemeConfigProvider } from 'antd';
import { I18nContext, FontContext, PluginsRegistry, OptionsContext } from '../contexts.js';
import { i18n, getDict } from '../i18n.js';
import { defaultTheme, sisadTheme } from '../theme.js';
import type { Dict, Font, Lang, UIOptions, PluginRegistry } from '@sisad-pdfme/common';

/**
 * Props requeridas por el provider de aplicación.
 *
 * Estos valores provienen del host que instancia Designer/Form/Viewer y se
 * publican hacia componentes internos mediante React Context.
 */
type Props = {
  children: React.ReactNode;
  lang: Lang;
  font: Font;
  plugins: PluginRegistry;
  options: UIOptions;
};

/**
 * Verifica si un valor puede tratarse como objeto plano para mezcla profunda.
 */
const isPlainObject = (item: unknown): item is Record<string, unknown> =>
  Boolean(item) && typeof item === 'object' && !Array.isArray(item);

/**
 * Mezcla profunda de objetos de configuración.
 *
 * Se usa para combinar temas y diccionarios sin perder claves anidadas
 * previamente definidas por los presets base.
 */
const mergeDeepObjects = <T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U,
): T & U => {
  const output = { ...target } as T & U;

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      if (isPlainObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue });
        } else {
          const targetValue = target[key];
          if (isPlainObject(targetValue)) {
            // Using Record<string, unknown> for recursive type
            (output as Record<string, unknown>)[key] = mergeDeepObjects(targetValue, sourceValue);
          } else {
            Object.assign(output, { [key]: sourceValue });
          }
        }
      } else {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }
  return output;
};

/**
 * Provider raíz de contextos para el runtime UI.
 *
 * Memoiza tema y diccionario para evitar recalcularlos en cada render y expone
 * una función i18n estable con useCallback.
 */
const AppContextProvider = ({ children, lang, font, plugins, options }: Props) => {
  const theme = useMemo(() => {
    let nextTheme = options.themePreset === 'sisad' ? sisadTheme : defaultTheme;
    if (options.theme) {
      nextTheme = mergeDeepObjects(
        nextTheme as unknown as Record<string, unknown>,
        options.theme as unknown as Record<string, unknown>,
      ) as typeof nextTheme;
    }
    return nextTheme;
  }, [options.theme, options.themePreset]);

  const dict = useMemo(() => {
    let nextDict = getDict(lang);
    if (options.labels) {
      nextDict = mergeDeepObjects(
        nextDict as unknown as Record<string, unknown>,
        options.labels as unknown as Record<string, unknown>,
      ) as typeof nextDict;
    }
    return nextDict;
  }, [lang, options.labels]);

  const translate = useCallback((key: keyof Dict) => i18n(key, dict), [dict]);

  return (
    <ThemeConfigProvider theme={theme}>
      <I18nContext.Provider value={translate}>
        <FontContext.Provider value={font}>
          <PluginsRegistry.Provider value={plugins}>
            <OptionsContext.Provider value={options}>{children}</OptionsContext.Provider>
          </PluginsRegistry.Provider>
        </FontContext.Provider>
      </I18nContext.Provider>
    </ThemeConfigProvider>
  );
};

export default AppContextProvider;
