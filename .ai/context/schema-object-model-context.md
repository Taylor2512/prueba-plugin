# Schema Object Model Context

## Capas

```txt
Data object
→ Plugin
→ Factory
→ Renderer
→ Value adapter
→ Inspector contract
→ PDF compatibility contract
→ Snapshot adapter
→ Command handlers
```

## Data object

Debe ser plano, serializable y versionable.

No debe incluir:

- DOM;
- funciones;
- instancias React;
- File directo sin adapter;
- provider runtime vivo.

## Identidad

- `schemaUid` = identidad técnica.
- `name/label` = visual.
- `dataLabel/fieldKey` = integración.
