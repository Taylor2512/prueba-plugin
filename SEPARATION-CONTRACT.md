# Contrato de separación

## `docs/`

Solo documentación del componente `sisad-pdfme`:

- qué es;
- cómo se usa;
- API;
- schemas;
- Designer/Form/Viewer/Generator;
- theming;
- QA;
- troubleshooting.

## `ai/`

Solo operación de asistentes IA:

- agentes;
- subagentes;
- skills;
- memoria;
- task-cards;
- prompts;
- reglas;
- budgets.

## Validación rápida

```bash
rg "Codex|Claude|Copilot|agente|subagente|task-card|prompt|tokens|memoria IA" docs
```

Ese comando no debería devolver contenido operativo de IA.
