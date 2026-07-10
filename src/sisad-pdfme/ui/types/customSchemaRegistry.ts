/**
 * Custom schema definition for the PDFme plugin.
 */ 
export type CustomSchemaDefinition = {
  id: string;
  label: string;
  category: string;
  pluginType: string;
  autoFillSource?: string;
  autoPlaceText?: string;
  defaultValue?: string;
  defaultSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};
/**
 * Arguments for creating a custom schema from a definition.
 */

export type CustomSchemaCreateArgs = {
  definitionId: string;
  recipient?: Record<string, unknown> | null;
  overrides?: Record<string, unknown>;
};
/**
 * Port interface for interacting with the custom schema registry.
 */
export type CustomSchemaRegistryPort = {
  getCustomSchemaDefinitions: () => CustomSchemaDefinition[];
  subscribeCustomSchemaDefinitions: (listener: () => void) => () => void;
  upsertCustomSchemaDefinition: (definition: Record<string, unknown>) => unknown;
  createCustomSchemaFromDefinition: (args: CustomSchemaCreateArgs) => Record<string, unknown> | null;
};
