# Orden de ejecución — COREUX

Todas las tareas nacen en Backlog. Activar solo cuando WIP < 3.

## W0

COREUX-001 → COREUX-002 → COREUX-003 → COREUX-004

## W1

COREUX-005 → COREUX-006 → COREUX-007 → COREUX-008 → COREUX-009 → COREUX-010 → COREUX-011 → COREUX-012

## W2

COREUX-013 → COREUX-014 → COREUX-015 → COREUX-016 → COREUX-017 → COREUX-018 → COREUX-019

## W3

COREUX-020 → COREUX-021 → COREUX-022 → COREUX-023 → COREUX-024 → COREUX-025 → COREUX-026 → COREUX-027 → COREUX-028

## W4

COREUX-029 → COREUX-030 → COREUX-031 → COREUX-032 → COREUX-033 → COREUX-034 → COREUX-035 → COREUX-036 → COREUX-037 → COREUX-038 → COREUX-039 → COREUX-040 → COREUX-041

## W5

COREUX-042 → COREUX-043 → COREUX-044 → COREUX-045 → COREUX-046 → COREUX-047 → COREUX-048 → COREUX-049 → COREUX-050

## W6

COREUX-051 → COREUX-052 → COREUX-053 → COREUX-054 → COREUX-055 → COREUX-056

## Paralelismo

- W0 puede usar hasta dos readers, pero un solo writer para reportes.
- COREUX-005 y COREUX-008 pueden iniciar en paralelo después de auditorías.
- Toolbar y surface work no deben tocar los mismos archivos simultáneamente.
- Inspector/schema tasks pueden paralelizarse por familia con worktrees separados.
- Solo una tarea de riesgo Muy alto puede estar In progress.

## Camino crítico

```text
001→003→005→006→007
004→010→011→012
008→009→020→021→022
024→025→026
029→030→034/035→038/039
036→043→044/045
027→046→047→048/049→050
053/054/055→056
```
