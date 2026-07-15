# Action Map Context — SISAD PDFME

## Regla

Todo botón visible debe estar conectado a una acción. Ningún botón debe existir solo por diseño.

```txt
visible = se renderiza
enabled = puede ejecutarse
handler = función real
reason = por qué está deshabilitado
permission = regla de acceso
feature = capacidad activa
```

## Áreas

- topbar
- left-sidebar
- right-sidebar
- right-list
- detail-view
- canvas-floating-toolbar
- canvas-context-menu
- bottom-toolbar
- runtime-form
- viewer

## Campos mínimos por acción

```ts
type DesignerActionId =
  | 'save'
  | 'open-more-menu'
  | 'toggle-left-sidebar'
  | 'toggle-right-sidebar'
  | 'switch-right-panel-fields'
  | 'switch-right-panel-detail'
  | 'switch-right-panel-comments'
  | 'switch-right-panel-documents'
  | 'select-schema'
  | 'open-properties'
  | 'reassign-recipient'
  | 'duplicate-schema'
  | 'delete-schema'
  | 'add-comment'
  | 'hide-schema'
  | 'show-schema'
  | 'lock-position'
  | 'unlock-position'
  | 'release-edit'
  | 'bring-front'
  | 'send-back'
  | 'toggle-required'
  | 'undo'
  | 'redo'
  | 'zoom-in'
  | 'zoom-out'
  | 'set-zoom'
  | 'fit-page'
  | 'fit-width';
```

## No permitido

- Botón con `onClick={() => {}}`.
- Botón sin `aria-label`.
- Botón sin `data-testid`.
- Botón que modifica schema directamente sin command/update centralizado.
- Botón que depende de recipient local cuando existe RecipientRegistry.
