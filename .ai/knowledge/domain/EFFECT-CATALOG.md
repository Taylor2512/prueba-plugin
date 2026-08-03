# Effect Catalog

Effects are the DOM / host-facing side of the architecture. They should not
decide business policy.

## Core effects

- focus a schema
- scroll to a schema
- open a detail panel
- restore focus after a modal closes
- show success or error feedback
- persist to host or storage
- export a document artifact
- notify the host of a change

## Safety rules

- avoid `setTimeout` as lifecycle coordination
- avoid arbitrary `z-index` fixes when collision detection is possible
- avoid mutating schema state from effects that only need DOM feedback
- keep modal, drag and sidebar effects isolated from command logic

## Common sources

- selection changes
- sidebar collapse/expand
- drag start / drop / cancel
- save and export lifecycle
- recipient change
- document change

## Code anchors

- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SchemaAssignmentDialog.tsx`

