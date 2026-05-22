# Modelo de proveedores IA

## Neutralidad

El repositorio no debe depender de un proveedor IA específico. Claude, Codex, Copilot y Gemini deben consumir la misma arquitectura documental.

## Patrón

```text
.ai/              = fuente de verdad
CLAUDE.md         = adaptador Claude
CODEX.md          = adaptador Codex
GEMINI.md         = adaptador Gemini
.github/*         = adaptador GitHub Copilot
```

## Reglas de sincronización

Cuando se cambie una regla global:

1. Actualizar `.ai/rules/global-rules.md`.
2. Revisar adaptadores.
3. Actualizar prompts si cambió el flujo.
4. Actualizar docs si cambió arquitectura.
