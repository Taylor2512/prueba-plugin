# START — entrada única V7

## Boot packet: ≤2.500 tokens

```txt
AGENTS.md
.ai/scrum/SPRINT-CURRENT.md
una task-card
un AGENTS.md local
una ruta
```

Carga la skill solo después de confirmar que su descripción coincide con la
tarea. No abras memoria histórica, planes completos o catálogos grandes en el
arranque.

## Ciclo

```txt
orientar
→ verificar estado real
→ formular pregunta
→ obtener evidence packet
→ decidir
→ caracterizar con test
→ cambiar
→ validar
→ review
→ memory delta
```

## Checkpoint previo al parche

Registra:

```txt
task/claim/worktree/base
causa probable
evidencia y confianza
invariantes
archivos permitidos
test focal
presupuesto
condición de parada
trace IDs afectados
```

## Fuente de estado

- Estado durable: `.ai/scrum/SPRINT-CURRENT.md`
- Claim/lease: `.ai/scrum/CLAIMS.md`
- Continuidad inmediata: `.ai/memory/HANDOFF.md`
- `.ai/scrum/ACTIVE.md` es una vista generada, no autoridad.

## Reanudación

Verifica `pwd`, rama, worktree, `git status`, commit base, task-card, último
gate y archivos modificados. No confíes únicamente en el resumen de sesión.
