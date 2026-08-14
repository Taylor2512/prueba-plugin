# Guide — Claude + Codex + Copilot in one repo

## Recommended initial split

### Claude — runtime P0 owner
Own:
- runtime access propagation;
- access authority;
- multi-user Form product changes.

Avoid:
- editing tests currently claimed by Codex;
- editing VISUX docs claimed by Copilot.

### Codex — verification/stress owner
Own:
- characterization tests;
- Playwright;
- all-schema harness;
- quality tooling;
- independent review of runtime changes.

Default to read-only on files claimed by Claude.

### Copilot — UX/review/low-risk owner
Own:
- VISUX documentation;
- i18n;
- inspector contracts;
- review;
- new test files or small non-overlapping UI slices when explicitly claimed.

## Rotation

After a P0 slice reaches evidence:
- release claims;
- coordinator recalculates the queue;
- agents can swap roles.

## Never

All three should not edit:
`Preview.tsx`,
the same access resolver,
the same registry,
or the same task card simultaneously.
