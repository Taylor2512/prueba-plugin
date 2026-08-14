# ADR RTP-016 — Same branch multi-agent coordination

Decision:
Claude, Codex and GitHub Copilot may operate concurrently in the same repo and branch.

Worktrees are not used.

Safety comes from:
- explicit write claims;
- integrator lease;
- validation barriers;
- provider-neutral Brain;
- no destructive Git;
- no overlapping writers.

Rationale:
this matches the project workflow requirement while making collision risk explicit and
machine-checkable.
