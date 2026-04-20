declare module '../../../../../../src/components/ContentCustomForm/core/infra/sisad-pdfme/schemaRegistry.js' {
  export type CustomSchemaDefinition = {
    id: string;
    label: string;
    category: string;
    pluginType: string;
    autoFillSource?: string;
    defaultValue?: string;
  };
  export function getCustomSchemaDefinitions(): CustomSchemaDefinition[];
  export function subscribeCustomSchemaDefinitions(listener: () => void): () => void;
  export function upsertCustomSchemaDefinition(definition: Record<string, unknown>): unknown;
  export function createCustomSchemaFromDefinition(args: {
    definitionId: string;
    recipient?: Record<string, unknown> | null;
    overrides?: Record<string, unknown>;
  }): Record<string, unknown> | null;
}
