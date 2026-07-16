# TASK-CSS-026 — Desmantelamiento acelerado de Tailwind inline (FASE A/E/H/G)

- Estado: active
- Prioridad: Alta
- Responsable sugerido: Claude
- Área: `sisad-pdfme` / tokens / lab host / CSS técnico residual
- Plan: `ai/plans/PLAN_EJECUCION_MIGRACION_TAILWIND_SISAD_PDFME.md`
- Prompt maestro: `ai/prompts/PROMPT_MAESTRO_MIGRACION_TAILWIND_SISAD_PDFME.md`

## Coexistencia con TASK-REGRESSION-021

`TASK-REGRESSION-021` (responsable: Copilot) está trabajando activamente el **skin del shell,
sidebars e inspector** dentro de `sisad-pdfme.css` (2004→1943 líneas, 445→431 `@apply` durante
esta sesión). Para no colisionar, **esta tarjeta se limita a carriles disjuntos**:

- FASE A — inventario/mapa (análisis, sin UI).
- FASE E — lab host (`labRoutes.css`, archivo distinto).
- FASE H — tokens (`tokens.css`, archivo distinto).
- FASE G — poda de CSS **técnico/huérfano demostrado** (no skin en disputa).

No toco reglas de shell/sidebar/inspector mientras REGRESSION-021 esté activa.

## Hecho en esta sesión

- **FASE A** — Línea base + `constants-contract.md`: las 9 constantes de `constants.ts`
  (DESIGNER_CLASSNAME, UI_CLASSNAME, SELECTABLE_CLASSNAME, RULER_HEIGHT, PAGE_GAP,
  LEFT/RIGHT_SIDEBAR_WIDTH, BACKGROUND_COLOR, DEFAULT_MAX_ZOOM) son hooks
  semánticos / de interacción / geometría → **todas se conservan**, ninguna migra.
- **FASE E** — `labRoutes.css` era no-op (solo comentario) → **archivo eliminado** + import
  removido de `src/App.jsx`. Sin referencias restantes.
- **FASE H / PACKAGE-07** — Auditoría de 313 tokens. **175 huérfanos eliminados, 10 restaurados.**
  El criterio inicial perdió referencias con fallback `var(--t, valor)`: 10 tokens (chrome-*,
  root-width/height, ls-draggable-*) seguían consumidos y 2 fallbacks no igualaban el original
  (`chrome-border`, `chrome-height`) → **regresión detectada y corregida** restaurándolos.
  `tokens.css` 323→150 líneas. Verificado: 0 tokens borrados siguen referenciados.

- **PACKAGE-06 / FASE G (parcial)** — Poda huérfana de `sisad-pdfme.css` por cirugía de regla:
  familia `control-bar-*` (context/kicker/page/subtext/title-row/status-chip/actions/group/
  shortcuts-btn/page-select/menu-item + stage-coupled) y `output-grid/output-card`; parciales
  `pager` y `panel-dock/trigger`. ~100 líneas menos. Conservados vivos + AntD + tokens con fallback.
  Lección: `ui-zoom` es vivo vía `UI_CLASSNAME + 'zoom'` → verificar por **sufijo**, no clase completa.

## Gate ejecutado

- `npm run build` → **exit 0** (varias veces). CSS 181.28 → **176.14 KiB**. Braces 468/468.
- Playwright `lab-designer-visual-baseline-regression:66` (shell/layout) → **pasa**. `:4` es
  **pre-existente** (se reproduce revirtiendo a HEAD), no introducido aquí.

## Pendiente (siguientes paquetes de esta tarjeta)

- FASE H bis: clasificar los ~90 tokens vivos restantes (ACTIVE_SHARED / ALIAS_REQUIRED)
  y documentar; no eliminar deprecated con consumidores.
- FASE G: clasificar bloques residuales de `sisad-pdfme.css` (ANTD/CANVAS/PAPER/MOVEABLE/
  SELECTO/PRINT/KEYFRAMES/RUNTIME_GLOBAL/ORPHAN) y podar solo huérfanos demostrados **una vez
  que REGRESSION-021 libere el archivo**.
- FASE I: métricas finales + QA de regresión.

## Registro UX/UI Canvas-First (PROMPT_MEJORA_UX_UI_CANVAS_FIRST) — 2026-07-16

Scope registrado aquí (no se creó una 3ª task-card, per regla del prompt).

- **Hecho:** auditoría del entrypoint — `editor/index.ts` tenía `import '../ui/styles/sisad-pdfme.css'`
  **duplicado** (líneas 49-50). Eliminada la duplicación exacta + comentario redundante; orden
  `tokens.css → sisad-pdfme.css` preservado. `react/index.ts` ya era correcto. `npm run build` → exit 0.
- **BLOQUEADO (no ejecutado):** el rediseño visual de componentes (RightSidebar/LeftSidebar/CtlBar/
  ResultsPanel — Pasos 2-5 del prompt). Razón: **REGRESSION-021 (Copilot) está reescribiendo en vivo
  TODOS los archivos objetivo** — `sisad-pdfme.css` colapsó 1747→566 líneas esta sesión y están dirty
  RightSidebar.tsx, layout.tsx, SidebarSurfacePrimitives, todo ListView/*, todo DetailView/*,
  DocumentsRail, CommentsRail, LeftSidebar.tsx, CtlBar.tsx, ResultsPanel.jsx. Un overhaul visual
  coherente requiere editar esos mismos archivos de forma coordinada → colisión garantizada con el
  trabajo en progreso de Copilot. El propio prompt exige **una sola task-card activa** antes de
  ejecutar; esa precondición no se cumple mientras REGRESSION-021 siga activa.
- **Recomendación:** dejar aterrizar REGRESSION-021 y consolidar los ~200 archivos dirty en un commit;
  sobre esa base estable ejecuto los Pasos 2-5 del overhaul (subpases A-D) con validación por paquete.

## Selector de "usuario activo" en topbar embebido — 2026-07-16

Bug real: en `multi-document-routing` (`usesEmbeddedDesignerShell = true`) el `PageHeader`
externo NO se monta, así que el selector de destinatario quedó fuera del DOM.

**Hallazgo arquitectónico:** `SisadPdfmeDesigner` renderiza solo `<div ref>` — el diseñador se
monta **imperativamente** (runtime pdfme), NO como hijos React. Por tanto **la propuesta de
`topbarRecipientSlot` como ReactNode es incompatible**: no hay padre React que lo inyecte. El
selector debe renderizarse **dentro** del diseñador (CtlBar) desde `collaborationContext.recipientOptions`.

**Hecho y validado (`npm run build` exit 0):**
- `RegisteredUsersSelector.tsx` creado (`ui/components/`, conventions: UI_CLASSNAME, mergeClassNames,
  `border-solid`, testid `designer-active-recipient-select`, estados sin/uno/varios usuarios + vista global).
- `PdfmeLabPage.jsx`: round-trip controlado — `handleActiveRecipientChange` + `onActiveRecipientChange`
  en el `<SisadPdfmeDesigner>` (antes faltaba; sin él el prop controlado revierte el cambio interno).
  `activeRecipientId` ya era la fuente viva (`activeCollaboratorId`), verificado.
- `RecipientRegistry.setActiveRecipient(id)` existe (recipientRegistry.ts:168) = setter interno.

**Pendiente (plumbing del bridge imperativo — zona activa Copilot):** montar el selector en CtlBar:
1. `SisadPdfmeDesigner.tsx`: inyectar `onSelectActiveRecipient: (id) => registry.setActiveRecipient(id)`
   en `designerEngine.collaboration`.
2. `collaborationContext.ts` (`buildEffectiveCollaborationContext`): propagar ese callback.
3. `Designer/index.tsx`: pasar `recipientOptions` + `activeRecipient` + callback a `<CtlBar>`.
4. `CtlBar.tsx`: nuevos props + render de `<RegisteredUsersSelector>` en la banda superior (cluster
   top-left/center, junto a page-nav).
No ejecutado: cruza el boundary imperativo + `Designer/index.tsx` (4000 líneas) + CtlBar, todos dirty
y en reescritura por REGRESSION-021; un bug ahí rompe permisos/colores runtime (no lo caza el build).

## Reglas

- Preservar concatenación `DESIGNER_CLASSNAME + 'suffix'` / `UI_CLASSNAME + 'suffix'`.
- No mover CSS técnico (AntD descendant, geometría, keyframes) a JSX solo por reducir líneas.
- Selectores AntD descendant (`.right-sidebar .ant-*`) = CSS técnico → conservar.
- No tocar Moveable/Selecto/coordenadas/snapshot/generator/pdf-lib/zoom.
