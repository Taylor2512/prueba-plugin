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

Legacy `ownerRecipientId`, `ownerRecipientIds` and `recipientId` may be read by migrations,
but new core state should not write them once the compatibility gate is complete.
