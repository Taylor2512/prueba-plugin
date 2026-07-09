/

# SISAD PDFME — Arquitectura Markdown separada

Este paquete reorganiza la documentación del proyecto en dos mundos separados:

1. `docs/` contiene **solo documentación del componente `sisad-pdfme`**: qué es, para qué sirve, cómo se instala, cómo se implementa, cómo se configuran Designer/Form/Viewer/Generator, schemas, recipients, snapshots, theming, troubleshooting, QA y ejemplos.
2. `ai/` contiene **todo lo relacionado con asistentes de IA**: Codex, Claude, GitHub Copilot, agentes, subagentes, skills, memoria, task-cards, reglas, playbooks, prompts y checklist operativo.

Regla principal:

```txt
Nada sobre agentes de IA debe vivir dentro de docs/.
Nada sobre documentación funcional del componente debe duplicarse dentro de ai/ salvo resúmenes mínimos de contexto para ahorrar tokens.
```

## Estructura rápida

```txt
sisad-pdfme-md-architecture/
├── README.md
├── AGENTS.md                     # Adaptador delgado para herramientas que leen AGENTS.md
├── CLAUDE.md                     # Adaptador delgado para Claude
├── .github/copilot-instructions.md
├── docs/                         # Documentación pública/técnica del componente
└── ai/                           # Sistema operativo de IA
```

## Instalación sugerida

Copiar el contenido en la raíz del proyecto:

```bash
cp -R sisad-pdfme-md-architecture/docs ./docs
cp -R sisad-pdfme-md-architecture/ai ./ai
cp sisad-pdfme-md-architecture/AGENTS.md ./AGENTS.md
cp sisad-pdfme-md-architecture/CLAUDE.md ./CLAUDE.md
mkdir -p .github
cp sisad-pdfme-md-architecture/.github/copilot-instructions.md ./.github/copilot-instructions.md
```

## Principio SOLID aplicado a Markdown

- **SRP:** `docs/` documenta producto/componente; `ai/` orquesta asistentes.
- **OCP:** agregar nuevos procesos con nuevas task-cards sin reescribir todo.
- **ISP:** cada agente carga solo el contexto que necesita.
- **DIP:** los prompts dependen de contratos (`router`, `task-cards`, `rules`), no de documentos gigantes.
- **DRY:** una sola fuente de verdad por tema.
