# API pública y entrypoints

## Entry points esperados

- `@sisad-pdfme/ui`
- `@sisad-pdfme/common`
- `@sisad-pdfme/schemas`
- `@sisad-pdfme/generator`
- `@sisad-pdfme/converter`
- `@sisad-pdfme/pdf-lib`

## Superficies públicas

- `Designer`
- `Form`
- `Viewer`
- `generate`
- `schemaRegistry`
- `snapshotAdapter`
- `commandBus`
- `templateValidator`

## Reglas

- No exponer DOM interno.
- No exponer estructuras no serializables.
- Versionar cambios de contrato.
- Documentar migraciones.
