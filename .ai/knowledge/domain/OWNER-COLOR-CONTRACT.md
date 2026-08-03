# Owner Color Contract

The owner color is the persistent collaboration tone of a schema. The semantic
color is the content or action tone. They are separate.

## Priority

The persistent owner tone should be resolved from stored schema metadata first.

1. `schema.ownerColor`
2. `schema.userColor`
3. `schema.recipientColor`
4. `schema.__designer.collaboration.recipientColor`
5. `schema.__designer.ownerColor`
6. `schema.__designer.recipientColor`
7. recipient registry color
8. explicit neutral fallback

## Active recipient color

The active recipient color is a creation-time and catalog-time affordance.
It can be used for:

- LeftSidebar catalog items
- drag preview
- drop placeholder
- new schema default owner color
- reassignment modal defaults

It must not recolor an already persisted schema just because the active
recipient changed.

## Semantic colors

| Semantic tone | Meaning |
|---|---|
| Green | approve / success |
| Red | decline / danger |
| Yellow | note / informative |
| Blue | neutral text-like family tone |
| Purple / teal / other family tones | family-specific preview, not ownership |

## Surface contract

| Surface | Uses owner tone | Uses semantic tone |
|---|---|---|
| LeftSidebar catalog | no, uses active recipient tone | yes for family previews if needed |
| Canvas | yes | yes |
| ListView | yes | yes for status badges |
| DetailHeader | yes | yes for status |
| DetailView | yes for collaboration widgets | yes where family applies |
| Form | yes | yes |
| Viewer / PDF | yes | yes |
| Snapshot | yes | yes |

## Code anchors

- `src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts`
- `src/sisad-pdfme/schemas/shared/fieldChrome.ts`

