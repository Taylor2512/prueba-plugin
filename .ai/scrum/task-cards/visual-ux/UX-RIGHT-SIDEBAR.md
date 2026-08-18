---
id: UX-RIGHT-SIDEBAR
campaign: SISAD-PDFME-UX
status: BACKLOG
priority: P1
depends_on: []
---
# UX-RIGHT-SIDEBAR — Navegación, ListView, DetailView, comments y documents

## Objective
Unificar panel registry, header contextual, scroll owner, ListView, reasignación, DetailView,
CommentsRail, DocumentsRail y estados empty/loading/error/disabled.

## Absorbs
VISUX-018..027 y COREUX-024..030 relacionados con el sidebar.

## Acceptance
- un panel registry;
- un scroll owner por panel;
- assignment != lock != audit;
- disabled siempre con reason;
- ListView/DetailView/Canvas no contradicen identidad o selección;
- comments/documents con lifecycle único.

<!-- designer-ux-hardening:start -->
## Refinamiento activo — multiselección desde ListView

Agregar entrada a multiselección por long-press sin redirección automática a Detalle y sin crear un state paralelo de selected IDs.

### Dirección

- usar `SelectionCommandSet`/selection authority existente;
- separar `selection intent` de `open Detail intent`;
- click corto conserva Detail fuera de multi mode;
- long-press entra a multi mode y togglea selección permaneciendo en Campos;
- movimiento > slop cancela long-press y preserva DnD;
- modifier click sigue disponible;
- equivalente accesible/teclado obligatorio;
- contador/acciones derivados de selection + access/capabilities.

### DoD

- unit: recognizer threshold/slop/cancel + selection/detail policy;
- Playwright: short click, long press, 2/3/N, toggle, DnD cancel, touch, Escape, modifier, Canvas↔List sync, locked/readOnly y page/document switch;
- no remount ni IDs huérfanos.
<!-- designer-ux-hardening:end -->
