# Architecture: Modular Action System

## Capas del sistema

```
Presentación    → inspector, sidebar, menús, modales, overlays
Aplicación      → commandos, servicios, orquestación (actionRegistry, CommandBus)
Dominio         → Schema, PdfComment, reglas de ownership / validación
Infraestructura → persistencia, fetch/API, adapters, collaboration runtime
```

Regla: **no mezclar** lógica de negocio dentro de componentes visuales.
Si la lógica puede extraerse a un servicio o comando, debe hacerlo.

---

## Action Registry

**Archivo**: `src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts`

### Tipo `SchemaActionDefinition`

```typescript
type SchemaActionDefinition = {
  id: string;
  label: string;
  section?: string;                            // 'structure' | 'state' | 'data' | 'style' | 'collaboration' | 'comments' | 'order'
  priority?: 'primary' | 'secondary' | 'danger';
  presentationMode?: ActionPresentationMode;   // ver tabla en ui-ux-compact.instructions.md
  supportsSchemaTypes?: string[];              // e.g. ['text', 'multivariabletext']
  requiresLock?: boolean;
  requiresConfirmation?: boolean;
  isVisible?: (context: ActionContext) => boolean;
  isEnabled?: (context: ActionContext) => boolean;
  execute?: (context: ActionContext) => void;
};
```

### API

```typescript
registerAction(def)          // registra o reemplaza
registerActions(defs[])      // lote
getAction(id)                // lookup por id
getActions(filter?)          // todos con filtro opcional
getActionsForContext(ctx, filter?) // visible + ordenados por prioridad
unregisterAction(id)         // eliminar
clearActionRegistry()        // solo para tests
```

---

## Schema Families

**Archivo**: `src/sisad-pdfme/schemas/schemaFamilies.ts`

Las familias agrupan tipos de schema que comparten secciones del inspector:

| Familia        | Tipos incluidos                              |
|----------------|----------------------------------------------|
| `text`         | text, multivariabletext, select, date, signature |
| `boolean`      | checkbox, radiogroup                         |
| `mediaVisual`  | image, svg                                   |
| `shapeBarcode` | line, rectangle, ellipse, qrcode, ean13, …   |
| `table`        | table                                        |

Cada familia declara:
- `visibleSections` → secciones del inspector que aplican
- `supportedActions` → acciones declaradas
- `supportsConnections`, `supportsCollaboration`, `supportsComments`

---

## Command Pattern (CommandBus)

Las operaciones del editor usan el patrón Command para soporte de undo/redo.

```
src/sisad-pdfme/ui/commands/
```

### Acciones registradas en el registry que también tienen un Command:
- `duplicate` → `DuplicateSelectionCommand`
- `delete` → `DeleteSelectionCommand`
- `toggleRequired` → `ToggleRequiredCommand`

---

## Estrategia para configuraciones complejas

| Widget                       | Estrategia                         |
|------------------------------|------------------------------------|
| `SchemaConnectionsWidget`    | `CompactConfigPanel` → modal       |
| `SchemaCollaborationWidget`  | `CompactConfigPanel` → modal       |
| `SchemaFieldCommentsWidget`  | Rail lateral + modal de comentario |

**Regla**: si el widget tiene más de 3 controles inline, moverlos a un modal
accesible desde un botón "Configurar" o "Gestionar".

---

## Progressive Disclosure en el inspector

### Secciones por visibilidad

1. **Siempre visibles**: General, Layout, Data
2. **Colapsadas por defecto**: Style, Validation
3. **Abrirse en modal/drawer**: Connections, Collaboration, Advanced

### DetailHeaderCard

El header del inspector sigue estas reglas:
- Máximo **3 tags** de estado inline.
- Resto de metadatos (UID, owner, etc.) en tooltip del badge `+N` / `···`.
- Posición X,Y mostrada compactamente en la fila de identidad.
- **No agregar** más filas de tags al header.

---

## Copilot / Codex Guidelines

1. **No duplicar** widgets ya existentes (`CompactConfigPanel`, `DetailHeaderCard`, etc.).
2. **No duplicar** lógica de acciones — usar `actionRegistry` como fuente de verdad.
3. Preferir **composición** sobre condicionales gigantes.
4. Preferir **metadata declarativa** por plugin/familia.
5. Mover **configuraciones complejas a modales** — no inline en sidebar.
6. Mantener el **sidebar limpio**: resumen corto + botón de acción.
7. Usar siempre **tokens CSS** de `tokens.css` para colores, spacing, sombras.
8. Los nuevos actions deben llamar a `registerAction()` — no hardcodear en los
   menús contextuales o toolbars.
