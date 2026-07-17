# Test Triage Skill

## Propósito
Clasificar fallos antes de editar.

## Cuándo usar
Vitest/Playwright fallidos.

## Entradas
- Task-card.
- Contexto focal.
- Rules.
- Archivos y tests.

## Procedimiento
1. Reproducir individual.
2. Identificar primera excepción.
3. Clasificar.
4. Comparar contrato.
5. Corregir causa.
6. Ejecutar dependientes.

## Validaciones
No cambiar expected sin evidencia.

## Anti-patrones
Snapshots masivos o mocks vacíos.

## Salida
```md
## Alcance
## Evidencia
## Cambios
## Validación
## Riesgos
## Dependencia
```
