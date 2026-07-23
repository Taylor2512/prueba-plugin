# Vendor y contenido generado

## `src/sisad-pdfme/pdf-lib`

Trátalo como fork vendorizado. No refactorices clones para satisfacer métricas generales. Cualquier cambio exige:

- motivación funcional;
- referencia al upstream o diferencia necesaria;
- tests PDF focales;
- registro en `DECISIONS.md`;
- plan de futura sincronización.

## Documentación consolidada

Los archivos que agregan código o documentación completa son artefactos de análisis, no fuentes canónicas. No deben entrar en gates de duplicidad activa. Reemplaza bloques repetidos por enlaces a documentación por módulo y genera consolidaciones fuera del árbol versionado o en `reports/generated/`.

## Backups y reportes

`.tailwind-migration-backups`, `reports/`, cobertura, bundles y snapshots generados se excluyen del gate owned. Mantén un manifiesto del generador y no edites el resultado manualmente.
