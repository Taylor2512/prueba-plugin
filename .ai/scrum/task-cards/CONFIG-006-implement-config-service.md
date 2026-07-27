# CONFIG-006 — Implementar SisadPdfmeConfigService

**Estado:** done  
**Owner:** runtime-architect  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P0  
**Dependencias:** CONFIG-004, CONFIG-005

## Objetivo observable

Crear una fachada única por Provider que conserve configuración raw/resuelta, overrides, subscriptions y transacciones.

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

- src/sisad-pdfme/config/SisadPdfmeConfigService.ts
- src/sisad-pdfme/config/configChangeImpact.ts
- src/sisad-pdfme/config/index.ts
- tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts

## Archivos prohibidos

- No integrar React todavía.
- No crear registries de features.
- No migrar UI.
- No reconstruir engine automáticamente sin clasificador.

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

El servicio debe ser una fachada, no un singleton global ni un God Object.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Implementar getRawConfig/getResolvedConfig.
- Implementar replace/update/reset y overrides.
- Implementar subscribe/unsubscribe.
- Implementar transaction.
- Conservar snapshots inmutables.
- Delegar migración, validación y resolución.

## Pasos

1. Definir interfaces públicas.
2. Implementar creación por factory o constructor controlado.
3. Almacenar raw canonical + runtime overrides.
4. Resolver de forma lazy/memoizada cuando sea seguro.
5. Implementar listeners sin leaks.
6. Agrupar cambios en transaction.
7. Retornar change result.
8. Agregar `explain` básico con sources.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts`
- [x] `npm run build`
- [x] `npm run quality:duplicate-functions`

## Criterios de aceptación

- [x] No existe singleton global.
- [x] Dos instancias no comparten estado.
- [x] Una transaction notifica una sola vez.
- [x] Un listener eliminado no vuelve a ejecutarse.
- [x] La entrada y snapshots no se mutan.
- [x] El servicio no recrea recursos por sí mismo.

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

Revertir service, barrel y tests; no hay datos persistidos.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
