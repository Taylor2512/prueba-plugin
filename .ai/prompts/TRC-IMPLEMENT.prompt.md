# TRC-IMPLEMENT.prompt.md

Execute one TRC card atomically with evidence and minimal context.

## Required flow

1. Read .ai/START.md and .ai/STATE-SOURCES.md.
2. Read .ai/scrum/views/TEMPLATE-RUNTIME-CONTRACT.md.
3. Read target card .ai/scrum/task-cards/template-runtime-contract/TRC-XXX.md.
4. Reconcile overlap with QH/PRT/RTP cards before coding.
5. Characterize current behavior.
6. Implement smallest authority-preserving patch.
7. Run focal gates.
8. Write evidence and status delta.

## Output format

- Objective achieved / not achieved
- Changed files
- Executed gates with exact command + result
- Non-executed gates and reason
- Risks and blockers
- Next card recommendation

## Constraints

- Keep SISAD-PDFME consumer-agnostic.
- Preserve session x user x document isolation.
- Do not serialize host credentials/secrets.
- Do not introduce parallel config/registry/snapshot/runtime authorities.
