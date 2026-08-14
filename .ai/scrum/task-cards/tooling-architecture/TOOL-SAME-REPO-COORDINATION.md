# TOOL — same repo coordination

Objective:
support Claude/Codex/Copilot concurrently in one working tree without overlapping writers.

Acceptance:
- atomic-ish mutex protected claim updates;
- overlapping claims rejected;
- single integrator lease;
- validation lease;
- provider prompts reference the protocol;
- no worktree recommendation remains active for this project workflow.
