# TRC-CLOSEOUT.prompt.md

Run TRC milestone closeout using the checklist and fail if any mandatory condition is missing.

## Inputs

- targeted milestone cards
- .ai/scrum/views/TRC-CLOSEOUT-CHECKLIST.md
- latest evidence

## Required flow

1. verify checklist item by item
2. map each PASS claim to executed evidence
3. collect residual risks and open blockers
4. decide KEEP/PARTIAL/PASS/BACKLOG per card

## Output

- closeout verdict table
- missing evidence list
- authority drift findings
- required follow-up cards before promotion
