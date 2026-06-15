# Prompt — Reparar regresión multipágina

Problema: funciona en página 1 pero falla en páginas posteriores.

```bash
rg "pageNumber|pageIndex|documentId|querySelector\(|getBoundingClientRect|clientX|clientY|data-paper-page|data-schema-id" src/sisad-pdfme/ui src/sisad-pdfme/shared
```

Reglas: no asumir página 1, resolver página bajo puntero, renderizar por documentId+pageNumber, overlays contra schema real, no-overlap por owner/document/page, snapshot conserva página.
