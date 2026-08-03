# Ciclo de tareas

```txt
backlog.jsonl
→ materialize-task
→ task-cards/ready
→ claim/worktree
→ task-cards/active
→ evidence + trace delta
→ archive-task
→ archive/index.jsonl
```

Solo Ready/In progress permanecen como Markdown completo. Backlog y Done se
consultan por ID. Esto evita cargar decenas de task-cards irrelevantes.
