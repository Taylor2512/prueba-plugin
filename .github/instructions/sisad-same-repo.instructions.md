---
applyTo: "**"
---

This repository may be concurrently edited by Claude, Codex and Copilot in the same branch.

Before writing, acquire an exact path claim with `scripts/ai/same-repo-coordinator.mjs`.

Do not use worktrees.
Do not revert unknown dirty changes.
Do not stage/commit/push unless holding the integrator lease.
Use canonical `.ai/brain` and `.agents/skills`; do not duplicate governance in Copilot files.
