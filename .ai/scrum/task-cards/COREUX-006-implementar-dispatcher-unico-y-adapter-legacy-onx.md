# COREUX-006 — Implementar dispatcher único y adapter legacy onX

**Estado:** done  
**Wave:** W1  
**Prioridad:** P0  
**Riesgo:** Muy alto  
**Owner sugerido:** runtime-architect  
**Modelo sugerido:** Sol high  
**Dependencias:** COREUX-005  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Conectar event hub, `config.events` y props públicos sin doble emisión.

## Casos de uso

Dominios: EVT, RUN.

EVT-001, EVT-002, EVT-003, EVT-004, EVT-005, EVT-006, EVT-007, EVT-008, EVT-009, EVT-010, EVT-011, EVT-012, EVT-013, EVT-014, EVT-015, RUN-001, RUN-002, RUN-003, RUN-004, RUN-005, RUN-006, RUN-007, RUN-008, RUN-009, RUN-010, RUN-011, RUN-012, RUN-013, RUN-014, RUN-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Mediator, Observer adapter

## Lectura mínima

1. `.ai/START.md`
2. `.ai/routes/designer-core-ux.md`
3. `.ai/architecture/EVENT-COMMAND-EFFECT-ARCHITECTURE.md`
4. `.ai/architecture/DESIGNER-SURFACE-ARCHITECTURE.md`
5. `.ai/governance/ANTI-HALLUCINATION.md`
6. `.ai/governance/ANTI-LOOP.md`
7. `.ai/governance/ANTI-OVERFLOW.md`
8. Esta task-card

## Archivos candidatos

- `src/sisad-pdfme/runtime/instanceEventDispatcher.ts`
- `src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts`
- `src/sisad-pdfme/react/SisadPdfmeDesigner.tsx`
- `src/sisad-pdfme/react/SisadPdfmePreviewRuntime.tsx`
- `tests/unit/sisad-pdfme/events/**`

Confirmar rutas antes de editar. No crear un archivo nuevo si la responsabilidad
ya existe bajo otro nombre.

## Archivos protegidos por defecto

- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`
- `.tailwind-migration-backups/**`

Solo se permite tocar un archivo protegido cuando aparece explícitamente en
Archivos candidatos y existe prueba focal roja.

## Invariantes

- Solo código productivo bajo `src/sisad-pdfme/**`.
- TypeScript/TSX.
- Cero imports hacia examples/features/modules.
- No segundo registry, event bus, snapshot o renderer.
- No `setTimeout` de coordinación.
- No z-index arbitrario.
- Tailwind-first; `tokens.css` solo para variables técnicas.
- Un writer; máximo dos readers read-only.
- No afirmar gates no ejecutados.

## Caracterización previa

1. `pwd`
2. `git branch --show-current`
3. `git status --short`
4. registrar commit base;
5. abrir máximo 8 archivos;
6. máximo 2 búsquedas amplias;
7. escribir hipótesis y test focal;
8. registrar claim.

## Pasos

1. Crear dispatcher con listeners actuales.
2. Registrar adapter legacy.
3. Definir mapping de eventos a onX.
4. Capturar errores de listeners como diagnostics.
5. Evitar closures obsoletos.

## Criterios de aceptación

- [x] Cada evento llega una vez (Set de listeners; probado con doble registro).
- [x] `config.events=false` desactiva el callback legacy, no el evento interno.
- [x] Un listener fallido no bloquea los demás (diagnostics, sin throw).

Entrega: `src/sisad-pdfme/runtime/instanceEventDispatcher.ts` + cableado en
`react/SisadPdfmeDesigner.tsx`. 13/13 en
`tests/unit/sisad-pdfme/events/instanceEventDispatcher.test.ts`.

Incluye la corrección de COREUX-004: se inyecta `configService` en el
`controllerContext`; antes el controller operaba sobre una config VACÍA.
Verificado: `explainConfiguration` pasó de «0 migraciones» a «1 migración».

HANDOFF a COREUX-007 — cablear el hub quedó BLOQUEADO. `Designer/index.tsx:561`
y `Canvas.tsx:439` hacen `useSisadPdfmeConfig(options)` y el ConfigService clona
esas opciones con structuredClone, así que colgar el hub de
`designerEngine.extensions.events` lanza DataCloneError al montar (9 por
montaje, medido). Primero hay que dejar de pasar `options` como config.
Estado fijado en `tests/unit/sisad-pdfme/events/eventHubWiring.test.ts`.

## Gates focales

```bash
npm run lint
npm run build
npm run quality:direct-config-readers
npm run quality:duplicate-functions
npx vitest run <tests-focales>
```

Agregar Playwright solo cuando cambie comportamiento visible.

## Presupuesto

- Máximo 5 archivos productivos.
- Máximo 8 lecturas iniciales.
- Máximo 2 rondas de búsqueda.
- Máximo 3 intentos de parche.
- Un dominio por commit.
- Contexto máximo 75 %.

## Condición de parada

Detenerse y entregar handoff si:

- se requiere tocar otro dominio;
- se excede presupuesto;
- aparece conflicto con otra claim;
- la solución exige una API paralela;
- no existe prueba focal;
- se filtra lógica del host;
- el cambio altera snapshot/geometría sin migración específica.

## Rollback

Commit atómico. Preservar:

```txt
schemaUid
documentId
pageNumber
ownerRecipientId
ownerRecipientIds
ownerColor
required
readOnly
locks
selection
zoom
scroll
snapshotVersion
```

## Handoff

```txt
task
claim
rama/worktree
commit base
causa confirmada
archivos
cambios
eventos/commands afectados
UC cubiertos
gates ejecutados
gates no ejecutados
riesgos
rollback
siguiente acción
```
