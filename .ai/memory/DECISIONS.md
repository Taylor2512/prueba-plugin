# Decisiones

## ADR-001 — reglas versionadas sobre memoria automática

Las normas obligatorias viven en AGENTS y `.ai`. La memoria automática puede recordar contexto, pero no reemplaza contratos del equipo.

## ADR-002 — perfiles de duplicidad separados

Código propio, vendor y documentación activa se miden por separado. Solo owned strict puede bloquear CI por defecto.

## ADR-003 — un escritor por tarea

El paralelismo principal es read-heavy. Los escritores paralelos requieren worktrees y task-cards independientes.

## ADR-004 — skills canónicas compartidas

Las skills viven en `.agents/skills`; los adaptadores de Codex, Claude y Copilot las reutilizan o enlazan, evitando copias divergentes.
