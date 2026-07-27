# CONFIG-008 — Crear FeatureRegistry y dependencias

**Estado:** done  
**Owner:** config-specialist  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P0  
**Dependencias:** CONFIG-006, CONFIG-007

## Objetivo observable

Registrar capacidades mediante IDs estables y resolver su estado efectivo con dependencias y razones.

## Evidencia

- Plan canónico: `.ai/plans/PLAN_CONTINUIDAD_CONFIGURACION_UNIFICADA_SISAD_PDFME.md`.
- Auditoría vigente: `reports/configuration/`.
- Estado único: `.ai/scrum/SPRINT-CURRENT.md`.
- Ruta de contexto: `.ai/routes/configuration.md`.
- Estado inicial de la afirmación principal: `HIPÓTESIS` hasta confirmarla mediante código, test o comando.

## Contexto mínimo obligatorio

1. `.ai/START.md`
2. `.ai/routes/configuration.md`
3. `.ai/governance/ANTI-HALLUCINATION.md`
4. `.ai/governance/ANTI-LOOP.md`
5. `.ai/governance/ANTI-OVERFLOW.md`
6. `.agents/skills/sisad-configuration-service/SKILL.md`
7. Esta task-card

No cargar el plan completo si esta tarjeta contiene el alcance necesario.

## Archivos permitidos

> Confirmar las rutas con búsqueda simbólica antes de editar. No es obligatorio abrirlos todos.

- src/sisad-pdfme/config/featureRegistry.ts
- src/sisad-pdfme/config/featureDependencies.ts
- src/sisad-pdfme/config/SisadPdfmeConfigService.ts
- tests/unit/sisad-pdfme/config/featureRegistry.test.ts

## Archivos prohibidos

- No crear acciones todavía.
- No migrar componentes.
- No duplicar permisos de CommandBus.
- No registrar cada widget individual en esta tarea.

Adicionalmente, quedan protegidos salvo autorización explícita de esta task-card:

- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`

## Invariantes

- Una instancia de configuración por `SisadPdfmeProvider`, nunca singleton global.
- Canonical config gana sobre aliases legacy.
- `enabled`, `visible`, `permitted`, `available` y `executable` no son equivalentes.
- Los cambios visuales no deben reconstruir EventHub, RecipientRegistry ni DesignerEngine.
- Dos Providers no comparten recipients, eventos, permisos ni overrides.
- No introducir imports específicos de SISAD-WEB dentro de `src/sisad-pdfme`.
- No afirmar que una prueba pasó si no fue ejecutada.

## Caracterización previa

El plan define los estados registered, supported, enabled, visible, permitted, available, active y executable.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Crear featureRegistry.ts y featureDependencies.ts.
- Registrar runtime, canvas, sidebars, inspector, documents, comments y signatures.
- Resolver dependencias sin if/else masivo.
- Producir reason y sources.

## Pasos

1. Definir FeatureId y FeatureDefinition.
2. Implementar registro inmutable/extensible.
3. Registrar capabilities iniciales del plan.
4. Resolver renderable y executable por separado.
5. Resolver dependencies/conflicts.
6. Agregar reason codes.
7. Probar runtime designer/form/viewer y readonly.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/featureRegistry.test.ts`
- [x] `npm run build`

## Criterios de aceptación

- [x] Toda feature registrada devuelve estado completo.
- [x] Visible no implica executable.
- [x] Enabled=false impide comportamiento.
- [x] Reasons son estables y testeables.
- [x] No hay switch global por feature ID.

## Presupuesto

- Máximo 8 archivos abiertos inicialmente.
- Máximo 5 archivos modificados.
- Máximo 2 rondas de búsqueda.
- Un solo dominio por sesión.
- Máximo 3 intentos de parche sobre la misma causa.
- WIP global máximo 3.

## Condición de parada

- Dos búsquedas consecutivas no agregan evidencia.
- Se requieren más de 5 archivos modificados.
- La causa pertenece a otra task-card.
- Se alcanza el 75% del contexto sin confirmar la causa.
- Aparece una decisión de API/UX/producto que necesita aprobación.
- Un cambio requiere tocar Moveable, Selecto, geometría, snapshot o generator fuera del alcance.

## Rollback

Desconectar registry del service y revertir archivos.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
