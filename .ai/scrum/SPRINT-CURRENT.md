# Sprint actual

Objetivo: adoptar la arquitectura IA sin interrumpir el desarrollo de SISAD PDFME.

Notas operativas:

- `SPRINT-CURRENT.md` es la fuente única de estado durable.
- `CLAIMS.md` contiene solo leases activas de escritura.
- Cada task-card activa debe tener un writer único; los readers extra son read-only y acotados.

| ID | Estado | Owner | Modelo | Worktree | Evidencia |
|---|---|---|---|---|---|
| [AI-001](tasks/AI-001.md) | Done | coordinator | Terra medium | actual | núcleo y enlaces verificados |
| [AI-002](tasks/AI-002.md) | Done | dry-auditor | Luna low | read-only | 208 Markdown; 0 links rotos; 2 plantillas esenciales |
| [AI-003](tasks/AI-003.md) | Done | implementer | Terra medium | actual | 11 skills válidas; adapters explícitos y delgados |
| [AI-004](tasks/AI-004.md) | Done | memory-scrum | Luna low | read-only | owners y handoff consolidados |
| [DEDUP-001](task-cards/DEDUP-001-smart-placement.md) | Done | canvas-batch | Sol high | `/workspace/wt-canvas` | recorrido canónico; 5 tests; 0 clones focales |
| [DEDUP-003](task-cards/DEDUP-003-comments-overlay.md) | Done | canvas-batch | Sol high | `/workspace/wt-canvas` | view-model canónico; clon focal 2→1 |
| [DEDUP-004](task-cards/DEDUP-004-inline-edit-overlay.md) | Done | canvas-batch | Sol high | `/workspace/wt-canvas` | primitive + estrategias; 0 clones focales |
| [DEDUP-002](task-cards/DEDUP-002-keyboard-command-registry.md) | Done | shared-batch | Sol high | `/workspace/wt-shared` | command registry; 3 tests |
| [DEDUP-006](task-cards/DEDUP-006-selection-commands.md) | Done | shared-batch | Sol high | `/workspace/wt-shared` | command helper; 5 tests |
| [DEDUP-007](task-cards/DEDUP-007-schema-clipboard.md) | Done | shared-batch | Sol high | `/workspace/wt-shared` | adapters; 26 tests; 0 clones focales |
| [DEDUP-005](task-cards/DEDUP-005-right-sidebar-actions.md) | Done | sidebar-schema-batch | Sol high | `/workspace/wt-sidebar` | 12 props duplicadas eliminadas |
| [DEDUP-008](task-cards/DEDUP-008-inspector-taxonomy.md) | Done | sidebar-schema-batch | Sol high | `/workspace/wt-sidebar` | taxonomía canónica; 102→101 |
| [DEDUP-009](task-cards/DEDUP-009-custom-field-modal.md) | Done | sidebar-schema-batch | Sol high | `/workspace/wt-sidebar` | primitive + validator; 101→100 |
| [DEDUP-010](task-cards/DEDUP-010-action-chrome.md) | Done | sidebar-schema-batch | Sol high | `/workspace/wt-sidebar` | chrome de familia; 100→99 |
| [DOCS-001](task-cards/DOCS-001-canonical-common-docs.md) | Done | coordinator | Sol medium | actual | índice canónico; 0 párrafos duplicados |
| [QUALITY-001](task-cards/QUALITY-001-jscpd-profiles.md) | Done | coordinator | Sol medium | actual | 3 perfiles reproducibles |
| [DEDUP-011](task-cards/DEDUP-011-strict-owned-residuals.md) | Done | coordinator | Sol high | actual | owned 4→1; strict 65→62 |
| [UX-001](task-cards/UX-001-right-sidebar-listview-compactness-and-dnd.md) | In review | claude-opus | Opus 4.8 max | actual | contador único, filtro accesible, delete seguro, overlay alineado; lint/build/unit verdes (36 tests) |
| [CONFIG-001](task-cards/CONFIG-001-repair-public-config-api.md) | In review | claude-opus | Opus 4.8 max | actual | Fase 1: barrel público restaurado; ~13 errores tsc resueltos, 0 nuevos; lint/build verdes; +3 tests contrato |
| [CONFIG-002](task-cards/CONFIG-002-audit-configuration-sources.md) | Ready | config-specialist | Terra medium | pendiente | baseline de fuentes/readers y recursos |
| [CONFIG-015](task-cards/CONFIG-015-migrate-schema-profiles.md) | Done | schema-specialist | Sol high | actual | perfiles por familia unificados; tests focales y build verdes |
| [CONFIG-016](task-cards/CONFIG-016-unify-assignment-collaboration.md) | Done | runtime-architect | Sol high | actual | registry único y action state alineado; vitest/build/duplicate gate verdes |
| [CONFIG-017](task-cards/CONFIG-017-configure-documents-comments.md) | Done | runtime-architect | Terra high | actual | documents/comments desacoplados de visibilidad; vitest y build verdes |
| [CONFIG-018](task-cards/CONFIG-018-configure-signatures.md) | Done | schema-specialist | Terra high | actual | firmas y providers validados; vitest y build verdes |
| [CONFIG-019](task-cards/CONFIG-019-dynamic-configuration-controller.md) | Done | runtime-architect | Sol high | actual | controller público, hot update y rebuild controlado validados; vitest/playwright/build verdes |
| [CONFIG-020](task-cards/CONFIG-020-configuration-qa-docs-gates.md) | In progress | qa-reviewer | Terra medium | actual | docs, checker y suite Playwright de configuración; 16 escenarios Playwright y direct-config-readers verdes; lint/build/duplicate/vitest ejecutados; smoke test del inspector, config, devtools, adapters, primitives, integration, recipients y options verdes; dead-code ahora solo deja baseline heredada de deps/types y 3 duplicate exports semánticos |

WIP máximo: 3; cuentan `In progress` e `In review`. `SPRINT-CURRENT.md` es el único propietario del estado.
