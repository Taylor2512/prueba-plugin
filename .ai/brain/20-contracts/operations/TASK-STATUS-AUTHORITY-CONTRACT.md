# Task status authority contract

Precedence:

```text
explicit evidence
> task-card frontmatter
> ledger/view
> prompt/Todo/chat
```

Canonical states:

`BACKLOG | READY | IN_PROGRESS | REVIEW | BLOCKED | PARTIAL | PASS | ARCHIVED`

A direct PASS becomes effective `PARTIAL` when a declared dependency is not effective PASS.

This is intentional: work can be implemented/evidenced early without falsely closing the DAG.

Views never own state. Reconciliation updates cards first and regenerates views afterward.
