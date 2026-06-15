# Modelo de objetos de schema

## Capas

```txt
Data object
Plugin
Factory
Renderer
ValueAdapter
InspectorContract
PdfCompatibilityContract
SnapshotAdapter
CommandHandlers
```

## Data object

Debe ser serializable.

## Plugin contract

```ts
type SchemaPlugin<TSchema extends SisadSchema> = {
  type: TSchema['type'];
  family: SchemaFamily;
  createDefault(ctx): TSchema;
  renderDesigner(root, schema, ctx): void;
  getCapabilities(schema): SchemaInteractionCapabilities;
};
```

## Inspector contract

```ts
type SchemaInspectorContract = {
  type: string;
  family: SchemaFamily;
  sections: Record<string, boolean>;
};
```
