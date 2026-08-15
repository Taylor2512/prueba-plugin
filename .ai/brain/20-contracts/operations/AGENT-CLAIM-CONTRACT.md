# Agent claim contract

Claim record:

```ts
type AgentClaim = {
  agent: 'claude' | 'codex' | 'copilot' | string;
  task: string;
  mode: 'write' | 'review';
  paths: string[];
  startedAt: string;
  note?: string;
};
```

Claims live in `.ai/ops/coordination/claims.json`.

The helper script serializes changes to the registry with a filesystem lock.

A writer:
1. claims;
2. re-reads the claimed files;
3. edits;
4. runs focal gates;
5. writes evidence/handoff;
6. releases.

Never treat a stale diff as permission to overwrite it.
