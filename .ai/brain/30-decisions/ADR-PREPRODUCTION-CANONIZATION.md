# ADR — Pre-production canonization

## Status

Accepted. This decision supersedes contradictory compatibility and archival
policies for SISAD-PDFME before its first production release.

## Decision

SISAD-PDFME is not in production. The current source, executed tests, current
contracts and evidence define the product. Git is the historical record; the
working tree is not a museum of replaced architectures.

Therefore the pre-production canon is:

- migrate valid behavior to the current representation, then delete obsolete
  compatibility code, aliases, bridges, callbacks, snapshots and plans;
- use `User` as the core identity and keep host translation at the boundary;
- expose reusable capabilities through intentional root or subpath facades;
- keep implementation internals private and forbid consumer deep imports;
- maintain one authority per runtime concept and one current data model;
- keep stable semantic paths free of versions, dates and legacy suffixes;
- derive indexes and task views from live source, cards and evidence;
- retain only current contracts, ADRs, Brain explanations, guides, skills and
  executed evidence.

No compatibility alias is justified solely by hypothetical future consumers.
An external production contract is the only exception and must be demonstrated
in the relevant task evidence.

## Consequences

Pre-production migrations may be breaking. Fixtures, examples, tests and docs
must move together with the current source. A capability without an internal
consumer is not automatically dead: classify it as public, internally wired,
private reachable, deleted or environment entrypoint, then test the decision.

Historical plans and replaced policies are removed after unique current
knowledge is migrated to its authoritative contract, ADR, Brain, guide,
task-card or evidence location.
