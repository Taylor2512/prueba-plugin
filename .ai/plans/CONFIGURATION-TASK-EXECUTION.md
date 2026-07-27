# Ejecución de tareas — Configuración unificada

Fuente: `PLAN_CONTINUIDAD_CONFIGURACION_UNIFICADA_SISAD_PDFME.md`.

## Estado actual respetado

- `CONFIG-001` ya está en `review`; no se reinicia.
- `CONFIG-002` queda `ready` como auditoría/baseline faltante.
- Las demás tareas permanecen en backlog hasta cumplir dependencias.
- `SPRINT-CURRENT.md` es la única fuente de estado.

## Orden

```text
CONFIG-002 (baseline pendiente)
CONFIG-001 (review existente)
  ↓
CONFIG-003 → CONFIG-004 → CONFIG-005 → CONFIG-006 → CONFIG-007
  ↓
CONFIG-008 → CONFIG-009 → CONFIG-010
  ├─ CONFIG-011
  ├─ CONFIG-012
  ├─ CONFIG-013
  └─ CONFIG-014 → CONFIG-015
       ├─ CONFIG-016
       ├─ CONFIG-017
       └─ CONFIG-018
             ↓
         CONFIG-019
             ↓
         CONFIG-020
```

## Task-cards

| ID | Título | Dependencias | Prioridad | Estado inicial |
|---|---|---|---|---|
| [CONFIG-001](../scrum/task-cards/CONFIG-001-repair-public-config-api.md) | Reparar API pública de configuración (Fase 1) | — | P0 | review |
| [CONFIG-002](../scrum/task-cards/CONFIG-002-audit-configuration-sources.md) | Auditar fuentes y lectores de configuración | — | P0 | ready |
| [CONFIG-003](../scrum/task-cards/CONFIG-003-canonicalize-config-v2.md) | Canonicalizar contrato Config v2 | CONFIG-001, CONFIG-002 | P0 | backlog |
| [CONFIG-004](../scrum/task-cards/CONFIG-004-create-legacy-config-migration.md) | Crear migrador de configuración legacy | CONFIG-003 | P0 | backlog |
| [CONFIG-005](../scrum/task-cards/CONFIG-005-create-config-validation.md) | Crear validación de configuración | CONFIG-003, CONFIG-004 | P0 | backlog |
| [CONFIG-006](../scrum/task-cards/CONFIG-006-implement-config-service.md) | Implementar SisadPdfmeConfigService | CONFIG-004, CONFIG-005 | P0 | backlog |
| [CONFIG-007](../scrum/task-cards/CONFIG-007-implement-config-selectors.md) | Implementar selectores públicos | CONFIG-006 | P0 | backlog |
| [CONFIG-008](../scrum/task-cards/CONFIG-008-create-feature-registry.md) | Crear FeatureRegistry y dependencias | CONFIG-006, CONFIG-007 | P0 | backlog |
| [CONFIG-009](../scrum/task-cards/CONFIG-009-create-action-component-registries.md) | Crear ActionConfigRegistry y ComponentRegistry | CONFIG-008 | P0 | backlog |
| [CONFIG-010](../scrum/task-cards/CONFIG-010-integrate-provider-public-wrappers.md) | Integrar Provider y wrappers públicos | CONFIG-006, CONFIG-007, CONFIG-008, CONFIG-009 | P0 | backlog |
| [CONFIG-011](../scrum/task-cards/CONFIG-011-migrate-right-sidebar-listview.md) | Migrar RightSidebar y ListView | CONFIG-010 | P1 | backlog |
| [CONFIG-012](../scrum/task-cards/CONFIG-012-migrate-left-sidebar.md) | Migrar LeftSidebar | CONFIG-010 | P1 | backlog |
| [CONFIG-013](../scrum/task-cards/CONFIG-013-migrate-canvas-feature-flags.md) | Migrar flags de Canvas | CONFIG-010 | P1 | backlog |
| [CONFIG-014](../scrum/task-cards/CONFIG-014-migrate-inspector-configuration.md) | Migrar Inspector | CONFIG-009, CONFIG-010 | P1 | backlog |
| [CONFIG-015](../scrum/task-cards/CONFIG-015-migrate-schema-profiles.md) | Migrar perfiles de schemas | CONFIG-008, CONFIG-014 | P1 | backlog |
| [CONFIG-016](../scrum/task-cards/CONFIG-016-unify-assignment-collaboration.md) | Unificar assignment y collaboration | CONFIG-009, CONFIG-010 | P1 | backlog |
| [CONFIG-017](../scrum/task-cards/CONFIG-017-configure-documents-comments.md) | Configurar documentos y comentarios | CONFIG-008, CONFIG-010, CONFIG-011 | P1 | backlog |
| [CONFIG-018](../scrum/task-cards/CONFIG-018-configure-signatures.md) | Configurar firmas y providers | CONFIG-008, CONFIG-015 | P1 | backlog |
| [CONFIG-019](../scrum/task-cards/CONFIG-019-dynamic-configuration-controller.md) | Implementar configuración dinámica y controller | CONFIG-010, CONFIG-011, CONFIG-012, CONFIG-013, CONFIG-014, CONFIG-016, CONFIG-017, CONFIG-018 | P1 | backlog |
| [CONFIG-020](../scrum/task-cards/CONFIG-020-configuration-qa-docs-gates.md) | Cerrar QA, documentación y quality gates | CONFIG-001, CONFIG-002, CONFIG-003, CONFIG-004, CONFIG-005, CONFIG-006, CONFIG-007, CONFIG-008, CONFIG-009, CONFIG-010, CONFIG-011, CONFIG-012, CONFIG-013, CONFIG-014, CONFIG-015, CONFIG-016, CONFIG-017, CONFIG-018, CONFIG-019 | P1 | backlog |

## Paralelismo

Después de `CONFIG-010`, `CONFIG-011`, `CONFIG-012`, `CONFIG-013` y `CONFIG-014`
pueden ejecutarse en worktrees separados si no comparten writers. Solo una tarea
crítica de Canvas/runtime puede estar `in-progress` simultáneamente.

## Control de consumo

- 8 archivos iniciales;
- 5 archivos modificados;
- 2 rondas de búsqueda;
- 1 dominio;
- 75 % de contexto = checkpoint/handoff;
- 3 parches fallidos = detener.
