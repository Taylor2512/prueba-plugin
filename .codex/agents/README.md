# Agentes personalizados Codex

Codex usa archivos TOML en `.codex/agents/`, no Markdown. Para mantener este paquete centrado en arquitectura Markdown, las instrucciones canónicas viven en `.ai/agents/`.

## Plantilla

```toml
name = "dry-auditor"
description = "Read-only duplicate and dead-code audit for SISAD PDFME"
model = "gpt-5.6-luna"
model_reasoning_effort = "low"
sandbox_mode = "read-only"
developer_instructions = "Read AGENTS.md, .ai/START.md and .ai/agents/EXPLORER-DRY.md. Return only evidence and recommendations; do not edit files."
```

Perfiles recomendados:

- architect → Sol high, read-only;
- explorer/dry → Luna low, read-only;
- implementer → Terra medium, workspace-write;
- QA reviewer → Terra medium, read-only;
- memory/scrum → Luna low, workspace-write limitado a `.ai/`.

No copie instrucciones extensas en TOML; apunte al archivo canónico.
