# Source truth

## Priority

```text
live worktree + Git HEAD
> tests/gates actually executed
> task evidence
> canonical Brain contracts/ADRs
> generated context packs/indexes
> historical documentation/transcripts
```

## Rules

- Generated context packs are observations, not permanent truth.
- Do not pin durable product state to a context-pack filename, timestamp or hash.
- Before product work, reconcile branch, HEAD, `git status`, active claims, source and
  nearest tests.
- Task status is not inferred from prose. Use task-card frontmatter plus evidence and the
  dependency graph.
- A handoff can correct stale memory but must not silently override live source/evidence.
- Consumer-specific repositories are not a source of truth for SISAD-PDFME internals.
  They may expose requirements only through generic public contracts.
