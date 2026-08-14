# Plan maestro visual y de comportamiento — SISAD PDFME

**Fecha:** 2026-08-04  
**Estado inicial:** Backlog  
**Task-cards:** 42  
**Casos de uso:** 158

## 1. Objetivo

Corregir la experiencia visual y el comportamiento de cada superficie de
`src/sisad-pdfme` sin trasladar lógica visual al host y sin reconstruir
subsystemas que ya existen.

El resultado debe conservar:

```text
documentId
pageNumber
schemaUid
selection
zoom
scroll
ownerRecipientId
ownerColor
required
readOnly
locks
comments
assignments
snapshotVersion
```

## 2. Principios obligatorios

```text
UI expresa intención.
Policies deciden permiso y disponibilidad.
Commands mutan.
Events describen lo ocurrido.
Effects coordinan DOM y host.
Snapshot persiste.
Config selecciona comportamiento.
```

- `enabled`, `visible`, `permitted`, `available`, `active` y `executable` son distintos.
- Un control visible tiene handler o reason.
- Un solo scroll owner por panel.
- Un solo writer por task/claim.
- No crear otro event bus, action registry, snapshot, recipient registry u overlay manager.
- No usar `setTimeout` para lifecycle.
- No resolver problemas con z-index arbitrario.
- Tailwind vive en JSX/TSX; `tokens.css` conserva variables compartidas.
- No importar `src/` desde el core.
- No tocar Moveable, Selecto o coordinateMath fuera de una task específica y una prueba roja.

## 3. Hallazgos que disparan el plan

- Tabs del RightSidebar truncados.
- Reasignar exige más de dos recipients y no explica el estado disabled.
- ListView tiene baja densidad y acciones destructivas dominantes.
- DetailView mezcla identidad, bloqueo, interacción y capacidades.
- CommentsRail mezcla alcance de página y campo.
- DocumentsRail mezcla documentos y páginas.
- Menú Más repite acciones y clasifica reglas dentro de Orden.
- Owner, readonly, lock y reserva de edición se representan de forma ambigua.
- El LeftSidebar parece desplazar el paper en algunas combinaciones.
- Existen tokens usados con nombres que no coinciden con las variables definidas.
- Los schemas no muestran todavía paridad completa entre Designer, Form, Viewer, PDF y snapshot.

## 4. Oleadas

### W0 — Baseline y contratos
VISUX-001..004.

### W1 — Workspace, toolbar y overlays
VISUX-005..012.

### W2 — LeftSidebar y drag desde catálogo
VISUX-013..017.

### W3 — RightSidebar, lista, detalle, comentarios y documentos
VISUX-018..027.

### W4 — Schemas e inspector por familia
VISUX-028..036.

### W5 — Colaboración, multidocumento, runtimes, accesibilidad y rendimiento
VISUX-037..041.

### W6 — QA, documentación y release
VISUX-042.

## 5. Orden y paralelismo

- Mantener WIP global máximo 3.
- Solo una task de riesgo `very-high` en progreso.
- VISUX-018 y VISUX-013 pueden ejecutarse en paralelo si usan worktrees separados.
- Las familias VISUX-029..033 pueden paralelizarse después de VISUX-024/028.
- VISUX-035 espera todas las familias.
- VISUX-041 debe ejecutarse antes de aprobar visual regression final.
- No activar una VISUX si la task COREUX relacionada ya tiene claim activo sobre los mismos archivos.

## 6. Definition of Ready

- baseline o test de caracterización;
- archivos candidatos confirmados;
- dependencias terminadas;
- WIP disponible;
- claim/worktree registrado;
- hipótesis y condición de parada;
- no más de 8 archivos abiertos inicialmente.

## 7. Definition of Done

- comportamiento observable corregido;
- paridad entre superficies aplicables;
- tests focales;
- `typecheck`, `lint`, `build` y diff check;
- Playwright si cambia comportamiento visible;
- trazabilidad task→casos→tests;
- sin nueva fuente paralela;
- rollback y handoff.

## 8. Task-cards

| ID | Wave | P | Título | Relación COREUX | Dependencias |
|---|---|---|---|---|---|
| [VISUX-001](../scrum/task-cards/visual-ux/VISUX-001-congelar-baseline-visual-y-estados-reproducibles.md) | W0 | P0 | Congelar baseline visual y estados reproducibles | COREUX-001, COREUX-054 | — |
| [VISUX-002](../scrum/task-cards/visual-ux/VISUX-002-inventariar-componentes-visuales-scroll-owners-y-fuentes-de-estado.md) | W0 | P0 | Inventariar componentes visuales, scroll owners y fuentes de estado | COREUX-002, COREUX-004, COREUX-020, COREUX-024 | VISUX-001 |
| [VISUX-003](../scrum/task-cards/visual-ux/VISUX-003-auditar-tokens-contraste-densidad-y-lenguaje-visual.md) | W0 | P0 | Auditar tokens, contraste, densidad y lenguaje visual | COREUX-013, COREUX-014, COREUX-051 | VISUX-001 |
| [VISUX-004](../scrum/task-cards/visual-ux/VISUX-004-unificar-auditoria-de-acciones-acceso-y-motivos-de-deshabilitacion.md) | W0 | P0 | Unificar auditoría de acciones, acceso y motivos de deshabilitación | COREUX-010, COREUX-011, COREUX-012 | VISUX-002 |
| [VISUX-005](../scrum/task-cards/visual-ux/VISUX-005-crear-un-estado-responsive-unico-del-workspace.md) | W1 | P0 | Crear un estado responsive único del workspace | COREUX-020 | VISUX-002 |
| [VISUX-006](../scrum/task-cards/visual-ux/VISUX-006-unificar-rails-y-colapso-de-ambos-sidebars.md) | W1 | P0 | Unificar rails y colapso de ambos sidebars | COREUX-021 | VISUX-005, VISUX-003 |
| [VISUX-007](../scrum/task-cards/visual-ux/VISUX-007-preservar-ancla-visual-zoom-y-scroll-al-cambiar-layout.md) | W1 | P0 | Preservar ancla visual, zoom y scroll al cambiar layout | COREUX-022 | VISUX-005, VISUX-006 |
| [VISUX-008](../scrum/task-cards/visual-ux/VISUX-008-corregir-header-de-guardar-navegacion-de-paginas-y-estado-de-seleccion.md) | W1 | P0 | Corregir header de guardar, navegación de páginas y estado de selección | COREUX-013, COREUX-016, COREUX-018 | VISUX-003, VISUX-004 |
| [VISUX-009](../scrum/task-cards/visual-ux/VISUX-009-cerrar-contrato-de-zoom-fit-undo-y-redo.md) | W1 | P1 | Cerrar contrato de zoom, fit, undo y redo | COREUX-017 | VISUX-005, VISUX-008 |
| [VISUX-010](../scrum/task-cards/visual-ux/VISUX-010-reemplazar-tooltips-nativos-y-cerrar-foco-de-controles.md) | W1 | P1 | Reemplazar tooltips nativos y cerrar foco de controles | COREUX-014, COREUX-051 | VISUX-003 |
| [VISUX-011](../scrum/task-cards/visual-ux/VISUX-011-unificar-toolbar-contextual-y-menu-mas.md) | W1 | P0 | Unificar toolbar contextual y menú Más | COREUX-041, COREUX-045 | VISUX-004, VISUX-010 |
| [VISUX-012](../scrum/task-cards/visual-ux/VISUX-012-hacer-overlays-collision-aware-y-coordinar-stack-visual.md) | W1 | P0 | Hacer overlays collision-aware y coordinar stack visual | COREUX-009, COREUX-031, COREUX-044 | VISUX-007, VISUX-011 |
| [VISUX-013](../scrum/task-cards/visual-ux/VISUX-013-compactar-shell-tabs-y-colapso-del-leftsidebar.md) | W2 | P1 | Compactar shell, tabs y colapso del LeftSidebar | COREUX-021, COREUX-023 | VISUX-005, VISUX-006 |
| [VISUX-014](../scrum/task-cards/visual-ux/VISUX-014-cerrar-busqueda-filtros-y-selector-de-layout-del-catalogo.md) | W2 | P1 | Cerrar búsqueda, filtros y selector de layout del catálogo | COREUX-023 | VISUX-013 |
| [VISUX-015](../scrum/task-cards/visual-ux/VISUX-015-compactar-grupos-cards-favoritos-y-owner-tone-del-catalogo.md) | W2 | P1 | Compactar grupos, cards, favoritos y owner tone del catálogo | COREUX-023, COREUX-041 | VISUX-014, VISUX-003 |
| [VISUX-016](../scrum/task-cards/visual-ux/VISUX-016-cerrar-custom-fields-auto-fields-y-catalogo-de-recipients.md) | W2 | P1 | Cerrar custom fields, auto fields y catálogo de recipients | COREUX-023, COREUX-036 | VISUX-013, VISUX-015 |
| [VISUX-017](../scrum/task-cards/visual-ux/VISUX-017-cerrar-drag-preview-drop-setup-y-feedback-de-colocacion.md) | W2 | P0 | Cerrar drag preview, drop setup y feedback de colocación | COREUX-043 | VISUX-015, VISUX-012 |
| [VISUX-018](../scrum/task-cards/visual-ux/VISUX-018-hacer-responsive-la-navegacion-del-rightsidebar.md) | W3 | P0 | Hacer responsive la navegación del RightSidebar | COREUX-024 | VISUX-005, VISUX-006 |
| [VISUX-019](../scrum/task-cards/visual-ux/VISUX-019-formalizar-panel-registry-header-contextual-y-scroll-owner.md) | W3 | P0 | Formalizar panel registry, header contextual y scroll owner | COREUX-024 | VISUX-018, VISUX-002 |
| [VISUX-020](../scrum/task-cards/visual-ux/VISUX-020-compactar-listview-y-separar-identidad-estados-y-acciones.md) | W3 | P0 | Compactar ListView y separar identidad, estados y acciones | COREUX-025 | VISUX-019, VISUX-003, VISUX-004 |
| [VISUX-021](../scrum/task-cards/visual-ux/VISUX-021-cerrar-seleccion-reorder-localizar-y-menu-por-fila.md) | W3 | P0 | Cerrar selección, reorder, localizar y menú por fila | COREUX-025, COREUX-042, COREUX-045 | VISUX-020, VISUX-004 |
| [VISUX-022](../scrum/task-cards/visual-ux/VISUX-022-corregir-disponibilidad-y-lifecycle-de-reasignar-responsable.md) | W3 | P0 | Corregir disponibilidad y lifecycle de Reasignar responsable | COREUX-026 | VISUX-004, VISUX-020 |
| [VISUX-023](../scrum/task-cards/visual-ux/VISUX-023-corregir-header-e-identidad-del-detailview.md) | W3 | P0 | Corregir header e identidad del DetailView | COREUX-029, COREUX-030 | VISUX-019, VISUX-004 |
| [VISUX-024](../scrum/task-cards/visual-ux/VISUX-024-reorganizar-taxonomia-disclosure-y-widgets-del-detailview.md) | W3 | P0 | Reorganizar taxonomía, disclosure y widgets del DetailView | COREUX-029, COREUX-030, COREUX-032, COREUX-033 | VISUX-023 |
| [VISUX-025](../scrum/task-cards/visual-ux/VISUX-025-cerrar-alcance-y-lifecycle-del-commentsrail.md) | W3 | P0 | Cerrar alcance y lifecycle del CommentsRail | COREUX-028 | VISUX-019, VISUX-004 |
| [VISUX-026](../scrum/task-cards/visual-ux/VISUX-026-separar-documento-pagina-y-acciones-del-documentsrail.md) | W3 | P0 | Separar documento, página y acciones del DocumentsRail | COREUX-027, COREUX-046 | VISUX-019 |
| [VISUX-027](../scrum/task-cards/visual-ux/VISUX-027-unificar-estados-empty-loading-error-y-disabled-del-rightsidebar.md) | W3 | P1 | Unificar estados empty, loading, error y disabled del RightSidebar | COREUX-024, COREUX-027, COREUX-028, COREUX-030 | VISUX-019, VISUX-025, VISUX-026 |
| [VISUX-028](../scrum/task-cards/visual-ux/VISUX-028-unificar-field-chrome-owner-tone-y-estados-visuales.md) | W4 | P0 | Unificar field chrome, owner tone y estados visuales | COREUX-010, COREUX-041 | VISUX-003, VISUX-004 |
| [VISUX-029](../scrum/task-cards/visual-ux/VISUX-029-cerrar-perfiles-text-like-number-y-date-time.md) | W4 | P0 | Cerrar perfiles text-like, number y date/time | COREUX-037 | VISUX-024, VISUX-028 |
| [VISUX-030](../scrum/task-cards/visual-ux/VISUX-030-cerrar-select-checkbox-radio-y-option-groups.md) | W4 | P0 | Cerrar select, checkbox, radio y option groups | COREUX-034, COREUX-038 | VISUX-024, VISUX-028 |
| [VISUX-031](../scrum/task-cards/visual-ux/VISUX-031-hacer-el-inspector-de-firma-dependiente-del-modo.md) | W4 | P0 | Hacer el inspector de firma dependiente del modo | COREUX-035, COREUX-039 | VISUX-023, VISUX-024, VISUX-028 |
| [VISUX-032](../scrum/task-cards/visual-ux/VISUX-032-cerrar-action-schemas-attachment-note-approve-y-decline.md) | W4 | P0 | Cerrar action schemas: attachment, note, approve y decline | COREUX-040 | VISUX-024, VISUX-028 |
| [VISUX-033](../scrum/task-cards/visual-ux/VISUX-033-cerrar-media-barcode-table-y-shapes.md) | W4 | P1 | Cerrar media, barcode, table y shapes | COREUX-040 | VISUX-024, VISUX-028 |
| [VISUX-034](../scrum/task-cards/visual-ux/VISUX-034-normalizar-i18n-labels-tecnicos-y-modo-avanzado.md) | W4 | P1 | Normalizar i18n, labels técnicos y modo avanzado | COREUX-029, COREUX-030, COREUX-056 | VISUX-003, VISUX-023, VISUX-024 |
| [VISUX-035](../scrum/task-cards/visual-ux/VISUX-035-probar-paridad-propiedadruntimespdfsnapshot.md) | W4 | P0 | Probar paridad propiedad→runtimes→PDF→snapshot | COREUX-049, COREUX-050 | VISUX-029, VISUX-030, VISUX-031, VISUX-032, VISUX-033 |
| [VISUX-036](../scrum/task-cards/visual-ux/VISUX-036-cerrar-seleccion-y-edicion-de-grupos-de-opciones.md) | W4 | P0 | Cerrar selección y edición de grupos de opciones | COREUX-034, COREUX-038, COREUX-042 | VISUX-030, VISUX-004 |
| [VISUX-037](../scrum/task-cards/visual-ux/VISUX-037-unificar-asignacion-reserva-de-edicion-readonly-y-posicion-fija.md) | W5 | P0 | Unificar asignación, reserva de edición, readonly y posición fija | COREUX-010, COREUX-026, COREUX-033 | VISUX-004, VISUX-022, VISUX-028 |
| [VISUX-038](../scrum/task-cards/visual-ux/VISUX-038-cerrar-routing-multidocumento-y-navegacion-por-pagina.md) | W5 | P0 | Cerrar routing multidocumento y navegación por página | COREUX-046, COREUX-047 | VISUX-026, VISUX-007 |
| [VISUX-039](../scrum/task-cards/visual-ux/VISUX-039-cerrar-paridad-visual-de-designer-form-y-viewer.md) | W5 | P0 | Cerrar paridad visual de Designer, Form y Viewer | COREUX-049, COREUX-051 | VISUX-035, VISUX-038 |
| [VISUX-040](../scrum/task-cards/visual-ux/VISUX-040-cerrar-responsive-touch-teclado-y-accesibilidad-integral.md) | W5 | P0 | Cerrar responsive, touch, teclado y accesibilidad integral | COREUX-051 | VISUX-006, VISUX-010, VISUX-018, VISUX-039 |
| [VISUX-041](../scrum/task-cards/visual-ux/VISUX-041-estabilizar-rendimiento-y-evitar-remounts-presentacionales.md) | W5 | P0 | Estabilizar rendimiento y evitar remounts presentacionales | COREUX-052 | VISUX-005, VISUX-038, VISUX-039 |
| [VISUX-042](../scrum/task-cards/visual-ux/VISUX-042-crear-suite-visual-gates-documentacion-y-release.md) | W6 | P0 | Crear suite visual, gates, documentación y release | COREUX-053, COREUX-054, COREUX-055, COREUX-056 | VISUX-035, VISUX-040, VISUX-041 |

## 9. Gates globales

```bash
npm run typecheck
npm run lint
npm run build
npm run test:unit
npm run quality:direct-config-readers
npm run quality:-style-boundary
npm run quality:source-language-boundary
npx playwright test tests/e2e/-layout.spec.ts
```

Ejecutar únicamente los gates existentes; registrar honestamente los no
disponibles.

## 10. Métricas de cierre

- 0 tabs truncados a letras aisladas.
- 0 acciones duplicadas en el mismo contexto.
- 0 disabled sin reason.
- 0 contradicciones Canvas/ListView/DetailView.
- 0 pérdida de selection/zoom/scroll al cambiar sidebars.
- 0 remount por cambios presentacionales.
- 1 scroll owner por panel.
- 100% de widgets visibles con round-trip.
- 100% de P0 con test.
- 100% de icon-only con nombre accesible.
