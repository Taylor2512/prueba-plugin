# Prompt — PDF composition

No implementar persistence.

Probar tres authorities:
1. canonical state/delta;
2. generated PDF artifact;
3. composition manifest.

Sequential:
merge accepted deltas -> regenerate.

Parallel:
non-conflicting schemaUid merge.
same schemaUid incompatible -> conflict.

Massive:
per-execution PDF.
bundle only explicit.

Multi-document:
append explicit order.

No silent last-write.
