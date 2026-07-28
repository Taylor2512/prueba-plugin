# CONFIG-018 — Configurar firmas y providers

**Estado:** done
**Owner:** schema-specialist  
**Modelo sugerido:** Terra high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-008, CONFIG-015

## Objetivo observable

Resolver modos draw/image/p12/provider, capabilities y providers externos mediante configuración genérica.

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

- src/sisad-pdfme/config/featureRegistry.ts
- src/sisad-pdfme/schemas/signature
- src/sisad-pdfme/adapters/signatureProviderAdapter.ts
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView
- tests/unit/sisad-pdfme/config/signatures.test.ts

## Archivos prohibidos

- No implementar proveedor real.
- No cambiar API backend.
- No cambiar generator global.
- No guardar secretos en config.

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

El core no debe incorporar reglas de Uanataca u otro proveedor específico.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Registrar signature features.
- Validar defaultMode/providers.
- Resolver capabilities por runtime.
- Migrar schemas signing-based y DetailView.
- Probar Designer/Form/Viewer.

## Pasos

1. Definir capabilities por modo.
2. Resolver provider requirements.
3. Migrar inspector visibility por mode.
4. Ocultar provider config en modos no provider.
5. Probar invalid config reason.
6. Probar renderer por runtime.
7. Verificar snapshot smoke.

## Comandos/gates

- [x] `npx vitest run tests/unit/sisad-pdfme/config/signatures.test.ts tests/unit/sisad-pdfme/schemas/signature`
- [x] `npm run build`

## Criterios de aceptación

- [x] enabled=false no registra interacción de firma configurable.
- [x] defaultMode=provider sin providers produce error/reason.
- [x] Designer muestra placeholder.
- [x] Form ejecuta capability permitida.
- [x] Viewer no permite interacción.

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

Desconectar profile/feature config y volver a behavior legacy.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
