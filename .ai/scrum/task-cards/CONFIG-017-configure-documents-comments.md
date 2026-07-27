# CONFIG-017 — Configurar documentos y comentarios

**Estado:** backlog  
**Owner:** runtime-architect  
**Modelo sugerido:** Terra high  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-008, CONFIG-010, CONFIG-011

## Objetivo observable

Resolver enabled, visible, available y routing para documentos y comentarios sin acoplar paneles a persistencia.

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

- src/sisad-pdfme/documents
- src/sisad-pdfme/comments
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
- src/sisad-pdfme/config/featureRegistry.ts

## Archivos prohibidos

- No cambiar snapshot schema.
- No reescribir document routing.
- No rediseñar rails.
- No cambiar comment data model.

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

Ocultar un panel no debe cambiar routing ni desactivar capacidades programáticas.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Configurar documents single/multi.
- Configurar panel y activeDocumentStrategy.
- Agregar contrato comments.enabled y capabilities.
- Migrar panels/modals/overlays.
- Probar host/internal strategy.

## Pasos

1. Definir comments config pública.
2. Registrar document/comment features.
3. Migrar DocumentsRail/CommentsRail.
4. Separar panel visible de capability enabled.
5. Resolver strategy host/internal.
6. Probar single/multi y panel hidden.
7. Probar comments por API sin panel.

## Comandos/gates

- [ ] `npx vitest run tests/unit/sisad-pdfme/documents tests/unit/sisad-pdfme/comments`
- [ ] `npx playwright test tests/playwright/configuration/documents-comments.spec.ts`
- [ ] `npm run build`

## Criterios de aceptación

- [ ] Panel oculto no altera documentId/page.
- [ ] mode=single no obliga a montar DocumentsRail.
- [ ] comments.enabled=false no registra overlays/comandos.
- [ ] comments enabled + panel hidden sigue disponible por API si está permitido.

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

Revertir consumers y feature registrations.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
