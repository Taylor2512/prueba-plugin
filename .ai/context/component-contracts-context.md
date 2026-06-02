# Contexto — Contratos por componente

## Designer

Orquesta estado; no duplica lógica de Canvas, Snapshot, Form o host.

## Canvas/Page stack

Fuente de zoom, scroll, paper refs y page gap estable.

## Renderer

Wrapper root único por schema con `data-schema-id`. Hijos internos usan `data-option-id` o `data-field-part`.

## Moveable

Transforma schemas seleccionados. No compite con Selecto.

## Selecto

Selecciona roots de schemas. Ignora toolbar, botones, options internas e inputs.

## SelectionContextToolbar

Acciones según selección: single, multi, schemaGroup. No mezcla selectionGroup con schemaGroup.

## DetailView

Inspector específico por tipo. Avanzado colapsado para IDs y metadata técnica.

## ListView

Muestra jerarquía y tipo legible, no tipos crudos.

## Schema plugins

Cada schema tiene Designer, DetailView, Form, Viewer, PDF, snapshot y tests.

## SnapshotAdapter

Preserva identidad, owner, grupos, opciones y valores.
