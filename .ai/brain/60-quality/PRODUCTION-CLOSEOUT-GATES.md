# Production closeout gates

P0:
- RTP-510 real multi-user;
- RTP-515 all-schema;
- access authority single;
- no sibling rollback;
- signature/initials isolation;
- remote option lifecycle;
- snapshot/PDF deterministic.

Visual:
- VISUX-023..042 reconciled;
- capability-driven DetailView;
- no product-facing Recipient/Axios/debug leakage;
- Designer/Form/Viewer parity.

Quality:
- project-owned TSC errors = 0;
- lint/build PASS;
- unit/integration/E2E PASS;
- BrowserContexts PASS;
- memory/performance/a11y PASS;
- security/no secrets PASS;
- direct config readers = 0;
- dead/duplicate/cycle ratchets not worse;
- no unstable persistent path names.

Operational:
- no active write claims;
- no unresolved merge/index state;
- current/handoff/ledger/evidence consistent.
