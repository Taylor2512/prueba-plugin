# CONFIG-009 — Crear ActionConfigRegistry y ComponentRegistry

**Estado:** done  
**Owner:** runtime-architect  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P0  
**Dependencias:** CONFIG-008

## Objetivo observable

Centralizar visible, enabled, executable, reason y commandId para acciones y componentes configurables.

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

- src/sisad-pdfme/config/actionConfigRegistry.ts
- src/sisad-pdfme/config/componentRegistry.ts
- src/sisad-pdfme/config/SisadPdfmeConfigService.ts
- tests/unit/sisad-pdfme/config/actionConfigRegistry.test.ts

## Archivos prohibidos

- No migrar botones.
- No modificar CommandBus.
- No crear dialogs.
- No cambiar behavior de acciones existentes.

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

Reassign, delete, duplicate, copy, paste, lock, hide, align y otras acciones no deben recomponer permisos en cada botón.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Crear actionConfigRegistry.ts.
- Crear componentRegistry.ts.
- Integrar feature/access/context dependencies.
- Definir state shape compartido.
- Conectar commandId sin ejecutar comandos.

## Pasos

1. Inventariar acciones actuales desde CONFIG-002.
2. Registrar IDs canónicos.
3. Resolver single/bulk selection.
4. Resolver readOnly, locks, canEditStructure y recipients.
5. Registrar componentes de sidebars/panels/collapse.
6. Agregar reasons y sources.
7. Probar reassign/delete/duplicate/hide.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/actionConfigRegistry.test.ts`
- [x] `npm run build`

## Criterios de aceptación

- [x] Cada acción tiene visible/enabled/executable/reason/commandId.
- [x] Reassign usa una sola fórmula.
- [x] Component visible y feature enabled son conceptos separados.
- [x] No se ejecuta CommandBus durante resolución.

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

Desconectar registries y revertir archivos.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
