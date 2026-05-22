# Designer Runtime

El runtime del Designer debe priorizar estabilidad. No reinicialices el editor por cambios menores. Preserva PDF background, selección, zoom, scroll y active document.

## Contrato de colores de destinatario

### Active recipient color

- Fuente de verdad: `resolveRecipientColor(id, recipients)` en `shared/recipientColor.ts`.
- Prioridad: color explícito en el modelo → slot de paleta determinístico → fallback `#6B7280`.
- La paleta tiene 10 colores; para listas más largas los colores se reutilizan en wrapping.
- `resolveAllRecipientColors(recipients)` garantiza unicidad: los slots de paleta no colisionan con colores explícitos.
- CSS variable expuesta en el root del designer: `--active-recipient-color`.

### Schema owner color

- El campo `__designer.recipientColor` (V2) o `__designer.collaboration.recipientColor` (V3) es inmutable tras la creación: cambiar el destinatario activo NO sobreescribe este campo.
- `resolveSchemaTone(schema, fallback)` en `shared/schemaTone.ts` resuelve el color visual de un schema ya creado: `userColor → ownerColor → borderColor → type-tone → fallback`.
- CSS variable expuesta por schema wrapper: `--schema-tone`, `--schema-surface-tone`.

### Catálogo de schemas (LeftSidebar)

- Los iconos del catálogo usan `pluginTone` (= `activeRecipientTone` = `activeRecipientColor`).
- `PluginIcon` recibe `activeRecipientColor` como prop explícita y expone:
  - `data-schema-type` — tipo del schema.
  - `data-active-recipient-color` — color del destinatario activo en el momento del render.
- Cambiar el destinatario activo → re-render del catálogo con nuevos data attributes y color de icono.

### Data attributes estables en canvas

Expuestos por `Renderer.tsx` en cada schema wrapper:

| Atributo | Fuente |
|----------|--------|
| `data-schema-uid` | `__designer.schemaUid` o `schema.id` |
| `data-schema-type` | `schema.type` |
| `data-schema-owner-id` | `__designer.collaboration.recipientId` o `__designer.recipientId` |
| `data-schema-owner-color` | `__designer.collaboration.recipientColor` o `ownerColor`/`userColor` |
| `data-schema-readonly` | `schema.readOnly` |

Expuestos por chips del lab (`PageHeader.jsx`):

| Atributo | Fuente |
|----------|--------|
| `data-recipient-id` | `user.id` |
| `data-recipient-color` | `user.color` (post-decoración) |

### Reglas de mutación de owner

- `schemaOwnerId` y `schemaOwnerColor` solo cambian cuando se ejecuta `schema.assign_recipient`.
- Cambiar `activeRecipient` en el lab o en el designer **no** muta `ownerId`/`ownerColor` de schemas existentes.
- Un nuevo schema creado desde el catálogo hereda `activeRecipient` como owner en ese momento.

## Checklist

- [ ] Respeta aislamiento del fork.
- [ ] No duplica lógica.
- [ ] Mantiene configuración declarativa.
- [ ] Agrega o actualiza tests.
- [ ] Actualiza documentación si cambia contrato.
- [ ] `resolveRecipientColor` — no hardcodear colores en componentes.
- [ ] `data-recipient-color` presente en chips de colaboración.
- [ ] `data-schema-owner-id` / `data-schema-owner-color` presentes en schema wrappers.
