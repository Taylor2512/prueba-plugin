# Prompt — Refactor reducción de duplicidad

Actúa como arquitecto frontend senior. Reduce duplicidad, wrappers y `any` sin romper contratos.

```bash
rg "any|as any|Record<string, any>|innerHTML|Object.assign\(.*style|style\.|document.createElement|classList.add" src/sisad-pdfme src/features
```

Prioridad: reutilizar helpers existentes, agrupar por familia, extraer factories, eliminar wrappers triviales, tipar con unions/type guards, reportar riesgos.
