/**
 * Contextos React compartidos por el runtime UI.
 *
 * Rol arquitectónico:
 * - Provee i18n, fuente, registry de plugins, opciones UI y cache temporal.
 * - Permite que Designer/Form/Viewer compartan configuración sin prop drilling.
 *
 * Regla:
 * - Mantener defaults livianos para no bundlear schemas built-in innecesariamente.
 * - Los hosts deben inyectar plugins explícitos cuando sea posible.
 */

import { createContext } from 'react';
import { i18n } from './i18n.js';
import { getDefaultFont, PluginRegistry, pluginRegistry, UIOptions } from '@sisad-pdfme/common';

export const I18nContext = createContext(i18n);

export const FontContext = createContext(getDefaultFont());

// Avoid eagerly bundling all built-in schemas; apps can provide their plugin set explicitly.
export const PluginsRegistry = createContext<PluginRegistry>(pluginRegistry({}));

export const OptionsContext = createContext<UIOptions>({});

export const CacheContext = createContext<Map<string | number, unknown>>(new Map());
