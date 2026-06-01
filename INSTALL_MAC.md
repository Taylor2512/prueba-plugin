# INSTALL_MAC.md — Instalación en macOS

Desde la raíz del proyecto:

```bash
unzip sisad-pdfme-agentic-md-architecture-v3.zip -d /tmp/sisad-pdfme-ai-v3
rsync -av /tmp/sisad-pdfme-ai-v3/ ./
```

Validación de estructura:

```bash
find .ai docs handoff tests reports .claude .codex .github .gemini -name "*.md" | wc -l
```

Validación del proyecto si ya tienes dependencias instaladas:

```bash
npm run build -- --mode development
npm run lint
```
