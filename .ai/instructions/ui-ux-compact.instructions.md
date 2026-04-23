# UI UX Compact Instructions

## Objetivo
Aplicar una experiencia compacta inspirada en Wix, Figma y editores modernos.

## Principios
- menos paneles visibles por defecto
- más acciones contextuales
- menos texto, más jerarquía visual
- más espacio para el canvas
- opciones avanzadas bajo demanda

## Aplicación práctica
- usar rail izquierdo angosto
- abrir drawers por acción
- mostrar propiedades según selección
- agrupar controles secundarios en menus o drawers
- mover resultados técnicos a panel inferior

---

## Action Registry (`actionRegistry.ts`)

Todas las acciones del diseñador están registradas en:
`src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts`

### Cuándo usar modal vs inline vs contextMenu

| `presentationMode` | Cuándo usar |
|--------------------|-------------|
| `inline`           | Acción instantánea (duplicar, alinear) |
| `popover`          | Config pequeña con 1–3 campos |
| `modal`            | Config compleja: conexiones, colaboración |
| `drawer`           | Config extensa que requiere espacio lateral |
| `contextMenu`      | Acciones secundarias del clic derecho |
| `hidden`           | Registrada pero no renderizada automáticamente |

### Reglas de implementación
- **No duplicar** la definición de acciones en múltiples toolbars/menús.
  Registrar en el registry y leer desde allí.
- Acciones con `presentationMode: 'modal'` **no deben** renderizarse inline
  en el inspector; en su lugar mostrar un botón compacto que abre el modal.
- Acciones `primary` visibles siempre en toolbar.
  Acciones `secondary` y `danger` dentro de "Más" o menú contextual.

## DetailHeaderCard

El `DetailHeaderCard` sigue el principio de **progressive disclosure**:

1. **Fila identidad**: nombre + tipo badge + posición compacta.
2. **Fila estado**: máximo 3 tags inline (Requerido, Solo lectura, Oculto, config activa).
3. **Overflow badge**: `+N` o `···` — al hacer hover muestra tooltip con todos los metadatos
   (UID, createdBy, lastModifiedBy, owner, estado, etc.).

**No agregar** más filas de tags al header. Toda metadata adicional va en el tooltip.

## Inspector: progressive disclosure

- `Connections`, `Collaboration` → abrirse con `CompactConfigPanel` → botón "Configurar" → modal.
- No saturar el sidebar con toggles inline si el contenido es extenso.
- El inspector muestra resumen corto + botón de acción, no el formulario completo.

## CSS

- Usar tokens de `tokens.css` en lugar de valores hardcodeados.
- Clases de estado: `is-overflow`, `is-active`, `is-danger` como modificadores.
- No duplicar estilos entre `sisad-pdfme-global.css` y otros archivos CSS del módulo.

