# User / Recipient Use Cases

This document is the canonical collaboration matrix for `sisad-pdfme`.
It extends the existing knowledge graph. It does not create a parallel
architecture.

## Core rule

The active recipient controls the catalog, the default owner for new schemas
and drag/drop affordances. It does not recolor schemas that already have
persisted ownership metadata.

## Cases

| Case | Expected behavior |
|---|---|
| No recipients configured | Designer works as single-user mode. The catalog stays available. No recipient selector, no reassignment dialog, and ownership chrome can fall back to neutral. |
| One assignable recipient | New schemas are assigned to that recipient automatically. Reassign stays hidden. The catalog reflects that recipient. |
| Two or more assignable recipients | The active recipient drives the catalog color and default owner for new schemas. Existing schemas keep their stored owner color. |
| Change active recipient | Update the catalog accent, drag preview, drop placeholder and default recipient for new insertions. Do not mutate existing schema ownership, selection, page, scroll or zoom. |
| Global view | Show all schemas. Preserve each schema owner color. |
| Recipient-scoped view | Highlight or filter by the active recipient according to configuration. Do not auto-reassign on view change. |

## Ownership states

| State | Meaning | Editable in Designer |
|---|---|---|
| `ownerRecipientId` | Persistent owner identity | yes, via assignment flow |
| `readOnly` | Runtime editing restriction | no for value edits, schema may still be inspectable |
| `locked` | Structural restriction | no for move/resize/delete/duplicate |
| `hidden` | Visibility policy | no, if hidden by policy |
| runtime viewer | Global read-only runtime | no |

## Reassignment contract

- `0` assignable recipients: hidden.
- `1` assignable recipient: hidden.
- `2+` assignable recipients and a non-empty selection: visible.
- `2+` assignable recipients and no selection: visible but disabled or hidden depending on toolbar policy.
- No structural permission: visible only if the design needs affordance, otherwise disabled with a reason.
- No modal handler: disabled with a technical reason.

## Code anchors

- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/reassignActionState.ts`
- `src/sisad-pdfme/ui/collaborationContext.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService.ts`

