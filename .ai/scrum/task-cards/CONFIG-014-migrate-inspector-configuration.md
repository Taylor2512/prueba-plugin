# CONFIG-014 — Migrar Inspector

**Estado:** done  
**Owner:** schema-specialist  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-009, CONFIG-010

## Objetivo observable

Migrar secciones, campos, advanced, technical, collaboration y comments al estado efectivo del servicio.

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

- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
- src/sisad-pdfme/config/InspectorConfigurationResolver.ts

## Archivos prohibidos

- No migrar aún perfiles completos de familias.
- No reescribir widgets funcionales.
- No cambiar schema values.
- No tocar snapshot.

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

Visibilidad no debe determinar editabilidad; los widgets deben distinguir visible, readonly, disabled y unsupported.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Crear InspectorConfigurationResolver.
- Migrar secciones y fields.
- Integrar action/access states.
- Conservar detailSchemas como bridge.
- Probar selection única/múltiple y narrow layout.

## Pasos

1. Definir resolver de inspector.
2. Resolver inspector.visible.
3. Resolver section/field global.
4. Resolver disabled reason por access.
5. Migrar advanced/technical/collaboration/comments.
6. Conservar bridge para plugin propPanel.
7. Agregar tests de property paths y visibilidad.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/public-api.test.ts tests/unit/sisad-pdfme/config/designerUiMap.test.ts tests/unit/sisad-pdfme/config/inspectorConfigurationResolver.test.ts tests/unit/sisad-pdfme/ui/components/Designer/LeftSidebar.test.ts tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.test.ts tests/unit/sisad-pdfme/ui/components/Designer/Canvas/Canvas.test.ts`
- [ ] `npx playwright test tests/playwright/configuration/inspector.spec.ts` (no existe spec en el repo)
- [x] `npm run build`

## Criterios de aceptación

- [x] Campo visible no implica editable.
- [x] Technical solo aparece cuando config lo permite.
- [x] Readonly muestra razón.
- [x] Mixed selection no expone controles inválidos.
- [x] No hay control visible sin read/write o estado informativo explícito.

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

Desconectar resolver y volver a detailSchemas bridge.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
