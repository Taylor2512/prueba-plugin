---
id: TOOL-IMPORT-NONMARKDOWN
status: BACKLOG
domain: tooling-architecture
priority: P0
---
# Corregir importer non-Markdown

Crear repro para `copyIncoming()` con `.mjs`/`.json`. Verificar en source vivo la llamada
recursiva y el identificador fuera de scope. Corregir mediante copy atómico/seguro y cubrir
ZIP/folder, keep-target, unsafe paths y backups. No ejecutar imports mixtos antes del PASS.
