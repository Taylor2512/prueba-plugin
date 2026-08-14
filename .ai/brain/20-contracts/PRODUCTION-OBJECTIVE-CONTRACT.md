# Production objective contract

The campaign succeeds only when all of the following are true:

- no unresolved local P0/P1;
- RTP release gates PASS with evidence;
- VISUX release gates PASS with evidence;
- all registered editable schemas have Form tests;
- all visual/computed schemas have parity tests;
- multi-user/multi-document isolation proven in browser;
- no sibling rollback;
- dynamic config/capability authority is singular;
- no direct product coupling to Axios or a concrete signature provider;
- snapshot/PDF deterministic without remote refetch;
- no sensitive secret persisted;
- no module-level mutable state that crosses instances;
- project-owned TypeScript errors reach zero, or the release is explicitly blocked;
- dead-code/duplicate/cycle ratchets do not regress;
- final Brain/current/handoff generated from live source/evidence.

"Lots of green unit tests" is not sufficient.
