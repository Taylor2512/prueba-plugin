# Form runtime isolation

Mutable Form state is scoped by:

```text
runtimeSession
  x user
  x document
```

The host owns the meaning of the runtime session identifier. SISAD-PDFME treats it as opaque.

State that must never leak between scopes:
- inputs/drafts;
- touched/dirty/validation;
- signatures/initials;
- artifacts/attachments;
- transient action state;
- focus/editing state where persisted by runtime;
- completion projections.

In multi-user Form mode, `activeUserId` must be explicit or the runtime must fail closed.
Do not silently select the first configured user for an execution surface.
