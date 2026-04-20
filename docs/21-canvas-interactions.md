# Canvas, overlays e interacciones

## 1. Rol del canvas

El canvas es el centro operativo del editor. Todo lo demás debe ayudarlo, no competir con él. La arquitectura actual ya sigue esa dirección gracias a:

- `Canvas`
- `Moveable`
- `Selecto`
- `SnapLines`
- `Guides`
- `Padding`
- `CanvasOverlayManager`
- `SelectionContextToolbar`
- `InlineMetricsOverlay`
- `SnapFeedbackOverlay`
- `InlineEditOverlay`

## 2. Flujo principal de interacción

El ciclo más importante del usuario es:

1. inserta un schema desde catálogo
2. lo selecciona
3. lo mueve o redimensiona
4. usa toolbar contextual
5. edita texto inline
6. ajusta detalle en el inspector
7. valida preview

La arquitectura del canvas debe estar optimizada para ese flujo, no para exponer demasiados paneles simultáneos.

## 3. `CanvasOverlayManager`

`CanvasOverlayManager` ya funciona como un agregador de overlays. Calcula:

- schemas activos a partir de elementos seleccionados
- modo del toolbar
- bounds de selección
- render condicional de snap lines

Además, en la versión actual ya memoriza mejor el cálculo y sincroniza el toolbar mode con `selectionCount`.

### Responsabilidades actuales

- decidir `micro`, `compact`, `expanded`
- pasar `interactionState`
- pasar `selectionCommands`
- combinar overlays sin que cada uno replique búsqueda de selección

### Ejemplo simplificado

```tsx
<CanvasOverlayManager
  activeElements={activeElements}
  schemasList={schemasList}
  pageCursor={pageCursor}
  pageSize={pageSize}
  snapLines={snapLines}
  SnapLinesSlot={SnapLines}
  selectionCommands={selectionCommands}
  interactionState={interactionState}
  featureSnapLines={featureSnapLines}
/>
```

## 4. `SelectionContextToolbar`

La toolbar contextual ya evolucionó a 3 niveles:
- micro
- compact
- expanded

Ese cambio es importante porque reduce fatiga visual y aproxima la experiencia a herramientas tipo DocuSign/Figma/Wix.

### Reglas recomendadas por modo

#### micro
- editar
- propiedades
- duplicar

#### compact
- micro +
- ocultar/mostrar
- bloquear
- eliminar

#### expanded
- compact +
- acciones de alineación
- distribución
- acciones por grupo
- shortcuts avanzados

### Recomendación
Mantener la lógica de construcción del modelo en un archivo aparte, como ya hace `canvasContextMenuActions`, fue una buena decisión. Conviene seguir separando:
- modelado de acciones
- render visual
- routing de comandos

## 5. `useFloatingToolbarPosition` y geometry

Esta pieza es crítica porque evita que el toolbar tape la selección. El sistema actual calcula bounds desde el DOM del canvas y resuelve una posición segura según viewport, tamaño del toolbar y número de elementos seleccionados.

### Principios correctos ya presentes

- si hay varios elementos, centrar respecto al grupo
- si hay un solo elemento, usar una posición más cercana al schema
- trabajar con bounds relativos al canvas
- usar superficie con tamaño conocido

### Recomendación
No mezclar reglas de geometry en la toolbar ni en el canvas. Toda decisión geométrica debería quedarse en:
- `useFloatingToolbarPosition`
- `floatingSurfaceGeometry`

## 6. `InlineMetricsOverlay`

Muestra tamaño en píxeles del área seleccionada. Su valor es alto durante resize o transform, pero menor en reposo.

### Mejora recomendada
Conservarlo, pero hacerlo más contextual:
- visible durante resize
- visible por breve tiempo tras mover
- menos prioritario que toolbar y snap

## 7. `SnapFeedbackOverlay`

Este overlay ayuda a ver alineación y cercanía. Debe sentirse informativo, no ruidoso.

### Regla de UX
Solo mostrar feedback de snap cuando:
- hay línea activa
- el movimiento sigue en curso
- la información aporta claridad real

## 8. `InlineEditOverlay`

Esta pieza resuelve uno de los puntos más importantes de la evolución del producto: eliminar `window.prompt` y quedarse dentro del canvas.

### Comportamiento deseado

- doble click inicia edición
- Enter confirma
- Escape cancela
- blur resuelve según estrategia segura
- la toolbar contextual debe ocultarse o pasar a estado pasivo
- drag/resize deben suspenderse mientras se edita

### Ejemplo conceptual

```tsx
{editing ? (
  <InlineEditOverlay
    schema={activeSchema}
    initialValue={activeSchema.content}
    onCommit={(nextValue) => updateSchemaContent(activeSchema.id, nextValue)}
    onCancel={() => setEditing(false)}
  />
) : null}
```

## 9. `interactionState`

El canvas ya usa `interactionState` para decidir visibilidad y densidad de overlays. Esa es una muy buena base.

### Lo ideal
Tener un estado finito y legible:
- idle
- selecting
- dragging
- resizing
- rotating
- editing
- context-menu

Así cada overlay puede decidir con claridad cuándo mostrarse.

## 10. `selectionCommands`

Los overlays no deberían mutar schemas directamente. El patrón de command set es correcto porque desacopla:
- UI del canvas
- lógica de mutación
- shortcuts
- context menu
- toolbar

### Recomendación
Documentar mejor cada comando con:
- precondiciones
- efectos
- side effects
- pruebas mínimas

## 11. Buenas prácticas para no sobrecargar el canvas

1. el toolbar no debe estar siempre grande
2. las métricas no deben estar siempre visibles
3. el snap no debe competir con la selección
4. edición inline debe reemplazar modales nativos
5. el canvas siempre debe respirar más que los paneles

## 12. Checklist para cambios en canvas

- ¿Se añadió geometry duplicada?
- ¿Se rompió el layering de overlays?
- ¿La toolbar tapa elementos pequeños?
- ¿Se respeta `interactionState`?
- ¿El canvas sigue usable con sidebars abiertos?
- ¿Existen pruebas para edición inline o toolbar mode?

## 13. Resumen operativo

El canvas actual ya está bien encaminado. Las mejores mejoras futuras no consisten en agregar más overlays, sino en:
- orquestarlos mejor
- reducir solapamiento
- dar más protagonismo al área editable
- sostener edición inline como flujo principal
