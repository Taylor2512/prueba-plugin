# Hallazgos de fuentes oficiales

Consulta realizada el 22 de julio de 2026.

## OpenAI Codex

- Modelos: https://developers.openai.com/codex/models
- Skills y progressive disclosure: https://developers.openai.com/codex/build-skills
- Subagentes y custom agents: https://developers.openai.com/codex/subagents
- AGENTS: https://developers.openai.com/codex/agent-configuration/agents-md
- Hooks: https://developers.openai.com/codex/hooks
- Memorias: https://developers.openai.com/codex/memories
- Worktrees: https://developers.openai.com/codex/environments/git-worktrees
- Buenas prácticas: https://developers.openai.com/codex/learn/best-practices

Conclusión: usar AGENTS para guía durable, skills por demanda, subagentes para trabajo acotado y hooks deterministas revisados. Cada subagente consume su propio trabajo de modelo/herramientas.

## Claude Code

- Skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Subagentes: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Settings: https://docs.anthropic.com/en/docs/claude-code/settings
- Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks-guide

Conclusión: procedimientos largos deben migrar de CLAUDE.md a skills; agentes de exploración read-only reducen contaminación de contexto.

## GitHub Copilot

- Custom instructions: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide
- Agent skills: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills
- Custom agents: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents
- Prompt files: https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file

Conclusión: instrucciones simples y globales en repository instructions; procedimientos bajo demanda en skills/prompts; roles recurrentes como agent profiles.

## MCP

- Security: https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- Tools: https://modelcontextprotocol.io/specification/2025-06-18/server/tools

Conclusión: mínimo privilegio, validación, controles de acceso, confirmación sensible, timeouts y logging.

## jscpd

El reporte local recomienda la skill `dry-refactoring` del proyecto jscpd. V5 no instala código externo automáticamente; replica el flujo de clasificación y permite evaluar una skill externa antes de adoptarla.
