# Portable host release gates

A portable release is not declared from unit-test count alone.

## P0 gates

1. Runtime identity isolation: `runtimeSession × user × document`.
2. No sibling rollback or unrelated-value reversion.
3. Single schema access authority across Designer/Form/Viewer.
4. All editable schema families derived from the live registry/manifest.
5. Signature, initials and artifacts isolated by execution scope.
6. Remote data: abort, stale rejection, cache isolation, pagination and cleanup.
7. Invalid production template fails explicitly; no silent default replacement.
8. Snapshot restore preserves semantic equality.
9. Viewer/PDF use canonical state and do not refetch mutable remote values by default.
10. Consumer smoke uses public exports only.
11. Sensitive credentials are host-resolved and never serialized.
12. BrowserContext proof for simultaneous independent users/documents.

## P1 gates

- responsive desktop/tablet/mobile;
- keyboard/touch/IME;
- accessibility and reduced motion;
- performance budgets for large templates;
- memory/object URL/worker cleanup;
- visual regression;
- stable documentation and no consumer-specific canonical context.

## Final barrier

```text
unit
+ integration
+ real browser
+ consumer smoke
+ typecheck
+ lint
+ build
+ boundary audit
+ security
+ dedup/dead-code ratchets
+ docs/links
= portable release
```
