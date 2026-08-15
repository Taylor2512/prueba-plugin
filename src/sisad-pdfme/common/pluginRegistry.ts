/**
 * @file pluginRegistry.ts
 *
 * Wrapper utilitario para colecciones de plugins.
 *
 * Responsabilidades:
 * - listar plugins;
 * - buscar plugins por type;
 * - resolver familia/inspector de schema según preset + overrides del plugin;
 * - consultar acciones, estrategias y secciones visibles del DetailView.
 */

import { Plugins, Plugin, PluginRegistry } from '@sisad-pdfme/common/types';
import { getSchemaTypeInspectorPreset } from '@sisad-pdfme/schemas/schemaFamilies';

/** Extrae configuración de inspector desde el propPanel del plugin. */
const resolveInspectorConfig = (plugin?: Plugin) => plugin?.propPanel?.inspector;

/**
 * Wraps plugins collection with utility methods
 */
export const pluginRegistry = (plugins: Plugins): PluginRegistry => {
  return {
    plugins: plugins,
    /* Lista pares [label, plugin] preservando labels del registro original. */
entries: (): [string, Plugin][] => Object.entries(plugins),
    /* Lista solo las definiciones de plugins. */
values: (): Plugin[] => Object.values(plugins),
    /* Indica si el registry contiene al menos un plugin. */
exists: (): boolean => Object.values(plugins).length > 0,
    /* Busca un plugin por defaultSchema.type y devuelve también su label. */
findWithLabelByType(type: string): [string, Plugin | undefined] {
      for (const [label, plugin] of Object.entries(this.plugins) as [string, Plugin][]) {
        if (!plugin || typeof plugin !== 'object') continue;
        if (!plugin.propPanel || typeof plugin.propPanel !== 'object') continue;

        const defaultSchema = plugin.propPanel.defaultSchema as Record<string, unknown>;

        if (defaultSchema && 'type' in defaultSchema && defaultSchema.type === type) {
          return [label, plugin];
        }
      }
      return ['', undefined];
    },
    /* Devuelve el plugin asociado a un type de schema. */
findByType(type: string): Plugin | undefined {
      const [, plugin] = this.findWithLabelByType(type);
      return plugin;
    },
    /* Resuelve preset de familia + overrides del inspector del plugin. */
getFamilyByType(type: string) {
      const plugin = this.findByType(type);
      const inspector = resolveInspectorConfig(plugin);
      const preset = getSchemaTypeInspectorPreset(type);
      return {
        ...preset,
        visibleSections: inspector?.visibleSections?.length ? inspector.visibleSections : preset.visibleSections,
        propertyMap: {
          ...preset.propertyMap,
          ...(inspector?.propertyMap || inspector?.fieldSections || {}),
        },
        supportedActions: inspector?.supportedActions?.length ? inspector.supportedActions : preset.supportedActions,
        strategies: inspector?.strategies?.length ? inspector.strategies : preset.strategies,
        supportsConnections:
          inspector?.supportsConnections ?? inspector?.includeConnections ?? preset.supportsConnections,
        supportsCollaboration:
          inspector?.supportsCollaboration ?? inspector?.includeCollaboration ?? preset.supportsCollaboration,
        supportsValidation:
          inspector?.supportsValidation ?? inspector?.includeValidation ?? preset.supportsValidation,
      };
    },
    /* Devuelve acciones soportadas por tipo de schema. */
getSupportedActionsByType(type: string) {
      return this.getFamilyByType(type)?.supportedActions || [];
    },
    /* Devuelve estrategias declaradas por tipo de schema. */
getStrategiesByType(type: string) {
      return this.getFamilyByType(type)?.strategies || [];
    },
    /* Devuelve secciones visibles del DetailView por tipo de schema. */
getVisibleSectionsByType(type: string) {
      return this.getFamilyByType(type)?.visibleSections || [];
    },
  };
};
