# CONFIG-011 — Migrar RightSidebar y ListView

**Estado:** done  
**Owner:** implementer  
**Modelo sugerido:** Terra high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-010

## Objetivo observable

Migrar acciones, panels, toolbar, filas y collapse del RightSidebar al ConfigService sin alterar DnD ni selección.

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

- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx
- src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts

## Archivos prohibidos

- No reescribir DnD.
- No cambiar reorder filtrado.
- No modificar Moveable/Selecto.
- No rediseñar visualmente salvo lo necesario para disabled reason.

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

RightSidebar, ListViewToolbar y DetailView actualmente combinan visibility, assignment, collaboration y contexto local.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Migrar acciones del RightSidebar.
- Migrar ListViewToolbar.
- Migrar DetailView actions.
- Migrar panel visibility y collapse.
- Conservar designerUiConfig como adapter temporal.

## Pasos

1. Mapear cada acción al ActionRegistry.
2. Reemplazar lecturas directas por hooks.
3. Mostrar disabled reason donde corresponda.
4. Migrar panels fields/detail/comments/documents.
5. Migrar collapse handle.
6. Mantener adapter legacy para OptionsContext.
7. Agregar tests de density, selection y panel combinations.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/public-api.test.ts tests/unit/sisad-pdfme/config/designerUiMap.test.ts tests/unit/sisad-pdfme/config/inspectorConfigurationResolver.test.ts tests/unit/sisad-pdfme/ui/components/Designer/LeftSidebar.test.ts tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.test.ts tests/unit/sisad-pdfme/ui/components/Designer/Canvas/Canvas.test.ts`
- [ ] `npx playwright test tests/playwright/configuration/right-sidebar.spec.ts` (no existe spec en el repo)
- [x] `npm run build`

## Criterios de aceptación

- [x] Reassign/delete/duplicate usan ActionState.
- [x] Solo se montan panels enabled.
- [x] Ocultar panel no cambia routing ni selección.
- [x] Reorder filtrado sigue preservando hidden items.
- [x] No se pierde scroll al cambiar flags calientes.

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

Revertir consumidores a adapter legacy; registries permanecen.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
