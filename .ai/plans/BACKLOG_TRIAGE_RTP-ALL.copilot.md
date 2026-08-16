---
title: BACKLOG Triage Plan — Global
author: copilot
date: 2026-08-15
---

# Resumen de triage para task-cards con `status: BACKLOG`

Context
-------

Se detectaron ~200 task-cards en `.ai/scrum/task-cards/` marcadas como `BACKLOG`.
Se han actualizado previamente las cards `PARTIAL` del dominio `runtime-platform` y añadido evidencia parcial.

Objetivo
--------

Proponer y ejecutar un plan seguro, repetible y no intrusivo para cerrar o avanzar las cards `BACKLOG`, sin hacer cambios de producto sin consenso.

Propuesta de pasos
------------------

1. Priorizar por campaña: `runtime-platform`, `core-ux`, `visual-ux`, `tooling-architecture`, `naming`, `ai-architecture`, `portability`.
2. Para cada campaña, generar una tabla de prioridad automática basada en `priority` y `wave`.
3. Ejecutar triage por lotes de 10 task-cards: para cada task-card:
   - verificar si existe evidencia técnica ya (search `reports/runtime-platform/evidence` o `reports/*`).
   - si existe evidencia que cubre los criterias, añadir `evidence:` al frontmatter y marcar `status: READY` (lista para revisión).
   - si no existe evidencia pero el trabajo es puramente documental (docs/examples), crear evidencia parcial automatizada con comandos ejecutados y marcar `status: READY`.
   - si el trabajo requiere decisión de producto o diseño (migrations, API changes, dead-code decisions), marcar `status: BLOCKED` y añadir `blocked_by:` apuntando al owner o decisión requerida.
4. Commit por lote y registrar cambios en un `plan` y un `changelog` dentro de `.ai/plans/`.
5. Notificar a owners (si existen) o dejar comentarios en las cards con instrucciones claras para el siguiente reviewer.

Acciones ya ejecutadas
----------------------

- Actualizadas 15 cards `PARTIAL` → `READY` con evidencia parcial (ids: RTP-022, RTP-040, RTP-090, RTP-220, RTP-355, RTP-360, RTP-370, RTP-375, RTP-380, RTP-385, RTP-390, RTP-395, RTP-400, RTP-410, RTP-545).

Siguiente lote recomendado
-------------------------

- Priorizar `runtime-platform` cards con `wave <= 3` y `priority: P0`.
- Después, mover a `core-ux` y `visual-ux` para mantener coherencia UI/UX.

Herramientas y comando
---------------------

Comandos locales para reproducir el listado y la asignación:

```bash
node scripts/ai/same-repo-coordinator.mjs claim . --agent copilot --task BACKLOG-TRIAGE --paths .ai/plans/BACKLOG_TRIAGE_RTP-ALL.copilot.md
node tools/ai-context-pack.mjs ./ --profile triage
npx grep -R "status: BACKLOG" .ai/ | wc -l
```

Próximo paso (autorización requerida)
------------------------------------

¿Continúo con el primer lote automático (10 cards `runtime-platform` con `wave <=3` y `priority: P0`), creando evidence partial para los que no la tengan y marcándolas `READY` según la regla 3 anterior? Responde `sí` para que ejecute el lote o `no` para que genere un plan más pequeño.
