# Task Intake

## Antes de aceptar una tarea

- [ ] ¿Existe una task-card activa?
- [ ] ¿La tarea está duplicando una completed?
- [ ] ¿El cambio corresponde a `ai/**`, `docs/**`, `src/**`, `scripts/**` o `reports/**`?
- [ ] ¿Hay riesgo sobre CSS, Moveable, Selecto, zoom, canvas, snapshot o pdf-lib?
- [ ] ¿La tarea requiere crear una regression/continuity task-card en vez de reabrir una completada?

## Si la tarea toca arquitectura IA

No crear carpetas nuevas. Usar:

```txt
ai/start
ai/router
ai/memory
ai/task-cards
ai/rules
ai/playbooks
ai/context
ai/checklists
ai/prompts
ai/reports
docs
scripts
```

## Si la tarea toca CSS

- Migrar a clases Tailwind inline en `.jsx/.tsx` cuando sea seguro.
- Mantener `tokens.css`.
- Mantener CSS crítico de geometry, zoom, paper, canvas, Moveable, Selecto, print/PDF, pseudo-elementos complejos y variables runtime.
- Documentar cada regla que se elimina.
