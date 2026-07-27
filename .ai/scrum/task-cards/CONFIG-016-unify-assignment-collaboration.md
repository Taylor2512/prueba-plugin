# CONFIG-016 — Unificar assignment y collaboration

**Estado:** backlog  
**Owner:** runtime-architect  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-009, CONFIG-010

## Objetivo observable

Centralizar recipients, activeRecipient, permissions, ownership y reasignación single/bulk.

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

- src/sisad-pdfme/react/useSisadPdfmeRecipientRuntime.ts
- src/sisad-pdfme/assignments
- src/sisad-pdfme/collaboration
- src/sisad-pdfme/ui/components/Designer/SchemaAssignmentDialog.tsx
- src/sisad-pdfme/config/actionConfigRegistry.ts

## Archivos prohibidos

- No rediseñar modal.
- No cambiar backend/host.
- No modificar snapshot format.
- No cambiar selection policy.

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

RecipientRegistry debe ser la única fuente de recipients y `recipients.activeRecipientId` la ruta canónica.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Eliminar registries paralelos.
- Migrar active recipient.
- Resolver assignment single/bulk.
- Conectar ActionRegistry y modal.
- Preservar locks y owner colors.

## Pasos

1. Auditar recipients duplicados.
2. Migrar activeRecipient legacy.
3. Resolver permission/canEditStructure.
4. Conectar single/bulk action states.
5. Usar RecipientRegistry en dialog.
6. Preservar lock/readOnly/owner metadata.
7. Emitir eventos públicos.

## Comandos/gates

- [ ] `npx vitest run tests/unit/sisad-pdfme/assignments tests/unit/sisad-pdfme/collaboration`
- [ ] `npx playwright test tests/playwright/configuration/assignment.spec.ts`
- [ ] `npm run build`

## Criterios de aceptación

- [ ] Recipients se registran una vez.
- [ ] Reassign visible/executable responde al mismo state.
- [ ] Cambiar active recipient no cambia owner de schemas existentes.
- [ ] Bulk preserva locks según config.
- [ ] Dos Providers no comparten recipients.

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

Volver al adapter legacy de recipients y desactivar integración nueva.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
