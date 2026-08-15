# Markdown topology contract

## Authorities

- task state: task card + explicit evidence + dependency DAG;
- ledgers/backlogs/views: projections;
- CURRENT/HANDOFF: compact operational continuity;
- Brain: durable architectural knowledge;
- archive: historical provenance outside the hot path.

## Canonical task topology

```text
.ai/scrum/task-cards/
├── ai-architecture/
├── core-ux/
├── naming/
├── portability/
├── runtime-platform/
├── tooling-architecture/
└── visual-ux/
```

IDs are stable. Moving a card never changes its ID.

## Links

A high-fanout knowledge folder has a README hub. Links are relative and validated.

Do not create fake backlinks in every leaf just to satisfy an orphan metric.

## Archive

Historical campaigns are preserved under `.ai/archive/` and excluded from normal routing.
