# Serena agent workflow

## Boot

Use progressive disclosure:

```text
AGENTS.md
→ .ai/START.md
→ .ai/ROUTER.md
→ active task/contract
→ Serena symbol navigation
→ nearest tests
```

Do not recursively load `.ai/**`.

## Memory separation

```text
.ai/**              durable knowledge
Serena memories     operational observations
Git                 history
reports             derived evidence
```

A Serena memory may say that a symbol has callers pending review. It must not
become a duplicate ADR.

## Handoff

Record only:

- task;
- agent/provider/model when available;
- objective;
- relevant symbols;
- changed files;
- tests/gates executed;
- result;
- remaining risks;
- next action.

Do not store hidden chain-of-thought.
