# User model migration analysis

Target:

```text
Host participant
      |
      | adapter
      v
SisadPdfmeUser
      |
      +-- activeUser
      +-- assignedUser(s)
      +-- auditUser
```

Migration is compatibility-first, not a mass rename.

Stages:
1. characterize Recipient-named public/internal behavior;
2. add `SisadPdfmeUser`;
3. add `users` + `activeUserId`;
4. accept legacy `recipients` + `activeRecipientId` at the public boundary;
5. canonicalize immediately after normalization;
6. migrate registry/access/appearance/assignments;
7. migrate snapshots with explicit version adapters;
8. deprecate legacy aliases only after consumer-contract tests pass.
