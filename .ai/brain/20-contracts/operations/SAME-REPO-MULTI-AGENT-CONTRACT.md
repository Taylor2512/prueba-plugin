# Same repo multi-agent contract

## Constraint

No worktrees. No branch switching. All agents operate on the current branch/worktree.

## Exclusive write ownership

Every product path being modified must be claimed.

A claim owns:
- exact files; or
- a narrowly scoped directory only when every file inside belongs to one task.

Broad claims such as `src/**` are invalid unless the coordinator explicitly serializes all
other writers.

## Git integration

Only the current `integrator` lease holder may:
- stage;
- commit;
- push;
- amend;
- resolve index conflicts.

Other agents must not manipulate the index.

## Validation barrier

Full suite/build/release evidence is valid only when:
- no conflicting writer is changing dependencies during the run;
- or the coordinator has acquired the validation lease.

## Conflict behavior

On claim collision:
- do not edit;
- do not revert;
- select a disjoint task;
- or switch to reviewer mode.

## Dirty tree

Preexisting changes are preserved. The agent records which paths it owns.
