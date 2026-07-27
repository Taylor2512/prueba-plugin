# CONFIG-013 — Migrar flags de Canvas

**Estado:** done  
**Owner:** canvas-specialist  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-010

## Objetivo observable

Pasar capacidades resueltas al Canvas y overlays existentes sin reescribir algoritmos de selección, geometría o transformación.

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

- src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx
- src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
- src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
- src/sisad-pdfme/ui/components/Designer/Canvas/overlays
- src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts

## Archivos prohibidos

- No cambiar coordinateMath.
- No reescribir Moveable o Selecto.
- No cambiar x/y/width/height.
- No cambiar drop pipeline.
- No tocar snapshot/generator.

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

El plan requiere flags separados para select, multiSelect, move, resize, rotate, guides, snapLines, contextMenu, floatingToolbar, shortcuts y modal suspension.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Caracterizar comportamiento actual.
- Pasar feature states al Canvas.
- Separar move/resize/rotate.
- Migrar context menu, toolbar y shortcuts.
- Respetar readonly e interacción modal.

## Pasos

1. Agregar characterization tests antes del parche.
2. Resolver capability props en el owner superior.
3. Pasar flags a Moveable/Selecto sin cambiar cálculo.
4. Bloquear transformaciones según access state.
5. Migrar guides/snap/context toolbar/shortcuts.
6. Probar modal open/close.
7. Probar zoom, scroll, selección y readonly.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/public-api.test.ts tests/unit/sisad-pdfme/config/designerUiMap.test.ts tests/unit/sisad-pdfme/config/inspectorConfigurationResolver.test.ts tests/unit/sisad-pdfme/ui/components/Designer/LeftSidebar.test.ts tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.test.ts tests/unit/sisad-pdfme/ui/components/Designer/Canvas/Canvas.test.ts`
- [ ] `npx playwright test tests/playwright/configuration/canvas-flags.spec.ts` (no existe spec en el repo)
- [x] `npm run build`

## Criterios de aceptación

- [x] Moveable disabled no impide inspección si el contrato lo permite.
- [x] Selecto disabled mantiene click simple.
- [x] Readonly selecciona e inspecciona, pero no muta.
- [x] Zoom/scroll/coordenadas no cambian.
- [x] Cambio de flag caliente no pierde selección.

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

Revertir únicamente el paso de flags; conservar tests caracterizadores.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
