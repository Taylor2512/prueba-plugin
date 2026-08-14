# Guide — safe dead-code removal

For every candidate:
- static imports;
- dynamic registry;
- string references;
- public exports;
- snapshots/migrations;
- tests/examples;
- generated docs.

Classify:
`dead | public-compat | dynamic | generated | test-only | unknown`.

Only `dead` is removable without adapter.
