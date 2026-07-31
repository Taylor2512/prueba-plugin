# COREUX-003 — Auditar cobertura real de eventos y efectos

**Estado:** done  
**Wave:** W0  
**Prioridad:** P0  
**Riesgo:** Alto  
**Owner sugerido:** runtime-architect  
**Modelo sugerido:** Sol high  
**Dependencias:** ninguna  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Comparar eventos configurados, hub, emissions, callbacks y efectos React/DOM.

## Casos de uso

Dominios: EVT, INT, RUN.

EVT-001, EVT-002, EVT-003, EVT-004, EVT-005, EVT-006, EVT-007, EVT-008, EVT-009, EVT-010, EVT-011, EVT-012, EVT-013, EVT-014, EVT-015, INT-001, INT-002, INT-003, INT-004, INT-005, INT-006, INT-007, INT-008, INT-009, INT-010, INT-011, INT-012, INT-013, INT-014, INT-015, RUN-001, RUN-002, RUN-003, RUN-004, RUN-005, RUN-006, RUN-007, RUN-008, RUN-009, RUN-010, RUN-011, RUN-012, RUN-013, RUN-014, RUN-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Observer, Effect coordinator

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

- `src/sisad-pdfme/config/**`
- `src/sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts`
- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/usePreviewRuntime.ts`
- `src/sisad-pdfme/react/**`

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

1. Mapear productores y consumidores.
2. Detectar eventos configurados sin emisión.
3. Detectar emisiones sin contrato público.
4. Inventariar focus/scroll/modal/storage/object URL effects.
5. Proponer prueba por brecha.

## Criterios de aceptación

- [x] Matriz producer→event→consumer→test.
- [x] Claims etiquetados confirmado/inferido/desconocido.
- [x] No se modifica código.

Entrega: `reports/core-ux/11-EVENT-EFFECT-COVERAGE.md`. Hallazgo principal: el
hub de runtime emite ~40 eventos al vacío porque `designerEngine.extensions.events`
nunca se puebla con el `eventHub` que ya crea `resolveSisadPdfmeConfig:282`.

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
