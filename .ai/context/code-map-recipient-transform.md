# Code Map — recipient transform focus

## Tests existentes relevantes

- `tests/playwright/multiuser-collaboration.spec.ts`: cambios de usuario activo, vista user/global, visibilidad de schemas y unicidad de UID.
- `tests/playwright/canvas-interactions.spec.ts`: estabilidad de canvas y render al cambiar vista.
- `tests/playwright/pdfme-editor.spec.ts`: selección, sidebars, shortcuts, firma, multi-document y runtime.
- `tests/playwright/shortcuts.spec.ts`: Delete, copy, group, undo y selección.

## Archivos de runtime relevantes

- `Canvas.tsx`: feature toggles, slots, bridge, interaction state.
- `Moveable.tsx`: drag/resize/rotate y targets.
- `Selecto.tsx`: selección simple/múltiple.
- `recipientColor.ts`: color ownership y resolución de color.
- `schemaTone.ts`: tono visual del schema.
- `PluginIcon.tsx`: iconos del catálogo y fallback icon.

## Archivos CSS relevantes

- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `src/sisad-pdfme/ui/styles/canvas-interactions.css`
- `src/sisad-pdfme/ui/styles/tokens.css`
