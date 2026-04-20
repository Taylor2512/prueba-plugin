# `SelectionContextToolbar.tsx`

## Propósito

La toolbar contextual es el punto de control de acciones rápidas sobre selección activa. En la versión actual ya soporta tres modos: `micro`, `compact` y `expanded`, y su modo por defecto depende de `selectionCount`. Para una sola selección tiende a `micro`; para múltiples selecciones, `expanded`. También se apoya en `buildSelectionToolbarModel`, `SelectionCommandSet` e `InteractionState`. fileciteturn19file1turn19file2turn19file3

## Estado actual observable

Los snippets muestran:
- `toolbarMode`
- `defaultToolbarMode`
- `onToolbarModeChange`
- cálculo de `resolvedToolbarMode`
- etiquetas `Compacto`, `Expandir`, `Menos`
- uso de `Loader2` para estados ocupados
- dependencia explícita de `interactionState.phase` y `selectionCount` fileciteturn19file1turn19file2

## Responsabilidades

### 1. Presentar acciones rápidas
No debe contener lógica profunda del negocio, sino exponer el modelo de acciones calculado externamente.

### 2. Adaptarse a la densidad visual
Debe elegir cuánto mostrar según:
- cantidad de elementos seleccionados
- fase de interacción
- contexto del canvas

### 3. Coordinarse con el inspector
La acción “Propiedades” debe considerarse un puente hacia `RightSidebar`, no un sustituto del inspector.

## Modelo recomendado

### Micro
- editar texto
- propiedades
- duplicar

### Compact
- micro +
- bloquear
- eliminar
- requerido

### Expanded
- compact +
- estilo
- alineación
- capas
- visibilidad
- acciones por tipo

## Dependencias

- `canvasContextMenuActions.tsx` para construir el modelo
- `selectionCommands.ts`
- `interactionState.ts`
- `useFloatingToolbarPosition.ts`
- `CanvasOverlayManager.tsx`

## Ejemplo de consumo

```tsx
<SelectionContextToolbar
  position={toolbarPosition}
  commands={selectionCommands}
  activeElements={activeElements}
  activeSchemas={activeSchemas}
  interactionState={interactionState}
  toolbarMode={toolbarMode}
  onToolbarModeChange={setToolbarMode}
/>
```

## Recomendaciones

- Documentar cada comando visible por modo.
- Incluir una matriz “tipo de schema x modo x acciones”.
- Añadir criterio de fallback si el toolbar no cabe en el viewport.
- Si lo comercializas, renómbralo públicamente como `SelectionToolbar` u `EditorQuickActions`.
