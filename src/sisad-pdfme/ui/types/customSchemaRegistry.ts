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

export type CustomSchemaCreateArgs = {
  definitionId: string;
  recipient?: Record<string, unknown> | null;
  overrides?: Record<string, unknown>;
};

export type CustomSchemaRegistryPort = {
  getCustomSchemaDefinitions: () => CustomSchemaDefinition[];
  subscribeCustomSchemaDefinitions: (listener: () => void) => () => void;
  upsertCustomSchemaDefinition: (definition: Record<string, unknown>) => unknown;
  createCustomSchemaFromDefinition: (args: CustomSchemaCreateArgs) => Record<string, unknown> | null;
};
