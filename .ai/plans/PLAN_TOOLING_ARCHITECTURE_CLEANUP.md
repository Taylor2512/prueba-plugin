# Plan — Tooling architecture cleanup

## Phase A — baseline

1. inventory `scripts`, `tools`, `.ai/scripts`, package scripts and consumers;
2. run old commands and capture behavior;
3. identify duplicated responsibilities.

## Phase B — central configuration

Adopt `config/tooling/project-tools.config.mjs`.
Move path lists, ignores, naming rules, protected state, generated paths, thresholds and
package command aliases out of individual scripts.

## Phase C — Markdown engine

Move all documentation lifecycle to `project-tools`:

- sanitize;
- index;
- links;
- duplicates;
- validate.

Old stable commands become wrappers.

## Phase D — remove versioned paths

Run dry-run, resolve collisions, apply, repair links, reindex and gate.
No architecture file/folder with revision token may remain.

## Phase E — safe architecture import

Use the new ZIP/folder importer. Never delete target-only information.
Protected hot state is immutable to automated import.

## Phase F — AI tooling dedup

After consumer search:

- retire standalone `build-knowledge-index` implementation;
- retire duplicate Markdown duplicate checker;
- remove stale docs that point to generators no longer present;
- reuse the central index from provider/AI tooling.

## Phase G — quality/tool cleanup

`tools/` contains only specialized analyzers.
General repository maintenance belongs to `scripts/project-tools.mjs`.

## Phase H — closeout

Run lint, focused tests for scripts, tooling doctor, documentation gates and inspect Git diff.
