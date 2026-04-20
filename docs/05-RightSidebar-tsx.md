# `RightSidebar.tsx`

## Propósito

`RightSidebar.tsx` es el contenedor principal del panel derecho del editor. Su estructura actual ya incluye varias vistas: listado de campos, inspector detallado y rail de documentos. El árbol de componentes confirma que existe una jerarquía completa para `RightSidebar`, `DetailView`, `ListView`, `DocumentsRail` y layouts específicos. fileciteturn19file12turn19file7

## Responsabilidades

- manejar tabs o modos del panel derecho
- decidir qué vista renderizar:
  - outline/listado
  - detalle
  - documentos
- transmitir contexto de selección
- mantener consistencia visual del inspector

## Dependencias cercanas

- `layout.tsx`
- `DetailView/*`
- `ListView/*`
- `DocumentsRail.tsx`

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
