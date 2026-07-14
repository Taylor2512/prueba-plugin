# TASK-PDFME-010 — Drag preview, scroll canvas y posicionamiento

**Estado:** backlog  
**Prioridad:** P1  
**Área:** `src/sisad-pdfme/ui/components/Designer/Canvas`, host layout

## Objetivo

Resolver regresiones de drag preview, scroll entre páginas y posicionamiento sin romper Moveable/Selecto.

## Casos

- Drag desde LeftSidebar muestra preview.
- Canvas recibe dragover/drop.
- Scroll entre páginas funciona.
- Drop en página 2 cae en página 2.
- Zoom se considera en coordenadas.
- LeftSidebar scrollea su catálogo sin arrastrar canvas.
- RightSidebar scrollea ListView/DetailView.

## Regla central

```txt
Host da alto.
Canvas scrollea páginas.
Sidebars scrollean su contenido.
Body no scrollea dentro del diseñador fullscreen.
```
