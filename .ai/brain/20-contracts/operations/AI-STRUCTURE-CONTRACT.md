# AI structure contract

## Invariants

- One active authority per concept.
- Generated inventories live under `.ai/index/`.
- Historical provenance lives under `.ai/archive/`.
- Task state lives in task-card + evidence; views are projections.
- Brain contains durable knowledge, not source snapshots that silently rot.
- Every active Markdown must be reachable from `.ai/README.md` through README hubs.
- Exact duplicate content in active knowledge is a validation failure unless explicitly exempt.
- Deletion requires external backup and reference rewrite.
