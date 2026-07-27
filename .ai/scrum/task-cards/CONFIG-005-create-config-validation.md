# CONFIG-005 — Crear validación de configuración

**Estado:** done  
**Owner:** config-specialist  
**Modelo sugerido:** Terra medium  
**Worktree/rama:** pendiente  
**Prioridad:** P0  
**Dependencias:** CONFIG-003, CONFIG-004

## Objetivo observable

Detectar configuraciones inválidas, incompatibles o incompletas antes de crear runtimeOptions, engine o providers.

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

- src/sisad-pdfme/config/configValidation.ts
- src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts
- src/sisad-pdfme/config/index.ts
- tests/unit/sisad-pdfme/config/configValidation.test.ts

## Archivos prohibidos

- No corregir automáticamente valores ambiguos.
- No validar lógica específica del host.
- No montar runtime.
- No crear UI de diagnóstico.

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

El plan enumera combinaciones como provider signature sin providers, autosave sin persistencia y cambios incompatibles durante interacción.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Crear `configValidation.ts`.
- Separar errors y warnings.
- Validar dependencias entre secciones.
- Retornar paths y mensajes estables.
- Evitar throw para warnings recuperables.

## Pasos

1. Definir `SisadPdfmeConfigIssue`.
2. Validar signatures provider/defaultMode.
3. Validar persistence/autosave/adapter mode.
4. Validar panel default incluido y visible.
5. Validar runtime mode y capabilities.
6. Validar plugin IDs duplicados.
7. Validar configuración single/multi documents.
8. Agregar mensajes con source paths.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/configValidation.test.ts`
- [x] `npm run build`

## Criterios de aceptación

- [x] Errores críticos se distinguen de warnings.
- [x] Cada issue tiene code, path, message y severity.
- [x] Config válida no produce issues.
- [x] El validador no muta ni crea recursos.

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

Desconectar la validación del resolver y revertir archivos nuevos.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
