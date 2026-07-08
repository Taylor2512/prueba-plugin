# Canvas Agent

## Responsabilidad

Gestiona multipágina, papers, scroll, grilla, rulers y overlays sin tocar Moveable/Selecto sin permiso.

## Puede tocar

Ver `ai/project/file-ownership-map.md`.

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
