# Política de contexto

## Progressive disclosure

```txt
task-card
→ route manifest
→ symbol index
→ evidence packet
→ test
→ skill
→ deep reference solo para una incógnita
```

## Context Manifest

Toda task-card declara:

```yaml
context:
  route: right-sidebar
  skills: [sisad-right-sidebar-contract]
  required:
    - path#symbol
  optional:
    - test path
  forbidden:
    - generated reports
  maxFiles: 8
  maxTokens: 12000
```

## Evidence packet

```txt
question
base commit
symbols
evidence
confidence
contradictions
conclusion
unknowns
next check
```

No incluye narración de comandos ni archivos completos.

## Invalidación

Un packet queda stale cuando cambia commit base, contrato público, test
caracterizador, route owner o decisión relacionada.
