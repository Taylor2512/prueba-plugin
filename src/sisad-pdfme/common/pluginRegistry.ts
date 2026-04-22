import { Plugins, Plugin, PluginRegistry } from './types.js';
import { getSchemaTypeInspectorPreset } from '../schemas/schemaFamilies.js';

const resolveInspectorConfig = (plugin?: Plugin) => plugin?.propPanel?.inspector;

/**
 * Wraps plugins collection with utility methods
 */
export const pluginRegistry = (plugins: Plugins): PluginRegistry => {
  return {
    plugins: plugins,
    entries: (): [string, Plugin][] => Object.entries(plugins),
    values: (): Plugin[] => Object.values(plugins),
    exists: (): boolean => Object.values(plugins).length > 0,
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
    findByType(type: string): Plugin | undefined {
      const [, plugin] = this.findWithLabelByType(type);
      return plugin;
    },
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
    getSupportedActionsByType(type: string) {
      return this.getFamilyByType(type)?.supportedActions || [];
    },
    getStrategiesByType(type: string) {
      return this.getFamilyByType(type)?.strategies || [];
    },
    getVisibleSectionsByType(type: string) {
      return this.getFamilyByType(type)?.visibleSections || [];
    },
  };
};
