# Ejemplos dinámicos con datos externos

## Contrato mínimo

```ts
type HostExampleInput = {
  template: Template
  recipients?: unknown[]
  documents?: unknown[]
  activeRecipientId?: string | null
  config?: SisadPdfmeGlobalConfig
}
```

## Reglas

- Los recipients no se duplican en `collaboration.users` y `runtimeOptions.collaboration.recipients`.
- Los documents no se duplican en `uploadedDocuments` y `documents` si el wrapper ya soporta `documents`.
- El host no crea contextos internos del diseñador.
- Toda visualización se controla desde `config.visibility`.
- Toda acción visible viene del action registry o controller público.
