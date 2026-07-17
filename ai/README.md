# Arquitectura IA de SISAD PDFME

`ai/**` contiene la fuente de verdad para agentes, worktrees, task-cards, memoria, planes y gates.

## Objetivos

- Evitar lectura indiscriminada de cientos de Markdown.
- Una tarea verificable por ejecución.
- Separar proveedor, agente lógico y rol Git.
- Trabajar en paralelo sin modificar `main`.
- Integrar mediante commits seleccionados.
- Mantener Tailwind-first sin dañar geometría.
- Preservar Designer, Form, Viewer, Generator y Snapshot.
- Evitar reabrir tareas completadas o recrear wrappers.

## Orden de lectura

```txt
1. start/START.md
2. project/worktree-topology.md
3. project/git-operating-model.md
4. router/ROUTER.md
5. router/CONTEXT_BUDGET.md
6. memory/project-memory.md
7. coordination/worktrees/WAVE-<n>.md
8. task-cards/active/<task>.md
9. context/<context>.md
10. rules/<rules>.md
11. playbooks/<playbook>.md
```

## Capas

| Carpeta | Función |
|---|---|
| start | Entrada y quickstarts |
| project | Contratos estables |
| router | Enrutamiento y presupuesto |
| agents | Agentes lógicos |
| subagents | Revisores |
| skills | Capacidades reutilizables |
| context | Conocimiento focal |
| rules | Restricciones |
| playbooks | Procedimientos |
| plans | Estrategia por fases |
| prompts | Wrappers operativos |
| coordination | Waves y protocolo |
| task-cards | Trabajo actual e histórico |
| memory | Estado compacto |
| checklists | Gates |
| templates | Formatos |
| baselines | Evidencia visual |
| reports | Hallazgos |
| tooling | Scanners y validación |
| archive | Material sustituido |

## Coordinación viva

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme
```

## Exclusiones obligatorias

```txt
.worktrees/**
.ai-md-architecture-backups/**
node_modules/**
dist/**
coverage/**
test-results/**
playwright-report/**
unificados/**
.tailwind-migration-backups/**
```
