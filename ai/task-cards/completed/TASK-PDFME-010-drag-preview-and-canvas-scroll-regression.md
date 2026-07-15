# TASK-PDFME-010 — Drag preview, scroll canvas y posicionamiento

## Estado

completed

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

## Tareas

- [x] Cubrir el drag preview con una regresión de Playwright.
- [x] Verificar drop en página 2 con el canvas scrolleado.
- [x] Confirmar que el preview y el placeholder aparecen durante el drag externo.

## No hacer

- No tocar Moveable ni Selecto.
- No cambiar geometría de schemas.
- No resolver el caso con hacks de host.
