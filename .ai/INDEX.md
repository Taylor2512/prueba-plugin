# .ai/INDEX.md — Índice mínimo del diseñador

## Carga base obligatoria

```txt
.ai/ROUTER.md
.ai/CONTEXT_BUDGET.md
.ai/memory/project-memory.md
.ai/context-map.md
.ai/agents/registry.md
```

## Flujo

```txt
Mensaje del usuario
→ ROUTER decide dominio
→ seleccionar task-card
→ cargar contexto focal
→ cargar regla principal
→ cargar playbook
→ ejecutar dentro de presupuesto
```

## No cargar por defecto

- todos los `.md`;
- todo `sisad-pdfme.md`;
- todo `codigo-sisad-pdfme.txt`;
- reportes históricos largos;
- prompts no relacionados;
- fuentes externas.

## Contextos disponibles

| Dominio | Contexto |
|---|---|
| Runtime diseñador | `.ai/context/designer-runtime-context.md` |
| Multipágina/canvas | `.ai/context/canvas-multipage-context.md` |
| Modelo de schemas | `.ai/context/schema-object-model-context.md` |
| Familias de schema | `.ai/context/schema-families-context.md` |
| Inspector | `.ai/context/inspector-context.md` |
| CommandBus | `.ai/context/commandbus-context.md` |
| Snapshot diseñador | `.ai/context/snapshot-designer-context.md` |
| CSS visual | `.ai/context/css-visual-context.md` |
| SOLID/OOP | `.ai/context/solid-oop-context.md` |
| DocuSign-like | `.ai/context/docusign-like-context.md` |

## Task-cards principales

```txt
TASK-001-fix-multipage.md
TASK-002-harden-selecto-moveable.md
TASK-003-stabilize-option-groups.md
TASK-004-schema-object-model.md
TASK-005-reduce-any.md
TASK-006-improve-inspector-sections.md
TASK-007-compact-docusign-like-fields.md
TASK-008-clean-feature-wrappers.md
TASK-009-designer-snapshot-roundtrip.md
TASK-010-commandbus-actions.md
```
