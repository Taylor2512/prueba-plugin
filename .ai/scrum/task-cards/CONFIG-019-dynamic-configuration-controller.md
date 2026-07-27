# CONFIG-019 — Implementar configuración dinámica y controller

**Estado:** backlog  
**Owner:** runtime-architect  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-010, CONFIG-011, CONFIG-012, CONFIG-013, CONFIG-014, CONFIG-016, CONFIG-017, CONFIG-018

## Objetivo observable

Exponer lectura, actualización, reset, feature state y explicación con hot update, engine rebuild o runtime remount controlado.

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

- src/sisad-pdfme/react/useSisadPdfmeController.ts
- src/sisad-pdfme/config/configChangeImpact.ts
- src/sisad-pdfme/config/SisadPdfmeConfigService.ts
- src/sisad-pdfme/react/SisadPdfmeProvider.tsx
- tests/integration/sisad-pdfme/config-dynamic.test.tsx

## Archivos prohibidos

- No cambiar engine internals sin evidencia.
- No forzar remount para cambios visuales.
- No aplicar cambios incompatibles durante drag/resize/inline edit.
- No ocultar pérdida de estado.

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

Los cambios dinámicos deben preservar selección, zoom, scroll, página, documento activo y panel cuando siga permitido.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Agregar API pública al controller.
- Conectar configChangeImpact.
- Implementar hot update.
- Implementar rebuild/remount controlado.
- Bloquear o posponer cambios durante interacción activa.

## Pasos

1. Exponer getConfig/updateConfig/resetConfig/getFeatureState/explainConfiguration.
2. Definir change result.
3. Aplicar ui-state sin remount.
4. Actualizar runtimeOptions cuando soporte update.
5. Rebuild engine preservando estado compatible.
6. Remount solo por mode/constructor/plugin incompatibility.
7. Posponer cambios prohibidos durante interacción.
8. Agregar rollback a config previa ante fallo.

## Comandos/gates

- [ ] `npx vitest run tests/integration/sisad-pdfme/config-dynamic.test.tsx`
- [ ] `npx playwright test tests/playwright/configuration/dynamic-config.spec.ts`
- [ ] `npm run build`

## Criterios de aceptación

- [ ] Cambio visibility no remonta.
- [ ] Cambio density preserva selección/zoom.
- [ ] Cambio selecto/moveable usa impacto correcto.
- [ ] Cambio runtime.mode remonta controladamente.
- [ ] Fallo de rebuild restaura config/runtime anterior.
- [ ] Interacción activa devuelve deferred/rejected reason.

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

Restaurar controller anterior y deshabilitar updateConfig público.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
