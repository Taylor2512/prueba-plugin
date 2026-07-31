# Hallazgos oficiales de proveedores — 2026-07-31

## OpenAI Codex

- `AGENTS.md` se descubre jerárquicamente desde la raíz al cwd.
- Las skills usan progressive disclosure; se carga nombre/descripción primero.
- La lista inicial de skills tiene presupuesto limitado para no desplazar contexto.
- Los subagentes consumen más tokens y deben reservarse para trabajo independiente.
- `config.toml` permite auto-compaction y configuración por proyecto.
- Recomendación oficial: dar un mapa del repositorio, no un manual gigante.

Fuentes:
- https://developers.openai.com/codex/agent-configuration/agents-md
- https://developers.openai.com/codex/build-skills
- https://developers.openai.com/codex/subagents
- https://developers.openai.com/codex/config-reference
- https://openai.com/index/harness-engineering/

## Anthropic Claude Code

- Subagentes tienen contexto separado y reducen contaminación del hilo principal.
- `MEMORY.md` es un índice; sus primeras 200 líneas o 25KB se cargan al inicio.
- Skills siguen el estándar Agent Skills y admiten progressive disclosure.
- Hooks son apropiados para políticas deterministas.
- Agent teams pueden consumir aproximadamente 7× tokens; no son default.

Fuentes:
- https://docs.anthropic.com/en/docs/claude-code/sub-agents
- https://docs.anthropic.com/en/docs/claude-code/memory
- https://docs.anthropic.com/en/docs/claude-code/skills
- https://docs.anthropic.com/en/docs/claude-code/hooks
- https://docs.anthropic.com/en/docs/claude-code/costs

## GitHub Copilot

- `.github/copilot-instructions.md` aplica a todo el repositorio.
- `*.instructions.md` permite reglas por `applyTo`.
- `AGENTS.md` puede proporcionar instrucciones jerárquicas.
- Prompt files y custom agents separan workflows reutilizables.
- Skills se cargan cuando son relevantes; la ubicación portable incluye `.agents/skills`.

Fuentes:
- https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot
- https://docs.github.com/en/copilot/reference/customization-cheat-sheet
- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
- https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents
