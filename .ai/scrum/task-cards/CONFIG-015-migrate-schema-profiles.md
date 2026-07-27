# CONFIG-015 — Migrar perfiles de schemas

**Estado:** done  
**Owner:** schema-specialist  
**Modelo sugerido:** Sol high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-008, CONFIG-014

## Objetivo observable

Crear perfiles por familia para catalog, canvas, inspector, runtime, capabilities y configuración.

## Evidencia

- Plan canónico: `.ai/plans/PLAN_CONTINUIDAD_CONFIGURACION_UNIFICADA_SISAD_PDFME.md`.
- Auditoría vigente: `reports/configuration/`.
- Estado único: `.ai/scrum/SPRINT-CURRENT.md`.
- Ruta de contexto: `.ai/routes/configuration.md`.
- Estado inicial de la afirmación principal: confirmada por código, test y build.

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

- src/sisad-pdfme/config/schemaConfigurationProfile.ts
- src/sisad-pdfme/config/schemaCapabilityResolver.ts
- src/sisad-pdfme/schemas/schemaFamilies.ts
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
- tests/unit/sisad-pdfme/config/schemaProfiles.test.ts

## Archivos prohibidos

- No reescribir renderers.
- No cambiar valores persistidos.
- No eliminar propPanels legacy en una sola pasada.
- No modificar generator.

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

El plan define familias text-like, option-based, signing-based, action-based, media, barcodes, tables, shapes y custom.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Crear SchemaConfigurationProfile.
- Crear SchemaCapabilityResolver.
- Migrar una familia piloto.
- Extender por familia con pruebas.
- Preservar plugins custom.

## Pasos

1. Definir contrato de perfil.
2. Mapear familia piloto text-like.
3. Mapear option-based.
4. Mapear signing/action/media/barcodes/tables/shapes.
5. Agregar fallback custom.
6. Resolver catalog/canvas/inspector/runtime por separado.
7. Probar snapshots existentes como smoke.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/schemaProfiles.test.ts`
- [x] `npx vitest run tests/unit/sisad-pdfme/schemas`
- [x] `npm run build`

## Criterios de aceptación

- [x] Ocultar del catálogo no oculta del runtime.
- [x] Un schema existente no desaparece por enabledTypes salvo política explícita.
- [x] Cada familia comparte reglas sin switch disperso.
- [x] Custom plugins tienen fallback estable.

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

Desactivar perfiles y conservar bridge legacy.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
