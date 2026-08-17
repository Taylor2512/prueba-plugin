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
