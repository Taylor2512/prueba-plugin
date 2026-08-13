# Orquestación

## Default

```txt
Manager/Writer
├── Explorer read-only, opcional
└── Reviewer/QA read-only, opcional
```

Empieza con un agente. Agrega subagente cuando la salida intermedia sería
ruidosa, independiente y mayor que el resumen esperado.

## Delegation packet

```txt
question
allowed paths
forbidden paths
tools
token/file budget
output schema
stop condition
edit permission
```

## Paralelismo

- WIP global máximo 3;
- un solo writer por task-card;
- máximo dos readers;
- solo una tarea `risk: very-high`;
- worktrees y claims para writers;
- cero solapamiento de archivos;
- manager sintetiza, no copia outputs;
- sin handoff circular.

## Cost gate

No delegar salvo que:

```txt
context_saved > delegation_overhead
o
wall_clock_saved es material
o
independencia permite revisión real
```
