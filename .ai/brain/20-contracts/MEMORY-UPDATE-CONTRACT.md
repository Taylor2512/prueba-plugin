# Memory update contract

Persist only:
- stable architecture decisions;
- proven invariants;
- completed migrations;
- verified baselines.

Do not persist:
- unverified suspected root causes;
- temporary file counts;
- transient local failures;
- provider-specific conversational memory as canonical truth.

CURRENT is a compact delta.
HANDOFF contains only what the next execution needs.
Evidence contains command output.
