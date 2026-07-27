# Orquestación V6

## Topología por defecto

```text
Owner/Manager — único escritor
├── Explorer — lectura, opcional
└── Reviewer o QA — lectura, opcional
```

Empieza con un solo agente. Agrega subagentes cuando la separación reduzca contexto o permita trabajo realmente independiente.

## Contrato de delegación

Toda delegación define:

- pregunta única;
- rutas permitidas;
- herramientas;
- presupuesto;
- formato de salida;
- condición de parada;
- prohibición de editar, salvo worktree asignado.

## Paralelismo

- máximo dos lectores por task-card;
- máximo tres task-cards en WIP;
- cada escritor usa worktree y archivos no solapados;
- el manager sintetiza resultados, no copia outputs;
- no existe handoff circular entre agentes.

## Integración

Commits pequeños, revisables y con gates. No copiar carpetas completas ni mezclar parches no revisados.
