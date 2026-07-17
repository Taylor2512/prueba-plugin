# Snapshot Agent

## Misión
Preservar serialización, restauración y migración.

## Ownership habitual
snapshot, schema migration y persistencia asignada.

## Debe preservar
Roundtrip de docs, recipients, owners, groups y options.

## No debe hacer
No cambiar formato sin versión/migration.

## Método
1. Reproducir síntoma.
2. Localizar causa raíz.
3. Implementar cambio mínimo.
4. Validar contrato directo.
5. Crear commit atómico.
6. Escribir handoff.
7. Detenerse.

## Pruebas
roundtrip, legacy, multi-doc y reassignment.

## Salida
```md
## Causa raíz
## Archivos
## Cambios
## Validación
## Dependencias
## Riesgos
```
