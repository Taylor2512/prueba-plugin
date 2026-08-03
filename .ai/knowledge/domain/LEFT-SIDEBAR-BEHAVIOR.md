# Left Sidebar Behavior

The left sidebar is the schema catalog. It is not an inspector and should not
carry detail-view logic.

## Responsibilities

- search
- category grouping
- layout switching
- density adaptation
- favorites and recents
- custom field creation
- drag preview
- insert on click / drag / keyboard when configured

## Visual contract

| State | Behavior |
|---|---|
| Expanded docked | Participates in layout and frees canvas space correctly. |
| Collapsed docked | Becomes a rail and no longer reserves the expanded width. |
| Overlay / narrow | Uses the overlay presentation when the viewport requires it. |

## Catalog layout

```ts
CatalogLayout = 'list' | 'tiles' | 'icons'
SidebarDensity = 'comfortable' | 'compact' | 'narrow'
```

Layout and density are independent.

## Active recipient behavior

- The catalog accent follows the active recipient.
- The accent is a creation default, not a recoloring rule for persisted schemas.
- Drag preview and drop placeholder use the same tone as the catalog item.

## Insertion contract

All insertion paths should converge into one command shape:

```txt
insertSchema(type, targetDocument, targetPage, position, activeRecipient)
```

The implementation must:

- generate a schema UID
- resolve document and page
- apply the active recipient as default owner
- persist the owner color
- emit a creation event
- mark the template dirty
- select the new schema

## Code anchors

- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx`

