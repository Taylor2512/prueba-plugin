# Schema Behavior Matrix

Each schema family has a minimum contract across Designer, ListView, DetailView,
Form, Viewer, PDF and Snapshot.

## Shared invariants

- stable UID
- stable document/page routing
- stable owner identity and owner color
- stable required/readOnly/lock semantics
- snapshot round-trip compatibility

## Families

| Family | Designer | DetailView | Form / Viewer / PDF |
|---|---|---|---|
| Text-like | Inline preview, selection, rename | content, validation, interaction, geometry | editable in Form, read-only in Viewer/PDF |
| Number | Numeric formatting and validation | range, step, decimals | numeric input in Form, formatted output elsewhere |
| Date / time | Representative preview | format, required, readOnly | locale-aware normalization |
| Select / dropdown | Select chrome only | options, default, validation | interactive in Form, static in Viewer/PDF |
| Checkbox / radio groups | root selectable, options internal | options + behavior | toggle behavior in Form, static in Viewer/PDF |
| Signature / initials / dateSigned | mode-sensitive preview | signature-specific profile | provider-aware behavior in Form, static in Viewer/PDF |
| Attachment | placeholder in Designer | file rules and validation | upload in Form, static in Viewer/PDF |
| Approve / decline / note | action chrome only | action profile | action execution in Form, static in Viewer/PDF |
| Media / shapes / barcode / table | geometry or content preview | family-specific technical settings | read-only rendering contract |

## Option groups

- root schema is selectable
- option nodes are not independent schemas
- `+` inserts a new option, not a new schema
- checkbox groups support multiple checked options
- radio groups support exactly one checked option

## Code anchors

- `src/sisad-pdfme/schemas/schemaFamilies.ts`
- `src/sisad-pdfme/schemas/options/optionGroupFactory.ts`
- `src/sisad-pdfme/schemas/options/optionGroupRenderer.ts`
- `src/sisad-pdfme/schemas/signature/*`

