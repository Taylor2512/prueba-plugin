# Contrato por componente

## Designer

Orquesta estado del editor. No debe duplicar Canvas, Snapshot ni Form/Viewer.

## Canvas/Page stack

Dueño de zoom, scroll, pageGap, paper refs y overlays absolutos. Page stack no cambia por altura de schemas.

## Renderer

Cada schema tiene un root seleccionable con `data-schema-id`. Elementos internos no deben parecer schemas.

## Moveable

Transforma roots seleccionados. Debe limpiar estado al finalizar.

## Selecto

Selecciona roots. Ignora toolbar, buttons, options internas e inputs.

## DetailView

Inspector por tipo/selección. No muestra metadata técnica por defecto.

## ListView

Lista campos con jerarquía y nombres legibles. Grupos no deben verse como tipos crudos.

## Schema plugins

Deben cubrir Designer, DetailView, Form, Viewer, PDF y Snapshot.

## CommandBus

Toda mutación significativa pasa por command bus para undo/redo.
