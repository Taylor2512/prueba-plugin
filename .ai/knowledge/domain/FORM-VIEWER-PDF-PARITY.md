# Form / Viewer / PDF Parity

The same schema must render consistently across runtime surfaces.

## Parity rules

- Form is interactive.
- Viewer is read-only.
- PDF is static output.
- Snapshot is the persisted source for runtime consistency.

## Ownership and access

- owner color must stay stable across runtime surfaces
- locked schemas can remain visible and inspectable
- readOnly values are not editable in Form
- runtime viewer cannot mutate schema state

## Family-specific notes

- `dateSigned` is automatic and read-only
- signature fields depend on the selected mode
- attachment fields upload only in Form
- action schemas execute through events/commands, not inline rendering logic
- notes are informational, not comments
- approve/decline preserve semantic color and owner accent separately

## Normalization

Date and time values must be normalized before leaving Form and before
generating Snapshot/PDF output.

## Code anchors

- `src/sisad-pdfme/ui/components/Renderer.tsx`
- `src/sisad-pdfme/ui/components/Preview.tsx`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/common/schema.ts`

