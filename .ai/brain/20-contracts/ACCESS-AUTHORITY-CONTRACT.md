# Runtime access authority contract

SISAD-PDFME must have one canonical authority for schema runtime access.

Inputs include:
- active User;
- assignment;
- explicit readonly;
- hidden;
- lock;
- capability;
- document/session context;
- value scope when applicable.

Outputs:

```ts
type SchemaAccessResult = {
  visible: boolean;
  editable: boolean;
  interactive: boolean;
  executable: boolean;
  reason?: string;
};
```

Designer, Form, completion and relevant commands must derive from the same policy/projection.

Do not keep two divergent resolvers where one has no consumers and another governs Preview.

RTP-510 cannot PASS until a `single` assignment proves:
assigned User editable;
other Users not editable according to policy.
