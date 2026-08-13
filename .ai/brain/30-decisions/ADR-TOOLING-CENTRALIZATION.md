# ADR — Centralize repository tooling

## Decision

Use one canonical configuration:

`config/tooling/project-tools.config.mjs`

and one CLI:

`scripts/project-tools.mjs`.

Common filesystem, Markdown, naming, indexing and import behavior lives under
`scripts/tooling/`.

Legacy command paths may remain temporarily as thin compatibility wrappers only.

## Consequence

`tools/ai-quality` must not maintain a second Markdown index implementation.
Specialized analyzers may remain under `tools/`, but repository architecture lifecycle
belongs to `scripts/project-tools.mjs`.
