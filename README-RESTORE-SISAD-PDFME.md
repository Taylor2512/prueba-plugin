# Paquete adaptado — restauración funcional SISAD PDFME

Este ZIP reproduce la estructura real de `prueba-plugin`.

## Aplicación

Fusionar la carpeta `prueba-plugin/` sobre:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Estructura respetada

- Planes: `.ai/plans/`
- Prompts: `.ai/prompts/`
- Ruta: `.ai/routes/`
- Playbook: `.ai/playbooks/`
- Task-cards: `.ai/scrum/task-cards/`
- Reportes: `reports/restoration/`
- API docs: `docs/08-api-reference/`
- QA docs: `docs/10-testing-qa/`
- Roadmap local: `src/sisad-pdfme/RESTORATION-ROADMAP.md`

## Protección del estado actual

El paquete no sobrescribe:

```txt
.ai/scrum/SPRINT-CURRENT.md
.ai/scrum/PRODUCT-BACKLOG.md
.ai/scrum/ACTIVE.md
.ai/scrum/COMPLETED.md
.ai/scrum/CLAIMS.md
.ai/memory/CURRENT.md
.ai/memory/HANDOFF.md
```

Las filas de fusión están en:

```txt
reports/restoration/PRODUCT-BACKLOG-ROWS.md
reports/restoration/SPRINT-CURRENT-ROWS.md
reports/restoration/SCRUM-MERGE-INSTRUCTIONS.md
```

## Estado inicial

```txt
RESTORE-001 = Ready
RESTORE-002..024 = Backlog
```

## Primera acción

Abrir:

```txt
.ai/routes/restoration.md
.ai/scrum/task-cards/RESTORE-001-congelar-baseline-forense-y-matriz-de-capacidades.md
```

Registrar claim y ejecutar únicamente el baseline forense.
