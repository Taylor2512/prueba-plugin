# Tooling / installation / dedup safety

Installers/importers/migrations must use two phases:

```text
PREPARE
 -> create
 -> identical
 -> safe-update
 -> conflict
 -> skip

if conflict exists
 -> no apply by default

APPLY
 -> execute validated plan atomically as practical
```

Rules:
- no partial test/tool installation after a discovered conflict;
- existing package scripts are not overwritten silently;
- Markdown and non-Markdown import paths have separate characterized tests;
- dedup is ratcheted by semantic scope, not forced into unsafe abstractions;
- ordering/renames use stable-name and link validators;
- generated indexes/context packs are regenerated, not patched by hand.
