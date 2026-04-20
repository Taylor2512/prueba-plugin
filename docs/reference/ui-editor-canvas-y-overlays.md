# Editor UI, canvas, sidebars y overlays

## Panorama

La capa UI de SISAD PDFME no es un simple wrapper de render; es un editor visual completo con:

- stage principal con grid y rulers;
- canvas con selección, moveable y snap;
- toolbar superior;
- catálogo izquierdo de campos;
- inspector/lista/docs a la derecha;
- overlays contextuales;
- runtime API del diseñador;
- soporte para edición inline y colaboración.

## `Designer.tsx` y `components/Designer/index.tsx`

La vista principal del editor hace de orquestador. Entre sus responsabilidades visibles están:

- montar `Renderer`, `Canvas`, sidebars y control bar;
- convertir entre template y `schemasList`;
- controlar drag-and-drop de inserción;
- resolver zoom y page scroll;
- conectar `selectionCommands`;
- aplicar engine, identity hooks y defaults;
- gestionar documentos cargados;
- sincronizar estado de interacción.

La importación observada muestra dependencias de:

- `@sisad-pdfme/common`
- `@sisad-pdfme/converter`
- `Renderer`
- `PluginIcon`
- `RightSidebar`
- `LeftSidebar`
- `Canvas`
- `createSelectionCommands`
- `resolveDesignerEngine`
- `attachSchemaIdentity`
- `applySchemaCreationHook`
- `applySchemaCollaborativeDefaults`
- colaboración (`applyCollaborationEvent`, `useCollaborationSync`) en la versión más reciente.

## Control bar (`CtlBar`)

El toolbar superior actúa como centro de navegación global. Debe ser documentado como la zona donde vive:

- undo/redo;
- navegación de página;
- zoom;
- fit;
- acciones generales de documento;
- toggles de presentación.

## Canvas

### Subcomponentes

- `Canvas.tsx`
- `Guides.tsx`
- `Moveable.tsx`
- `Selecto.tsx`
- `Padding.tsx`
- `SnapLines.tsx`
- `Mask.tsx`

### Función de cada pieza

#### Guides
Rulers y guías visuales para alineación.

#### Moveable
Redimensionado, drag y rotación del elemento activo.

#### Selecto
Selección simple o múltiple.

#### Padding
Representación de márgenes internos y área útil.

#### SnapLines
Líneas auxiliares de ajuste entre elementos y centros.

#### Mask
Capa de bloqueo/estado no interactivo.

## Overlays

El editor moderno se apoya en overlays para evitar sobrecargar sidebars.

### `CanvasOverlayManager`
Coordina la presencia simultánea de overlays y resuelve su orden visual.

### `SelectionContextToolbar`
Toolbar flotante contextual del elemento seleccionado. Debería documentarse con sus modos:

- micro;
- compact;
- expanded.

### `InlineEditOverlay`
Permite editar texto/label sin romper el flujo del canvas.

### `InlineMetricsOverlay`
Muestra dimensiones rápidas del elemento.

### `SnapFeedbackOverlay`
Refuerza visualmente alineación y ajuste.

### `CanvasContextMenu`
Menú secundario contextual.

## Sidebar izquierdo

### Componentes

- `LeftSidebar.tsx`
- `LeftSidebarTabs.tsx`
- `LeftSidebarSearch.tsx`
- `LeftSidebarGroup.tsx`
- `LeftSidebarCustomPanel.tsx`
- `LeftSidebarCustomFieldModal.tsx`
- `useLeftSidebarCatalogState.ts`

### Responsabilidades

- explorar plugins disponibles;
- buscar por tipo/categoría;
- mostrar favoritos y recientes;
- administrar campos personalizados;
- ofrecer inserción por click/drag.

### Mejores prácticas UI

1. solo una categoría abierta por defecto;
2. metadata secundaria en hover;
3. modo compacto para pantallas estrechas;
4. secciones diferenciadas entre catálogo y custom fields.

## Sidebar derecho

### `RightSidebar.tsx`
Contenedor principal del panel derecho.

### Modos principales
- **detail**: inspector del schema activo;
- **list**: outline/lista de campos;
- **docs**: rail de documentos.

## DetailView

### `DetailView.tsx`
Puente entre schema activo, form-render y widgets declarativos.

### `DetailViewContent.tsx`
Organiza secciones:

- General
- Estilo
- Layout
- Datos
- Validación
- Avanzado

Además muestra context chips según config activa:
- Guardar
- API
- Form JSON
- Prefill

### `DetailSectionCard.tsx`
Sección colapsable; las pruebas unitarias confirman que resetea estado cuando cambia el schema.

### `detailSchemas.ts`
Construye el schema declarativo del inspector.

### `detailWidgets.tsx`
Registra widgets especializados.

## ListView

### Componentes

- `ListView.tsx`
- `Item.tsx`
- `ListViewToolbar.tsx`
- `ListViewFooter.tsx`
- `ListViewDragOverlay.tsx`
- `SelectableSortableContainer.tsx`
- `SelectableSortableItem.tsx`

### Función
- outline de elementos;
- reordenamiento;
- selección desde lista;
- acciones rápidas;
- manejo de listas largas.

## DocumentsRail

Muestra documentos cargados y contexto de archivo/página. Es clave en flujos multi-documento.

## Ejemplo de uso del diseñador

```tsx
import React, { useMemo } from 'react';
import { Designer, DesignerEngineBuilder } from '@sisad-pdfme/ui';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';

export default function DemoEditor() {
  const engine = useMemo(
    () =>
      new DesignerEngineBuilder()
        .withCanvasFeatureToggles({
          guides: true,
          selecto: true,
          moveable: true,
          snapLines: true,
          padding: true,
          mask: false,
        })
        .build(),
    [],
  );

  return (
    <Designer
      plugins={builtInSchemaDefinitions}
      options={{ designerEngine: engine }}
      template={{ basePdf: '', schemas: [[]] }}
    />
  );
}
```

## Recomendaciones de documentación de UI

- documentar estado y responsabilidades de cada overlay;
- documentar `selectionCommands`;
- incluir diagramas de flujo del editor;
- explicar claramente qué se resuelve en canvas y qué en sidebars;
- registrar diferencias entre modo edición, visualización y runtime de formulario.
