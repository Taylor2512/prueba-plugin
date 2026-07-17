# Plan 02 — UX/UI de stage y sidebars

## Objetivo

Reducir densidad y recuperar jerarquía sin agregar otro header del host.

```txt
Stage topbar
├── izquierda: navegación/contexto
├── centro: recipient/document summary
└── derecha: Guardar, preview y menú global
```

## Claude
Mover Guardar fuera del RightSidebar, mostrar Guardando/Guardado/Error y separar acciones globales/locales.

## Copilot
Compactar LeftSidebar, una superficie por plugin, favoritos discretos y drag estable.

## Codex
Toolbar contextual sin invadir schema/topbar y focus return.

## QA
1440×900, 1280×720 y 390×844; sidebars abiertos/cerrados; popovers en bordes; cero overlap.
