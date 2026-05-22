# Contexto — recipient colors, schema icon sync y transform controls

## Problema a resolver

El fork requiere robustecer tres comportamientos relacionados:

1. Cada usuario o destinatario de pruebas debe tener un color único y legible.
2. Al cambiar el destinatario activo, los iconos del catálogo de schemas deben cambiar al color del destinatario activo.
3. Al seleccionar un schema, debe ser posible modificar tamaño, posición y rotación sin colisionar con otros comportamientos existentes.

## Zonas del código a revisar

- `src/sisad-pdfme/context/RecipientContext.ts`
- `src/sisad-pdfme/common/collaboration.ts`
- `src/sisad-pdfme/ui/collaboration.ts`
- `src/sisad-pdfme/ui/collaborationContext.ts`
- `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts`
- `tests/playwright/multiuser-collaboration.spec.ts`
- `tests/playwright/canvas-interactions.spec.ts`
- `tests/playwright/shortcuts.spec.ts`

## Comportamiento esperado

### Color activo

- `activeRecipientColor` cambia cuando cambia `activeRecipientId`.
- El catálogo de schemas se actualiza inmediatamente.
- Los iconos y fallback icons leen `--schema-owner-color` o `--active-recipient-color`.

### Color persistido en schemas

- Un schema creado con destinatario A mantiene color A.
- Al cambiar al destinatario B, el catálogo cambia a color B.
- Los schemas existentes de A no cambian a B.

### Transform controls

- Seleccionar un schema permite resize y rotación.
- Resize no dispara selección múltiple accidental.
- Rotate no dispara inline edit.
- Drag no abre context menu.
- El toolbar flotante se recalcula con zoom/scroll/rotate.
