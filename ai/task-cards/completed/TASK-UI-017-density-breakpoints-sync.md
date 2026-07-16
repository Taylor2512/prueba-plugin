# TASK-UI-017 — Sincronizar breakpoints de densidad y corregir LeftSidebar truncation

**Estado:** active  
**Prioridad:** P2  
**Área:** `sisad-pdfme` / UI / Layout

## Objetivo

Alinear los breakpoints de `useResponsiveDensity` con los anchos reales definidos en `Designer/index.tsx` para evitar que el `LeftSidebar` y otros componentes entren en modo `minimal` de forma prematura o incorrecta, causando truncación de etiquetas y pérdida de iconos.

## Contexto

- `Designer/index.tsx` define anchos dinámicos según `density`:
  - minimal: 180px (Left) / 240px (Right)
  - compact: 200px (Left) / 280px (Right)
  - comfortable: 240px (Left) / 320px (Right)
- `LeftSidebar.tsx` tiene breakpoints excesivamente altos (`minimal: 254`), lo que hace que SIEMPRE se vea como `minimal` (180, 200 y 240 son todos <= 254).
- Esto causa que las etiquetas de las pestañas (`sr-only`) y de los plugins sean siempre las de modo minimal, arruinando la experiencia en modo `compact` y `comfortable`.

## Tareas

- [ ] Corregir breakpoints en `LeftSidebar.tsx` para alinearlos con 180/200/240px.
- [ ] Corregir breakpoints en `RightSidebar.tsx` para alinearlos con 240/280/320px.
- [ ] Auditar e igualar `InspectorPrimitives.tsx` y `DetailHeaderCard.tsx`.
- [ ] Ajustar `LeftSidebarTabs.tsx` para que muestre etiquetas en modo `compact` si hay espacio suficiente (~200px).
- [ ] Validar que `minimal` (180px) oculte etiquetas pero mantenga iconos legibles.

## Reglas

- No tocar Moveable ni geometría del canvas.
- No cambiar los anchos base en `index.tsx` (ya están validados por integración).
- Solo ajustar los *umbrales* de detección en los componentes.

## Validación

- `npm run build`
- Verificación visual de los 3 niveles de densidad en el Designer.
