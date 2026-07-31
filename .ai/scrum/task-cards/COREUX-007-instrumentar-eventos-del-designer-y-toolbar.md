# COREUX-007 — Instrumentar eventos del Designer y toolbar

**Estado:** done  
**Wave:** W1  
**Prioridad:** P0  
**Riesgo:** Muy alto  
**Owner sugerido:** runtime-architect  
**Modelo sugerido:** Sol high  
**Dependencias:** COREUX-006  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Emitir selección, schema, page, zoom, sidebar, view, save y error desde puntos canónicos.

## Casos de uso

Dominios: EVT, CMD, INT.

CMD-001, CMD-002, CMD-003, CMD-004, CMD-005, CMD-006, CMD-007, CMD-008, CMD-009, CMD-010, CMD-011, CMD-012, CMD-013, CMD-014, CMD-015, EVT-001, EVT-002, EVT-003, EVT-004, EVT-005, EVT-006, EVT-007, EVT-008, EVT-009, EVT-010, EVT-011, EVT-012, EVT-013, EVT-014, EVT-015, INT-001, INT-002, INT-003, INT-004, INT-005, INT-006, INT-007, INT-008, INT-009, INT-010, INT-011, INT-012, INT-013, INT-014, INT-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Command + Observer

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

- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/CtlBar.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts`
- `src/sisad-pdfme/ui/commands/designerCommands.ts`
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

1. Emitir después de mutación confirmada.
2. Evitar emisiones desde componentes duplicados.
3. Agregar cause/source.
4. Coalescer zoom/drag cuando aplique.
5. Probar orden de eventos.

## Criterios de aceptación

- [x] Eventos críticos del Designer tienen producer real. Verificado en
      navegador con interacción real: `selection.changed`, `page.changed`,
      `zoom.changed`, `sidebar.changed`, `viewport.fit` e
      `interaction.phase.changed` llegan al host.
- [x] No hay doble emisión Canvas/ListView: una selección aislada produce
      `selection.changed` × 1 (medido).
- [x] Orden command→event determinista (test de orden en el puente).

Desbloqueo previo: `config/configFromRuntimeOptions.ts`. `Designer/index.tsx` y
`Canvas.tsx` pasaban las OPCIONES del runtime a `useSisadPdfmeConfig`, que las
clona con structuredClone; por eso colgar el hub de `designerEngine` lanzaba
DataCloneError. Ahora solo viaja la porción serializable de configuración.

Entrega:
- hub conectado en `resolveSisadPdfmeConfig` (`extensions.events === eventHub`);
- `runtime/runtimeEventBridge.ts` traduce los 38 `type` heredados al catálogo;
  lo no mapeado viaja como `custom:<type>` en vez de perderse;
- prop pública `onEvent` en `SisadPdfmeDesigner`: flujo único tipado.

Tests: `tests/unit/sisad-pdfme/events/**` (41 en verde).

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
