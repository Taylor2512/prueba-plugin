# Snapshot architecture map

Snapshot de contexto generado el 2026-08-13 17:28Z:

- code/config candidates: 544;
- `src/sisad-pdfme`: 403 paths inventariados;
- Markdown candidates: 802;
- styles: 5;
- task-cards Markdown: 205;
- skills bajo `.agents/skills`: 77;
- routes: 28.

Familias principales ya usan paths semánticos estables:

```text
.ai/analysis/runtime-platform/
.ai/index/runtime-platform/
.ai/scrum/task-cards/runtime-platform/
.ai/prompts/RTP-*.md
.agents/skills/sisad-runtime-platform/
```

El snapshot todavía conserva `reports/runtime-platform/`; el target estable
es `reports/runtime-platform/` y debe migrarse con `npm run docs:paths:apply`.

Los conteos de `.ai/index/runtime-platform/*.jsonl` pueden quedar obsoletos
hasta que esos índices se regeneren desde el worktree vivo.
