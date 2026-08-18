# TRC Agent Routing (Codex, Claude, Copilot)

Recommended ownership by task profile for the first TRC wave.

## Routing principles

- one writer per overlapping product files;
- reconciliation-heavy cards first;
- assign implementation to smallest safe slice;
- evidence reviewer separate from implementer when possible.

## Recommended allocation

| Day | Card(s) | Primary agent | Secondary reviewer | Rationale |
|---|---|---|---|---|
| 1 | TRC-001 | Copilot | Claude | Documentation and evidence reconciliation focus |
| 2 | TRC-002 | Codex | Copilot | Type and validator architecture clarity |
| 3 | TRC-003 | Codex | Claude | JSON contract design and validation flow |
| 4 | TRC-006, TRC-007 | Claude | Copilot | Identity and normalization boundary rigor |
| 5 | TRC-008 | Codex | Claude | Assignment integrity and reference rules |
| 6 | TRC-004 | Codex | Copilot | Schema identity hardening |
| 7 | TRC-005 | Claude | Codex | Registry-driven serialization semantics |
| 8 | TRC-012, TRC-014 | Codex | Copilot | Resource registry and config compiler authority |
| 9 | TRC-017 | Claude | Codex | Validator matrix and issue taxonomy |
| 10 | TRC-018 | Codex | Claude | Import/migration fail-closed pipeline |

## Handoff protocol

For each completed slice, handoff must include:

- exact changed files
- executed gates and command results
- non-executed gates and reason
- unresolved risks and blockers
- next card recommendation

## Conflict protocol

If two cards require overlapping files in the same day:

1. serialize execution order;
2. keep one active writer;
3. run quick rebase/merge verification;
4. rerun focal gates before status update.
