# Prompt maestro para Codex — corrección visual y comportamiento SISAD PDFME

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite,
Tailwind, accesibilidad, sistemas de diseño y editores PDF.

## Objetivo

Ejecutar la task-card VISUX activa, sus contratos actuales y la evidencia
correspondiente. Los planes históricos no son autoridad.

La UI debe corregirse sin filtrar lógica visual al host y sin crear fuentes
paralelas.

## Inicio obligatorio

1. Lee `.ai/START.md`.
2. Lee la ruta indicada por la task.
3. Lee una sola task-card VISUX activa.
4. Revisa la task COREUX indicada en `refines`.
5. Registra claim/worktree/commit base.
6. Reproduce el test de caracterización.
7. No edites hasta tener una hipótesis comprobable.

## Reglas

- Un writer.
- Máximo dos readers read-only.
- Máximo cinco archivos productivos.
- Máximo ocho lecturas iniciales.
- Máximo dos búsquedas amplias.
- TypeScript/TSX para core nuevo.
- No imports de /features/modules.
- No segunda fuente de estado, registry, event bus, snapshot u overlay manager.
- No setTimeout para lifecycle.
- No z-index arbitrario.
- No tocar Moveable, Selecto o coordinateMath salvo task específica.
- No corregir internals desde CSS del host.
- Un control visible tiene handler o reason.
- Preservar IDs, owner, locks, selection, zoom, scroll y snapshot.
- No usar los términos artificiales que el proyecto está retirando para
  nombrar APIs nuevas; usar nombres directos por responsabilidad.
- No continuar automáticamente con la siguiente task.

## Cadena obligatoria

```text
UI intent
→ access/action state
→ command
→ mutation
→ event
→ effect
→ snapshot
```

## Entrega

- causa confirmada;
- archivos modificados;
- casos cubiertos;
- pruebas;
- gates pasados/fallidos/no ejecutados;
- identidades preservadas;
- riesgos;
- rollback;
- siguiente task sugerida;
- condición de parada.

## Primera task

Empezar por `VISUX-001`. No aplicar cambios productivos durante esa task.
