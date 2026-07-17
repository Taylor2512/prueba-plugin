# Wave 1.5 — Estabilización post-migración

## Estado base

La consolidación previa dejó:

```txt
lint: verde
build: verde
Vitest:
  482 archivos aprobados
  27 archivos fallidos
  1113 tests aprobados
  17 tests fallidos
  1 todo
```

No comenzar polish visual hasta clasificar y cerrar estos fallos.

## Codex — W15-CODEX-CORE-CONTRACTS

Task-card:

```txt
ai/task-cards/active/W15-CODEX-CORE-CONTRACTS.md
```

Áreas:

```txt
canvasDropPipeline
browser/downloads
checkboxGroup
schemas/options
signature/validation
pdf-lib/api/form
```

## Claude — W15-CLAUDE-INSPECTOR-CONTRACTS

Task-card:

```txt
ai/task-cards/active/W15-CLAUDE-INSPECTOR-CONTRACTS.md
```

Áreas:

```txt
DetailView
schemas/actions
schemaFamilies
radioGroup
propPanel
CtlBar
```

## Copilot — W15-COPILOT-TEST-INFRA

Task-card:

```txt
ai/task-cards/active/W15-COPILOT-TEST-INFRA.md
```

Áreas:

```txt
vitest.config
tests setup
src/features/pdfcomponent
tests smoke de host/UI
```

## Gate

```txt
lint
build
Vitest completo
Playwright focal
```

## Condición de cierre

- Cero fallos unitarios no clasificados.
- Ningún test adaptado para ocultar un defecto.
- Todos los commits dentro de ownership.
- Handoffs y gate registrados.
