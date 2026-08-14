---
name: same-repo-coordination
description: Coordinate Claude, Codex and Copilot in one branch/worktree without worktrees.
---
Before any write:
1. inspect coordinator status;
2. claim exact paths;
3. re-read live files;
4. edit only claimed paths;
5. evidence;
6. release.

Never use worktrees in this project.
Never revert another agent.
Only integrator may commit/push.
