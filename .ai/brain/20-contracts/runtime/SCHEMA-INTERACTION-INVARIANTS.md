# Schema interaction invariants

1. A visible draft in schema A must survive any interaction with schema B.
2. Local runtime state is updated before host notification.
3. Multi-property schema changes are atomic.
4. `draft` and `commit` are different phases.
5. `touched`, `dirty`, `valid` and `completed` are different states.
6. Host synchronization cannot overwrite a newer local revision with an older echo.
7. `0`, `false`, `[]`, `null`, `undefined` and `""` are not interchangeable.
8. Schema behavior is declared through registry/manifest/codec, not duplicated switches.
9. User/document/session isolation applies to every schema family.
10. Form, Viewer, Snapshot and PDF must agree on normalized values.
