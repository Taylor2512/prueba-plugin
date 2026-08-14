# Multi-user Form release contract

RTP-510 is the functional P0 gate.

Required real-browser evidence:

```text
User Alice:
  Alice field editable
  Bob field not editable

User Bob:
  Bob field editable
  Alice field not editable
```

Additionally:
- switch Alice -> Bob -> Alice preserves independent values;
- stale events from previous User are rejected;
- D1 and D2 do not contaminate;
- two Forms same JS realm do not share mutable state;
- two BrowserContexts are isolated;
- signature/initials/artifacts are isolated;
- touched/dirty/valid/completed observable and correct;
- sibling interactions do not rollback accepted values.

Unit tests alone cannot close this contract.
