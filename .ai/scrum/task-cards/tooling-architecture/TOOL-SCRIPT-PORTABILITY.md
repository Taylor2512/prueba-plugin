---
id: TOOL-SCRIPT-PORTABILITY
status: BACKLOG
domain: tooling-architecture
priority: P1
---
# Portabilidad de scripts npm y memoria build

Caracterizar macOS/Windows: inline env vars (`VITE_PORT=...`, `NODE_OPTIONS=...`), configs
Playwright duplicados/version skew y `--max-old-space-size=81922`. Medir y decidir; no
cambiar 81922 a 8192 por suposición. Preferir Node wrapper o cross-platform strategy.
