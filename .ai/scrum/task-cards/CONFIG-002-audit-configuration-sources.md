# CONFIG-002 — Auditar fuentes y lectores de configuración

**Estado:** ready  
**Owner:** config-specialist  
**Modelo sugerido:** Terra medium  
**Worktree/rama:** pendiente  
**Prioridad:** P0  
**Dependencias:** ninguna

## Objetivo observable

Construir un mapa verificable de todas las fuentes, aliases, lectores y comportamientos configurables antes de modificar código.

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

- src/sisad-pdfme/config/SisadPdfmeConfig.ts
- src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts
- src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts
- src/sisad-pdfme/config/createSisadPdfmeConfig.ts
- src/sisad-pdfme/config/index.ts
- src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts
- src/sisad-pdfme/ui/components/Designer/shared/visibilityConfig.ts
- src/sisad-pdfme/react/SisadPdfmeProvider.tsx

## Archivos prohibidos

- No modificar comportamiento.
- No crear ConfigService.
- No migrar componentes.
- No corregir CSS o UX.

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

El plan identifica rutas duplicadas entre `visibility` y `ui.visibility`, `sidebars` y `ui.sidebars`, `theme.density` y `ui.density`, además de lecturas paralelas desde `OptionsContext`, `designerUiConfig` y componentes.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Inventariar fuentes de configuración raíz, defaults, resolver, runtimeOptions y contexts.
- Mapear componente/acción → ruta actual de configuración.
- Detectar lecturas directas de visibility, assignment, sidebars, canvas, schemas y collaboration.
- Identificar dónde se crean DesignerEngine, EventHub, adapters y RecipientRegistry.
- Clasificar cada lector como canonical, legacy, bridge o incorrecto.

## Pasos

1. Crear `reports/configuration/`.
2. Ejecutar las búsquedas `rg` definidas en el plan.
3. Consolidar resultados por ruta de configuración.
4. Registrar conflictos de precedencia.
5. Registrar recursos recreados por resolución.
6. Crear matriz de comportamiento actual.
7. Capturar baseline visual/funcional de escenarios críticos.

## Comandos/gates

- [ ] `git diff --check`
- [ ] Verificación manual de que solo se agregaron reportes.
- [ ] Revisión cruzada del Config Architect.

## Criterios de aceptación

- [ ] Existe un mapa completo componente/acción → configuración.
- [ ] Cada alias duplicado tiene propuesta canónica.
- [ ] Se identifican readers directos que deberán migrarse.
- [ ] Se documenta qué recursos se recrean actualmente.
- [ ] No cambia ningún archivo funcional.

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

Eliminar únicamente los reportes creados; no existe rollback funcional.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
