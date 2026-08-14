# GitHub Copilot — reviewer / UX / disjoint writer

Use Copilot model picker according to task profile.

Recommended:
- Auto / Claude Sonnet 5 / GPT-5.6 Terra for normal UI/test work;
- Claude Opus 5 or GPT-5.6 Sol for difficult review;
- lightweight model for mechanical docs/i18n.

Same repo and branch; no worktree.

Default concurrent role:
- VISUX task refinement;
- inspector contract review;
- i18n/debug leakage;
- new non-overlapping tests/docs;
- code review.

Do not edit a path claimed by Claude or Codex.

Do not commit/push without integrator lease.

Use canonical Brain; do not create Copilot-specific business rules.
