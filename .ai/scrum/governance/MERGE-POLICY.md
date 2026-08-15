# Merge policy

Before applying an architecture overlay:

1. capture `git status`, current branch and HEAD;
2. inspect same-repo coordination claims;
3. run installer/cleanup in dry-run;
4. create external backup before every move/delete/replace;
5. preserve task cards, evidence and live CURRENT/HANDOFF;
6. apply path aliases before rebuilding navigation;
7. validate names, task IDs, links and status DAG;
8. inspect `git diff` before commit.

## Shared working tree

Claude, Codex and GitHub Copilot may share the same repo/branch.

No worktrees are used for this project.

One writer per overlapping file. Only the integrator lease holder stages/commits/pushes.

## Forbidden recovery shortcuts

No `git reset --hard`, `git clean`, blanket restore/checkout, blanket stash or force push.
