# Checklist de aceptación visual y comportamiento

## Layout
- [ ] Sidebars no desplazan el paper fuera del contrato.
- [ ] Rails son coherentes.
- [ ] No existe overflow horizontal.
- [ ] Responsive usa ancho del root.

## Toolbar
- [ ] Save lifecycle no se contradice.
- [ ] Pager y selección están separados.
- [ ] Zoom/fit/undo/redo son accesibles.

## LeftSidebar
- [ ] Tabs, búsqueda, filtros y layouts no se cortan.
- [ ] Cards son compactas y arrastrables.
- [ ] Custom/favorites/recent funcionan.

## RightSidebar
- [ ] Cuatro tabs funcionan en cada density.
- [ ] Un scroll owner por panel.
- [ ] ListView compacta y sincronizada.
- [ ] Reasignar funciona con dos recipients asignables.
- [ ] Comments usa scope correcto.
- [ ] Documents distingue documentos y páginas.
- [ ] DetailView tiene identidad y taxonomía uniforme.

## Schemas
- [ ] Owner/semantic/selected/readonly/lock son distinguibles.
- [ ] Cada familia tiene inspector y runtime parity.
- [ ] Groups son seleccionables como root.
- [ ] Firma depende del modo.
- [ ] Round-trip snapshot completo.

## Calidad
- [ ] Teclado, touch y screen reader.
- [ ] No remount por cambios visuales.
- [ ] Unit/contract/Playwright/visual regression.
- [ ] Typecheck/lint/build.
- [ ] Documentación y trazabilidad.
