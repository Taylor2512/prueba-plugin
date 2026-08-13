# Runtime Platform indexes

Lookup mecánico de la campaña. No cargar archivos JSONL completos en contexto.

Los índices fueron generados desde snapshots anteriores y pueden contener
conteos o paths desactualizados después de la normalización de nombres. El
worktree vivo y los context packs más recientes tienen prioridad.

Archivos esperados cuando estén generados:

- `code-files.jsonl`;
- `docs-files.jsonl`;
- `styles-files.jsonl`;
- `symbols.jsonl`;
- `schemas.jsonl`;
- `existing-taskcards.jsonl`.

Antes de usar métricas de cobertura, confirmar que el índice fue regenerado
contra el HEAD actual.
