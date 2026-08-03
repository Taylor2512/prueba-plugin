# DetailView Profiles

The detail inspector should expose only the sections relevant to the current
schema family.

## Canonical taxonomy

- identity
- content
- options
- validation
- fileRules
- signature
- action
- behavior
- box
- appearance
- dataBindings
- comments
- collaboration
- advanced

## Section rules

- `required` belongs in validation
- `readOnly` belongs in behavior / interaction
- owner / lock belongs in collaboration
- geometry belongs in box
- file restrictions belong in fileRules
- technical identifiers belong in advanced

## Family examples

| Family | Typical sections |
|---|---|
| Text-like | identity, content, validation, behavior, box, appearance, dataBindings, collaboration |
| Choice | identity, options, validation, behavior, box, appearance, collaboration |
| Signature | identity, signature, behavior, box, appearance, dataBindings, collaboration, advanced |
| Attachment | identity, fileRules, validation, behavior, box, appearance, collaboration |
| Action schemas | identity, action, behavior, box, appearance, collaboration |
| Visual schemas | identity, box, appearance, collaboration, advanced |

## Contract

Every visible control must have:

- `propertyPath`
- read/write semantics
- visibility predicate
- disabled predicate
- persistence path

## Code anchors

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx`

