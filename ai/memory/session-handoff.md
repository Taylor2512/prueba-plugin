# Session Handoff

## Estado operativo — 2026-07-17

### Consolidación completada

Los cambios de Wave 1 fueron incorporados a `main`:

```txt
14241ba  tests legacy pdfcomponent
82c65e2  labExamples clone import
c4894ac  Form memoization + drop flash hooks
dcce6e5  RightSidebar single scroll owner
```

### Gate conocido

```txt
lint: verde
build: verde
Vitest:
  482 archivos aprobados
  27 archivos fallidos
  1113 tests aprobados
  17 tests fallidos
  1 todo
```

### Próximo paso

Ejecutar Wave 1.5 con worktrees reutilizables:

```txt
Codex   -> core contracts
Claude  -> inspector contracts
Copilot -> test infrastructure
```

No comenzar Wave 2 visual hasta cerrar el gate unitario.

### Protocolo activo

```txt
ai/project/worktree-topology.md
ai/project/git-operating-model.md
ai/coordination/worktrees/WAVE-1.5.md
ai/coordination/worktrees/INTEGRATION-PROTOCOL.md
```

---

## Histórico previo

# Session Handoff

## Último foco

Ejecución completa de task-cards active + backlog (2026-07-15). Cerradas y
movidas a `completed/`:

- **ACTIONS-001**: inventario clasificado en
  `reports/action-audit/button-action-inventory.md` (237 candidatos;
  MISSING_HANDLER = 0 tras aplicar el contrato).
- **ACTIONS-002**: `designerActionState.ts` con `resolveDesignerActionState`
  (regla dura missing-handler, razones para tooltips); alias kebab-case
  consolidados en `actionRegistry.DESIGNER_ACTION_ALIASES`; adoptado en CtlBar
  y en `reassignActionState` (ListView).
- **DETAIL-015**: labels unificados (`inspectorStatusLabel = statusLabel`,
  'Posición bloqueada', 'Bloqueo sin responsable', menú 'Bloquear posición');
  alias legacy directos; se corrigieron 2 bugs de merge paralelo
  (statusTone fuera de scope; miembros duplicados en SchemaAccessState).
- **UI-015**: rails con tooltips + `sidebar-rail-<side>-<modo>` +
  `sidebar-collapse-<side>`; spec de no-solape Guardar/rail.
- **UI-016** (backlog): zoom siempre porcentual (`formatZoomPercent`,
  `buildZoomSelectOptions` inyecta el nivel actual), testids designer-zoom-*.
- **QA-015**: specs `action-contract-smoke`, `sidebar-rail-collapse-actions`,
  `zoom-toolbar-contract` + `tests/unit/sisad-pdfme/ui/actions/` (12 unit).
- **RUNTIME-015** (backlog): `ResolvedDesignerUiMap` + `useDesignerUiConfig`
  (`designerUiConfig.ts`); ActionRegistry consume el mismo mapa.
- **CSS-013/014**: auditores ejecutados, reportes regenerados (649 duplicados
  clasificados), ledger actualizado; SIN eliminación de reglas esta pasada
  (merges por slice usando los reportes).
- **ARCH-004**: `reports/designer-deep-audit/wrapper-reduction.md`
  (PASS_THROUGH_REMOVE = 0; par duplicado SidebarEmptyState ↔
  SidebarSurfaceEmptyState documentado para slice propio).

Siguen en `active/` solo las cards del repo host (`Sisad-Web-FRONTEND`):
PDFME-005, PDFME-008 (parte core verificada aquí), PDFME-009. No son
ejecutables dentro de este checkout; aquí solo queda la base portable que ya fue
verificada y el contexto histórico de esas integraciones.

Validación global: build exit 0, lint 0 errores, 101+ unit tests de áreas
tocadas en verde, 13 specs e2e en verde (specs desactualizados por el copy
cambiante del DetailView se hicieron copy-agnósticos). `tsc` global bajó de
174 a 140 errores (se arreglaron imports rotos de visibilityConfig/
designerUiConfig, duplicados de SchemaAccessState, badge type y ctx de tests).

## Próximo paso sugerido

- Slice de merges CSS (MERGE_SAME_SELECTOR) zona por zona usando
  `selector-duplicates-current.md`, con verificación visual.
- Convergencia SidebarEmptyState ↔ SidebarSurfaceEmptyState (slice propio).
- Adopción progresiva de `useDesignerUiConfig` en componentes que aún leen
  options directo.
- Cards host en Sisad-Web-FRONTEND (PDFME-005/008/009) con el reporte de
  paridad como guía.
- Commitear el working tree (mezcla trabajo de Codex + estas sesiones).

## Atención

- Codex trabaja EN PARALELO sobre este working tree (DetailView copy, registry,
  externalForms): antes de editar, releer el archivo; ya hubo 2 merges con
  bugs (statusTone, miembros duplicados) corregidos aquí.
- El copy del DetailView es inestable; los specs nuevos asertan títulos
  estables/testids, no descripciones.
- No usar git stash (4 stashes ajenos).

## Sesión 2026-07-15 (tarde) — TASK-INTERACTION-016 + seguimiento LAB-026

**INTERACTION-016 (freeze tras modal Reasignar) — CERRADA.** Causa raíz:
`isAntDPopupOpen()` contaba popups AntD montados-pero-ocultos (tooltip del
botón Reasignar, dropdowns `ant-*-hidden`) → Selecto/shortcuts congelados para
siempre. Fix: detección consciente de visibilidad + lifecycle único
`requestClose(reason)` + reset transitorio extendido (keepSelection,
releaseModalLock, blur solo con foco huérfano) + Escape a nivel documento.
Spec `assignment-modal-selection-freeze-regression` (4 tests) en verde.

**LAB-026 seguimiento — CERRADO.** Cadena de regresiones del preset resuelta:
CSS base importado en `react/index.ts`; adapter de documentos unificado
(la copia local del resolver PERDÍA `template` → canvas empty_page);
preset como estado inicial (no controlado); `--sisad-pdfme-rs-width` publicado
con el ancho real JS; CtlBar honra density explícito; shell del lab sin
overflow; reparado `@layer components` sin `@tailwind` que tiraba 500.
Bonus: shift-click acumulativo (selectionPolicy) — el par unit+e2e ahora
concuerda.

Estado final: 26 tests e2e en verde en el barrido completo, 288+ unit de las
suites tocadas (solo quedaba schemaTone desactualizado, ya alineado), build
exit 0.

**Deuda conocida**: los specs asumen ahora el contrato multi-página (17 papers,
máscaras por página no activa por diseño); si el routing multi-doc cambia a
"solo páginas del documento activo", revisar canvas-interactions y checkbox.
Codex sigue editando en paralelo: HUBO 3 colisiones reparadas aquí (statusTone
fuera de scope, duplicados en SchemaAccessState, @layer sin @tailwind).

## Sesión 2026-07-15 (noche) — ListView plano + reglas claras + estados

- TASK-CSS-024 (fila plana del ListView, Item.tsx) — completada.
- TASK-CANVAS-003 (bloque negro de reglas/guías) — completada: la regresión era
  el default oscuro `#2d2d2d`/`bg-slate-800` en `Guides.tsx`; migrado a paleta
  light (`#f8fafc`/`#f1f5f9`, texto slate legible). Verificado por color
  computado + captura + specs de canvas.
- TASK-CSS-020 (labRoutes zero-apply) — completada (labRoutes.css ya era no-op,
  0 @apply).
- Reconciliado: eliminado duplicado de TASK-REGRESSION-020 en backlog.
- Abierta TASK-QA-017 (deriva de specs por panel Docs default de LAB-029).

### Migración @apply de sisad-pdfme.css (directiva del usuario) — NO ejecutada en bloque

Motivo: `sisad-pdfme.css` tiene 588 `@apply` en 2486 líneas y su distribución es
~60% geometría de canvas/stage (prohibida) + DetailView/RightSidebar (zona activa
de Copilot, colisión) + reglas de layout sidebar↔canvas. La card activa
TASK-REGRESSION-021 (de Copilot) marca ese CSS PROHIBIDO y explícitamente veta
la migración masiva de @apply hasta probar paridad visual. Migrar en bloque
rompería visuales y chocaría con dos agentes. Debe hacerse por componente, en
slices, coordinado, cuando REGRESSION-021 cierre. Backlog CSS-021/022 (left
sidebar) son los siguientes slices seguros cuando el LeftSidebar no esté en
edición paralela.

## Migración @apply CSS→JSX — pase 1 (2026-07-15) — TASK-CSS-025

- Migrados a JSX (fuente única) y eliminados del CSS: skin de `context-summary`
  (DesignerContextSummary.tsx, componente sin montar) y base de `guides` corner/
  ruler (Guides.tsx). `@apply` en sisad-pdfme.css: 588 → 574.
- Se conservan en CSS solo reglas no expresables como className: descendientes
  `.scena-guides-*` (elementos de la librería) y variantes acopladas al `.stage`.
- HALLAZGO CLAVE (afecta toda migración futura): `preflight: false` →
  `border-b`/`border-r` NO fijan `border-style` y el borde colapsa a 0; usar
  `border-X border-solid`. La utilidad `border` (todos los lados) sí rinde solid.
- El grueso restante (574) es geometría/stage (prohibida) o zona activa de
  Copilot; requiere pases por componente coordinados.

## Migración @apply — pase 2 (2026-07-15) — ErrorScreen + muro de contención

- Migrado `ErrorScreen.tsx` (grid centering, width, skin) → JSX; eliminadas
  reglas element + padding en conflicto. `@apply` acumulado: 588 → 571.
- MURO DE CONTENCIÓN: git status muestra TODO el designer UI dirty (LeftSidebar*,
  PluginIcon, DetailView/*, RightSidebar*, ListView*, index.tsx, CtlBar,
  Canvas...) por edición paralela de Codex/Copilot. El resto del skin migrable
  está en esos componentes o es geometría de canvas/stage (prohibida). No es
  seguro seguir migrando sisad-pdfme.css hasta que el trabajo paralelo haga
  commit. URGENTE: commitear y coordinar antes del siguiente pase.

## Migración @apply — pase 3 (2026-07-15) — SelectionContextToolbar
- Eliminado el bloque CSS muerto/redundante de `.selection-context-toolbar*`
  (≈46 reglas): el componente se reescribió a estructura mínima inline. Migrado
  al JSX solo `absolute`/`pointer-events-auto`/animación. `@apply` 588 → 525.
- 2º matiz border-solid: los <button> tienen `border-style: outset` del UA →
  requieren `border-solid` (los <div> son `none`). Regla para toda la migración.

## Migración @apply — pase 4 (2026-07-15) — reglas muertas
- Borradas reglas de clases sin render (verificado 0 refs con las 3 formas de
  construcción): context-menu, list-view-empty/-title/-hint/-counter/-subtitle.
  @apply acumulado: 588 → 514. Build OK, riesgo cero (nada las monta).
- Copilot edita el CSS en paralelo (conteo baja solo). Regla: solo migrar .tsx
  no-dirty o borrar reglas muertas verificadas; NO bulk-delete por detector
  ingenuo (falsos positivos como `stage` que es live vía template literal).

## Migración @apply — pase 5 (2026-07-15) — límite seguro alcanzado
- Borrada regla muerta `.back-button` (base/hover/active, 0 refs verificadas).
  @apply acumulado: 588 → 511.
- Detector FIABLE (3 formas de grep + child-prefix) sobre 114 reglas single-class:
  36 muertas, pero SOLO 1 (back-button) fuera de la zona de Copilot. Las otras 35
  muertas son DetailView/control-bar/custom-field/sidebar → NO tocar: sus .tsx
  están dirty (mid-edit por Copilot), donde incluso "muerto" es inseguro (el
  snapshot puede no reflejar el estado final) y editar el mismo CSS arriesga clobber.
- CONCLUSIÓN: la superficie segura para este agente está agotada. El resto del
  skin/dead CSS vive en componentes que Copilot reescribe AHORA (mismo archivo).
  Próximo avance real = commit/land de Copilot, luego retomar DetailView/control-bar
  con las reglas de border-solid.
