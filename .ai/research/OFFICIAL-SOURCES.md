# Fuentes oficiales consultadas

## OpenAI

- A practical guide to building agents: recomienda maximizar primero un solo agente, definir exit conditions, usar guardrails, establecer evals y sustituir modelos grandes por pequeños cuando mantienen la calidad.
- Harness engineering: destaca repositorios agent-friendly, feedback loops, pruebas y entornos reproducibles.
- Agents SDK: separa harness y compute para tareas largas y controladas.
- GPT-5.6: model routing, eficiencia y programmatic tool calling para reducir round trips y tokens.

## Anthropic

- Claude Code memory: memorias temáticas se cargan bajo demanda; las memorias de subagentes son aisladas.
- Claude Code subagents: descripciones claras determinan delegación y herramientas restringidas reducen riesgo.
- Hooks: controles deterministas deben ejecutarse como hooks en lugar de depender de decisiones del modelo.
- Programmatic tool calling: filtrar resultados antes de introducirlos al contexto reduce tokens y latencia.
- Prompt engineering/evals: definir criterios de éxito y evaluaciones antes de optimizar prompts.

## GitHub

- Custom instructions: instrucciones de repositorio en Markdown.
- Custom agents: agentes especializados con frontmatter y prompt acotado.
- Agent skills: instrucciones y recursos cargados cuando son relevantes.
- AGENTS.md: instrucciones específicas por repositorio y agente.

## Aplicación a SISAD

- single-agent por defecto;
- multi-agent solo por independencia;
- skills on-demand;
- hooks para reglas deterministas;
- evals antes de cambiar prompts;
- outputs filtrados;
- memoria separada por scope;
- human review en cambios sensibles.
