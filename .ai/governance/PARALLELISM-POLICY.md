# Política de paralelismo

Paraleliza solo trabajos independientes.

## Permitido

- mapear callers;
- investigar documentación;
- ejecutar suites distintas;
- revisar un diff;
- analizar UX y accesibilidad por separado.

## Prohibido

- dos escritores en el mismo archivo;
- refactor de contrato y migración de datos simultáneos;
- varios agentes ajustando CSS del mismo componente;
- handoffs entre pares sin manager;
- subagentes que crean subtareas ilimitadas.

Cada trabajo paralelo tiene owner, output y deadline.
