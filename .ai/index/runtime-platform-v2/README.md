# Runtime Platform indexes

Lookup mecánico; no cargar completo en contexto.

- `code-files.jsonl`: 491 archivos inventariados.
- `docs-files.jsonl`: 613 Markdown inventariados.
- `styles-files.jsonl`: 5 hojas de estilo.
- `symbols.jsonl`: símbolos detectados por el context pack.
- `schemas.jsonl`: matriz inicial de tipos/familias.
- `existing-taskcards.jsonl`: 160 task-cards históricas detectadas.

El índice señala también archivos truncados/omitidos. Un agente debe abrir el source vivo
cuando una task dependa de uno de esos archivos.
