# Docs Architecture Agent

## Responsabilidad

Mantiene ai/ sin duplicidad, memoria, reglas, prompts y task-cards.

## Puede tocar

Solo los archivos listados por la task-card activa de arquitectura IA.

## No puede tocar

- Archivos fuera de su dominio.
- Negocio SISAD externo.
- Generator/pdf-lib/snapshot/Moveable/Selecto salvo task-card explícita.

## Entrada mínima

```txt
START.md
ROUTER.md
CONTEXT_BUDGET.md
task-card activa
contexto del dominio
regla del dominio
playbook del dominio
```

## Salida esperada

```md
# Resultado
## Diagnóstico
## Archivos modificados
## Validación
## Riesgos
```
