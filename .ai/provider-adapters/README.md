# Adaptadores por proveedor

## Codex

- Carga `AGENTS.md`, skills y configuración local.
- Custom agents reales se definen en TOML; use `.codex/agents/README.md`.

## Claude

- `CLAUDE.md` apunta a la fuente canónica.
- Mantenga `.agents/skills/` como origen; si su versión exige `.claude/skills/`, genere copias y no edite el espejo.

## GitHub Copilot

- `.github/copilot-instructions.md` contiene reglas mínimas.
- `.github/agents/*.agent.md` define roles.
- Copilot soporta Agent Skills; use `.agents/skills/`.

## Regla

Adapters contienen rutas y mínimos de arranque, no copias completas de governance, memoria o playbooks.
