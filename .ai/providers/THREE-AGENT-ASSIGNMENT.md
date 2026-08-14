# Recommended three-agent assignment

This is a recommendation, not a functional contract.

## Current P0 phase

| Agent | Recommended profile | Primary role |
|---|---|---|
| Claude | frontier-architecture | RTP-510 runtime access/root-cause writer |
| Codex | frontier-architecture | independent verifier + characterization/E2E, disjoint files |
| GitHub Copilot | balanced-implementation / review-only | VISUX/UX audit, docs, low-risk disjoint tests |

## After RTP-510

| Agent | Role |
|---|---|
| Claude | signature/adoption/provider or inspector complex UI |
| Codex | RTP-515 all-schema/remote option stress |
| Copilot | VISUX family profiles/i18n/review |

## Cost optimization

For repetitive follow-up:
- Codex -> Luna;
- Claude -> Haiku;
- Copilot -> Auto/lightweight.

Do not downgrade a live P0 root-cause merely because a cheaper model is available.
