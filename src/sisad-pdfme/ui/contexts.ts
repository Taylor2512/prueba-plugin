import { createContext } from 'react';
import { i18n } from './i18n.js';
import { getDefaultFont, PluginRegistry, pluginRegistry, UIOptions } from '@sisad-pdfme/common';

export const I18nContext = createContext(i18n);

export const FontContext = createContext(getDefaultFont());

// Avoid eagerly bundling all built-in schemas; apps can provide their plugin set explicitly.
export const PluginsRegistry = createContext<PluginRegistry>(pluginRegistry({}));

export const OptionsContext = createContext<UIOptions>({});

export const CacheContext = createContext<Map<string | number, unknown>>(new Map());
