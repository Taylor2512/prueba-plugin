# Plan maestro V5 — Arquitectura IA para SISAD PDFME

**Fecha:** 22 de julio de 2026  
**Proyecto objetivo:** `prueba-plugin`  
**Ámbito principal:** `src/sisad-pdfme` y su laboratorio  
**Propósito:** elevar la arquitectura V4 a un sistema operativo de ingeniería asistida por IA, medible, versionado y consciente de costos.

## 1. Resumen ejecutivo

La V4 tenía una dirección correcta —router, skills, memoria, Scrum y adaptadores— pero estaba demasiado fragmentada: muchos archivos mínimos repetían reglas sin convertirlas en controles ejecutables. La V5 concentra políticas, introduce reglas por ruta, perfiles reales de jscpd, task-cards derivadas del reporte actual, scripts de validación, agentes configurables y una política explícita de escalamiento de modelo.

El reporte actual registra 103 clones y 2.121 líneas duplicadas. Sin embargo, no todos representan la misma deuda: 61 bloques están dentro del fork `pdf-lib`, 26 en un Markdown consolidado y 16 en código propio. El sistema debe priorizar esos 16, auditar vendor por separado y reemplazar documentación consolidada por fuentes canónicas enlazadas.

## 2. Problemas que resuelve

1. Instrucciones repetidas entre AGENTS, CLAUDE, Copilot, prompts y skills.
2. Agentes que cargan cientos de Markdown y entran en análisis circular.
3. Uso de modelos caros para inventarios y reportes mecánicos.
4. Paralelismo de escritura sin worktrees ni ownership.
5. Memoria que mezcla hechos durables con estado temporal.
6. Scrum documental sin backlog ejecutable ni Definition of Done verificable.
7. jscpd que mezcla código propio, vendor y documentos generados.
8. Refactors DRY que crean abstracciones prematuras o rompen canvas/snapshot.
9. Ausencia de hooks y scripts que hagan cumplir la arquitectura.

## 3. Principios de diseño

### 3.1 Fuente única por responsabilidad

- Reglas globales: `AGENTS.md`.
- Reglas locales: `AGENTS.md` por ruta.
- Procedimientos: skills.
- Tarea actual: task-card.
- Estado durable: memoria versionada.
- Estado de sprint: documentos Scrum.
- Comandos y gates: `package.json` + `.ai/QUALITY-GATES.md`.
- Evidencia histórica: reportes inmutables, no reglas activas.

### 3.2 Progressive disclosure

El agente inicia con menos de diez archivos cortos. Solo carga el playbook, skill o referencia que active la tarea. Los documentos extensos se dividen por dominio y se enlazan; no se copian en prompts.

### 3.3 Un escritor, varios lectores

El agente principal es propietario del parche. Los subagentes pueden mapear código, analizar jscpd, verificar documentación o revisar el diff. Dos agentes no editan el mismo árbol; el paralelismo de implementación exige worktrees y task-cards independientes.

### 3.4 Evidencia antes que abstracción

Un clon no se elimina automáticamente. Primero se clasifica como coincidencia incidental, repetición legítima, vendor, generado o deuda propia. Una abstracción se acepta cuando reduce puntos de cambio y conserva nombres del dominio.

### 3.5 Modelo mínimo suficiente

- Luna/low: clasificación, inventario, resúmenes, actualización mecánica de memoria.
- Terra/low-medium: exploración, refactors claros, pruebas y mantenimiento diario.
- Sol/medium-high: arquitectura, bugs ambiguos, cambios transversales, revisión de alto riesgo.
- xhigh/max/Ultra: excepción documentada para problemas de máxima complejidad o paralelismo independiente.

La disponibilidad real puede variar; el router incluye fallbacks y nunca bloquea una tarea por un nombre de modelo.

## 4. Arquitectura V5

```text
.
├── AGENTS.md
├── CLAUDE.md
├── PROMPT_MAESTRO_CODEX_SISAD_PDFME.md
├── PLAN_MAESTRO_ARQUITECTURA_IA_SISAD_PDFME_V5.md
├── .ai/
│   ├── START.md
│   ├── MODEL-ROUTER.md
│   ├── CONTEXT-POLICY.md
│   ├── ORCHESTRATION.md
│   ├── DUPLICATION-POLICY.md
│   ├── QUALITY-GATES.md
│   ├── SECURITY.md
│   ├── OWNER-MAP.md
│   ├── memory/
│   ├── scrum/
│   ├── routes/
│   ├── patterns/
│   └── prompts/
├── .agents/skills/
├── .codex/
├── .claude/
├── .github/
├── configs/
├── research/
├── tools/ai-quality/
└── src/sisad-pdfme/**/AGENTS.md
```

## 5. Política de modelos y consumo

### 5.1 Score de complejidad

Calcula un puntaje de 0 a 10:

- +2 si el comportamiento es ambiguo o no reproducido.
- +2 si cruza tres o más dominios.
- +2 si toca canvas, snapshot, generator o contratos públicos.
- +1 si hay migración de datos.
- +1 si requiere investigación versionada.
- +1 si el diff esperado supera cinco archivos.
- +1 si no existen pruebas de caracterización.

Ruteo inicial:

- 0–2: Luna low o Terra low.
- 3–5: Terra medium.
- 6–8: Sol medium/high.
- 9–10: Sol high/xhigh; Max solo con justificación.

Reduce el nivel cuando el problema ya esté diagnosticado. No mantengas Sol/high para tareas mecánicas posteriores.

### 5.2 Presupuesto de contexto

- Base inicial: AGENTS + START + task-card + regla local.
- Máximo recomendado antes de implementar: 8 archivos o 40.000 tokens de fuente.
- Salidas crudas grandes se guardan en reportes y se resumen en 20–40 líneas.
- No pegues jscpd completo en el hilo principal: usa el parser incluido.
- No cargues documentación generada ni backups.

## 6. Sistema anti-duplicidad

### 6.1 Tres perfiles

**Owned strict**

Analiza `src`, `server` y `scripts`, excluyendo vendor, backups, fixtures generados y consolidaciones. Es el gate que puede fallar CI.

**Vendor audit**

Mide `src/sisad-pdfme/pdf-lib` para conocer riesgo, pero no convierte clones upstream en deuda automática. Cualquier refactor requiere sincronización con upstream y pruebas de compatibilidad PDF.

**Docs active**

Analiza documentación canónica y arquitectura IA. Excluye reportes históricos y documentos consolidados. Detecta párrafos repetidos y enlaces rotos.

### 6.2 Taxonomía

- textual;
- algorítmica;
- de estado;
- de contrato/tipo;
- de mapping;
- de UI/chrome;
- de interacción;
- de CSS/token;
- de pruebas/fixtures;
- de documentación/prompt;
- de memoria/backlog;
- de infraestructura/configuración.

Cada categoría tiene patrón preferente y señales de sobre-abstracción en `.ai/patterns/`.

### 6.3 Backlog actual

La V5 crea task-cards específicas para smart placement, keyboard shortcuts, overlays, RightSidebar, selection commands, clipboard, acciones, taxonomía del inspector, modal de custom fields y documentación consolidada. El orden prioriza impacto y riesgo, no cantidad de líneas.

## 7. Orquestación de agentes

### 7.1 Roles

- Explorer: solo lectura, mapea ejecución y símbolos.
- Dedup analyst: clasifica clones y sugiere fuente canónica.
- Implementer: único escritor.
- Reviewer: revisa regresiones, contratos y pruebas.
- QA: ejecuta gates y reproduce UI.
- Docs researcher: verifica APIs primarias.

### 7.2 Reglas

- WIP total máximo: 3 task-cards.
- Hilos auxiliares máximos por tarea: 2 por defecto.
- El padre espera resultados y sintetiza; no copia logs completos.
- Los agentes de lectura no cambian archivos.
- Los agentes de escritura reciben worktree separado.
- No se hace cherry-pick automático sin revisión y gates.

## 8. Memoria

### 8.1 Capas

- `PROJECT.md`: hechos estables y mapa del sistema.
- `CURRENT.md`: estado estable de la fase actual.
- `DECISIONS.md`: ADRs compactos.
- `RISKS.md`: riesgos con propietario y señal.
- `METRICS.md`: tendencias, no dumps.
- `HANDOFF.md`: punto exacto de continuación.

### 8.2 Escritura por delta

Al cerrar una tarea, el agente produce un bloque `MEMORY-DELTA`: añadir, modificar, resolver, no cambiar. El memory steward integra solo información durable. Esto evita que todos los agentes reescriban la memoria completa.

## 9. Scrum adaptado a agentes

Scrum se usa como estructura mínima, no como burocracia:

- Product Goal: calidad y portabilidad del diseñador.
- Product Backlog: problemas verificables ordenados.
- Sprint Goal: un resultado coherente medible.
- Board: Ready, In Progress, Review, Blocked, Done.
- Definition of Ready: alcance, evidencia, invariantes y gates.
- Definition of Done: código, pruebas, medición, documentación y memoria.
- Retrospective: máximo cinco acciones; cada acción tiene dueño y fecha.

## 10. Hooks y seguridad

Los hooks incluidos son ejemplos desactivados. Al habilitarlos:

- bloquean comandos destructivos no autorizados;
- alertan al tocar vendor, snapshot, Moveable o Selecto;
- verifican que exista task-card;
- generan sugerencia de memory delta al detenerse;
- nunca envían secretos ni código a servicios externos.

MCP se habilita por servidor, con mínimo privilegio, confirmación para acciones sensibles, timeouts y auditoría de llamadas.

## 11. Roadmap de adopción

### Fase A — instalación y baseline

1. Copiar arquitectura.
2. Validar archivos y skills.
3. Generar baseline owned/vendor/docs.
4. Confirmar comandos reales de lint/build/test.
5. Congelar V4 como archivo histórico.

### Fase B — primera ola de deduplicación

1. DEDUP-001 smartPlacement.
2. DEDUP-002 shortcuts/command registry.
3. DEDUP-003 overlays de comentarios.
4. DEDUP-004 InlineEditOverlay.
5. Medir jscpd owned y tiempo de ciclo.

### Fase C — arquitectura de interacción

1. RightSidebar.
2. selectionCommands.
3. clipboard.
4. inspector taxonomy.
5. pruebas Playwright focales.

### Fase D — documentación y memoria

1. Reemplazar consolidado duplicado por índice + páginas canónicas.
2. Activar checker de párrafos.
3. Aplicar memory delta en cada cierre.
4. Ejecutar retrospectiva de consumo.

### Fase E — automatización segura

1. Probar prompts manualmente.
2. Activar hooks de solo advertencia.
3. Pasar a bloqueo únicamente tras dos sprints sin falsos positivos.
4. Evaluar automatizaciones programadas en worktrees.

## 12. Métricas

- clones propios y líneas duplicadas;
- clones nuevos por PR;
- porcentaje de tareas con pruebas focales;
- lead time de task-card;
- rework y rollbacks;
- fallos de gates tras revisión;
- tokens/hilos por tipo de tarea cuando el proveedor lo permita;
- tamaño del contexto inicial;
- cantidad de archivos abiertos/modificados;
- decisiones reabiertas por falta de memoria.

## 13. Criterios de éxito

- El gate owned no incluye `pdf-lib` ni documentos generados.
- Cada task-card tiene un escritor identificable.
- AGENTS raíz permanece breve y las reglas locales viven cerca del código.
- Ningún prompt maestro duplica playbooks completos.
- Las skills se activan por descripción y no se cargan todas al inicio.
- La memoria puede reconstruir el estado del proyecto sin leer chats anteriores.
- Los clones propios bajan sin aumentar complejidad ciclomática o wrappers triviales.
- Cada refactor sensible conserva pruebas de snapshot, canvas o runtime correspondientes.
