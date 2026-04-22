# `RightSidebar.tsx`

## Propósito

`RightSidebar.tsx` es el contenedor principal del panel derecho del editor. Su estructura actual ya incluye varias vistas: listado de campos, inspector detallado, comentarios y rail de documentos.

## Responsabilidades

- manejar tabs o modos del panel derecho
- decidir qué vista renderizar:
  - outline/listado
  - detalle
  - comentarios
  - documentos
- transmitir contexto de selección
- mantener consistencia visual del inspector
- reutilizar bridges de runtime sin duplicar estado del canvas

## Dependencias cercanas

- `layout.tsx`
- `DetailView/*`
- `ListView/*`
- `CommentsRail.tsx`
- `DocumentsRail.tsx`

## Estado actual del contrato

- `viewMode` ahora contempla `fields`, `detail`, `comments` y `docs`
- la vista `comments` se alimenta desde `Designer/index.tsx` con hilos filtrados por documento/página
- la acción `Agregar` reutiliza `openCommentDialog(...)`, por lo que no existe una segunda fuente de verdad para comentarios

## Qué hace valioso a este archivo

No es solo una sidebar. Es un agregador de superficies de trabajo. Desde aquí se organiza el “segundo nivel de atención” del editor:
- el canvas es el centro
- el panel derecho es el espacio de edición estructural y documental

## Recomendaciones de documentación

Este archivo debería describirse con:
- modo del panel
- política de apertura/cierre
- comportamiento en responsive
- relación con `SelectionContextToolbar`
- estados vacíos cuando no hay selección

## Ejemplo conceptual

```tsx
<RightSidebar
  open={rightSidebarOpen}
  viewMode={viewMode}
  activeSchema={activeSchema}
  onViewModeChange={setViewMode}
  onToggle={() => setRightSidebarOpen((v) => !v)}
/>
```

## Mejoras sugeridas

- documentar mejor el contrato del prop `viewMode`
- separar responsabilidades de layout y contenido
- si se migra a plataforma comercial, renombrarlo a `EditorInspectorShell`
