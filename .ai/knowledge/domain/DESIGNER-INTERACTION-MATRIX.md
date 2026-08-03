# Designer Interaction Matrix

This matrix describes the designer-side runtime contract.

## Selection

- click replaces selection
- modifier click toggles selection
- click on empty space clears selection
- region selection respects the current access policy
- locked schemas remain selectable and inspectable

## Transformations

Mutations must go through policy + command bus:

- move
- resize
- rotate
- duplicate
- delete
- copy / paste
- align / distribute

## Overlay / chrome rules

- contextual overlays must avoid colliding with nearby schemas
- safe-area guides must not dominate the document
- zoom controls must remain visible and reachable
- sidebar toggles must preserve paper anchor, selection, page and zoom

## Multi-document and multi-page

- schema identity must preserve `schemaUid`
- document routing must preserve `documentId`
- page routing must preserve `pageNumber`
- assignment and locking must remain stable across page switches

## Sidebars

- opening/closing sidebars should not reset selection or scroll
- the left sidebar must release width when collapsed
- the right sidebar can change presentation without remounting the designer

## Code anchors

- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/Paper.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*`

