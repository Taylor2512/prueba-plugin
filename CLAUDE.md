# CLAUDE — Adaptador de `sisad-pdfme`

Claude debe usar `.ai/` como fuente de verdad y este archivo solo como puente.

## Orden obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/rules/global-rules.md`
4. `.ai/context/project-overview.md`
5. `.ai/context/code-map.md`
6. `.ai/architecture/assistant-architecture.md`
7. `.ai/architecture/agent-routing.md`
8. `.ai/instructions/*.instructions.md`
9. `.ai/agents/*.agent.md`
10. `.ai/skills/*/SKILL.md`
11. `.ai/prompts/*.prompt.md`

## Regla

No contradigas `.ai/`. Si falta contexto, revisa `.ai/` antes de proponer cambios.
