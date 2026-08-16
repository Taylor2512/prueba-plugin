# User assignment contract

A schema assignment answers: **which SISAD-PDFME user(s) may/should interact with this schema?**

Canonical fields:

```ts
type AssignmentMode = 'unassigned' | 'single' | 'multiple' | 'shared';

type SchemaUserAssignment = {
  mode: AssignmentMode;
  assignedUserId?: string | null;
  assignedUserIds?: string[];
};
```

Canonical assignment index:

```text
userId
  -> documentId
      -> pageNumber
          -> schemaUid[]
```

Do not add a second host-actor dimension below `userId`.

Audit identity is separate:
- `createdByUserId`
- `lastModifiedByUserId`
- `lockedByUserId`

Historical `ownerRecipientId`, `ownerRecipientIds` and `recipientId` shapes are
not part of the current core contract. Inputs using them are rejected; current
state uses the canonical assignment representation only.
