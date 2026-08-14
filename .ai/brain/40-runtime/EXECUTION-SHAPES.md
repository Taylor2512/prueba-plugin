# Execution shapes

## Sequential

Stage A completa -> orquestador habilita Stage B.
Form no conoce el número de etapa.

## Parallel

Dos executions simultáneas:
- isolated-copy: estado totalmente independiente;
- shared-document: sólo permitido con value scope/conflict policy explícita.

## Massive fan-out

Configuración común -> N executions independientes.

Tests separan:
- concurrencia real de pocas instancias;
- fan-out de muchos scopes;
- performance de batch.
