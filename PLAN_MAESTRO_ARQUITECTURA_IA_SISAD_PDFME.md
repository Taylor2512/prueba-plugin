# Plan maestro — Arquitectura de asistentes IA optimizada para SISAD PDFME

Fecha: 2026-07-22  
Versión: 4.0

## 1. Resumen ejecutivo

La arquitectura anterior ya contenía routers, contextos, task-cards y agentes, pero había crecimiento documental y riesgo de que Codex, Claude y Copilot leyeran reglas repetidas. El nuevo diseño establece `.ai/` como única fuente de verdad, usa skills con carga progresiva, task-cards pequeñas, routing por costo/riesgo, Scrum con WIP y memoria por delta.

El reporte DRY demuestra que el código propio pasó de 71 bloques repetidos y 1.134 líneas significativas a 2 bloques y 20 líneas. El siguiente riesgo no es solo jscpd: es reintroducir duplicidad de comportamiento, estado, contratos, UI, CSS, pruebas, documentación, prompts, memoria y tareas.

## 2. Objetivos medibles

- Mantener clones de lógica propia en 0; coincidencias no funcionales documentadas.
- Reducir Markdown activo y evitar párrafos canónicos duplicados.
- Mantener catálogo de skills ≤12 y descripciones cortas.
- Usar Luna en ≥50 % de tareas mecánicas; Terra como default de implementación; Sol solo por riesgo/ambigüedad.
- WIP máximo 3 y un worktree por agente write.
- 100 % de tasks con DoR, DoD, modelo, gates y evidencia.
- 100 % de cambios durables reflejados por delta en memoria.

## 3. Principios

1. Una fuente de verdad por concepto.
2. Progressive disclosure: metadata primero, contenido especializado solo cuando aplica.
3. Search-first y evidencia antes de abstracción.
4. Menor modelo/esfuerzo que pase gates.
5. Subagentes solo para trabajo independiente y ruidoso.
6. Separar explorar, decidir, implementar y revisar.
7. Patrón mínimo correcto; React favorece composición, funciones puras y hooks reales.
8. No mezclar refactor funcional con migración documental.

## 4. Investigación de modelos Codex

### GPT-5.6 Sol

Úsalo para arquitectura, refactors transversales, bugs ambiguos, seguridad y review final. Medium es el default razonable; high/xhigh únicamente cuando la tarea requiere tradeoffs profundos.

### GPT-5.6 Terra

Workhorse diario: implementación, debugging, integración, pruebas y revisión. Medium para tareas M; low para cambios claros.

### GPT-5.6 Luna

Auditorías repetitivas, clasificación de clones, extracción de símbolos, actualización de task-cards y memoria, reportes estructurados y codemods claramente definidos.

### GPT-5.5

Fallback de generación anterior; no debe ser el default de una arquitectura nueva.

### GPT-5.3 Codex Spark

Preview text-only para iteración casi instantánea, disponible a Pro. Útil para cambios pequeños e interacción; no para decisiones finales de alto riesgo.

### Compatibilidad 5.4/5.4 mini

Si siguen visibles, 5.4 puede cubrir implementación general y 5.4 mini exploración/subagentes. El routing primario debe usar 5.6.

## 5. Arquitectura objetivo

```text
AGENTS.md / CLAUDE.md / Copilot adapter
                 │
                 ▼
             .ai/START.md
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 Model Router  Scrum      Domain Router
      │          │          │
      └──── task-card ──────┘
                 │
                 ▼
       Agent + selected skills
                 │
          Worktree / read-only
                 │
                 ▼
      Gates → Review → Memory delta
```

## 6. Estrategia anti-duplicidad integral

- Textual: helper/factory.
- Estructural: Strategy/Factory.
- Mapping: Adapter.
- Extensibilidad: Registry.
- UI: composición/compound.
- React logic: custom hook con estado/efectos reales.
- Estado: Reducer/State Machine y selectores canónicos.
- Acciones: Command.
- Orquestación: Facade/use case.
- CSS: tokens y variantes.
- Pruebas: fixtures/builders compartidos.
- Docs/prompts: canónico + enlaces.
- Memoria/scrum: propietario único del dato.

## 7. Fases de implementación

### Fase 0 — Backup y baseline

- Crear rama `ai/architecture-v4`.
- Capturar hashes e inventario Markdown.
- Guardar jscpd, knip, lint, build y tests actuales.
- No modificar código productivo.

### Fase 1 — Instalar núcleo canónico

- Copiar `AGENTS.md`, `CLAUDE.md`, `.ai/` y adapters.
- Verificar que `AGENTS.md` siga corto.
- Confirmar rutas y enlaces.

### Fase 2 — Inventariar y deduplicar documentación existente

- Comparar la estructura actual con `.ai/` nueva.
- Clasificar: conservar, fusionar, adapter, histórico, eliminar.
- Migrar contenido durable al owner canónico.
- Sustituir copias por enlaces.
- No borrar historia necesaria; moverla fuera del contexto activo.

### Fase 3 — Activar skills

- Instalar las skills canónicas en `.agents/skills/`.
- Validar triggers positivos/negativos.
- Evitar copias manuales por proveedor.
- Mantener catálogo pequeño y fusionar solapamientos.

### Fase 4 — Configurar agentes y modelos

- Architect: Sol high, read-only.
- DRY Explorer: Luna low, read-only.
- Implementer: Terra medium, write.
- QA: Terra/Sol read-only.
- Memory/Scrum: Luna low, escribe solo `.ai/`.
- Crear TOML de Codex desde la plantilla y perfiles Copilot `.agent.md`.

### Fase 5 — Adoptar Scrum ligero

- Migrar backlog activo.
- Definir sprint, WIP, owner y worktree.
- Task-cards con DoR/DoD.
- Prohibir dos agentes write sobre los mismos archivos.

### Fase 6 — Integrar gates de calidad

- Mantener jscpd sobre código propio.
- Separar gate documental.
- Verificar dead code antes de eliminar.
- Añadir review independiente en tareas L.
- Guardar evidencia por task.

### Fase 7 — Memoria y handoff

- Consolidar estado durable.
- Activar memoria local Codex solo como complemento.
- Actualizar por delta después de cada task.
- Revisar y limpiar memoria al cierre de sprint.

### Fase 8 — Automatización controlada

- Auditoría semanal de duplicidad y documentación drift con Luna low.
- Trabajo programado en worktree, nunca directamente sobre cambios locales.
- Automations devuelven reporte; no hacen refactors masivos sin review.

### Fase 9 — Evaluación

- Comparar tareas reales con/sin skill.
- Medir tokens/créditos, tiempo, fallos y retrabajo.
- Retirar agentes o skills que no mejoren calidad.
- Actualizar routing según disponibilidad oficial.

## 8. Plan de migración de archivos existentes

| Actual | Acción |
|---|---|
| prompts maestros extensos | convertir en task-card + ruta + skill |
| múltiples contextos genéricos | fusionar por dominio y reducir preguntas repetidas |
| agentes con reglas repetidas | agente corto que enlaza governance y skill |
| memoria y current-state duplicados | consolidar en cinco archivos de memory |
| docs históricos | mover a archivo/ fuera del contexto activo |
| skills duplicadas en `.claude`, `.agents`, `.windsurf` | canonizar `.agents/skills`; generar adapters/espejos |

## 9. Gates de aceptación

- Todos los links Markdown resuelven.
- No hay párrafos largos idénticos entre archivos activos, salvo templates deliberados.
- Los adapters de proveedor no superan 30 líneas.
- Cada task activa tiene modelo, owner, worktree y gates.
- Skills disparan correctamente en pruebas positivas/negativas.
- `npm run quality` no empeora por la instalación documental.
- Un agente nuevo puede iniciar leyendo solo `AGENTS.md` + `START.md` + task-card.

## 10. Riesgos

- Over-engineering: mitigar con task sizes y patrón mínimo.
- Skills excesivas: límite de catálogo y evaluación.
- Memoria obsoleta: delta y limpieza de sprint.
- Paralelismo caro: subagentes solo si independientes.
- Falsos positivos Knip: verificación de entrypoints y registries.
- Vendor drift: fuente canónica neutral y adapters delgados.

## 11. Fuentes oficiales

- OpenAI Codex models: https://developers.openai.com/codex/models
- Codex skills: https://developers.openai.com/codex/build-skills
- Codex subagents: https://developers.openai.com/codex/subagents
- AGENTS.md: https://developers.openai.com/codex/agent-configuration/agents-md
- Codex best practices: https://developers.openai.com/codex/learn/best-practices
- Worktrees: https://developers.openai.com/codex/environments/git-worktrees
- Memories: https://developers.openai.com/codex/memories
- Automations: https://developers.openai.com/codex/automations
- Open Agent Skills: https://agentskills.io/
- OpenAI skills catalog: https://github.com/openai/skills
- GitHub Copilot agent skills: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
