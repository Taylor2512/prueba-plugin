# QUALITY-001 — perfiles jscpd

**Estado:** done · **Owner:** coordinator · **Modelo:** GPT-5.6 Sol · **Worktree:** actual

## Objetivo observable

Instalar perfiles owned/vendor/docs y producir baseline categorizado reproducible.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

configs/*.json; tools/ai-quality/*; package.json

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Tres reportes, CI owned, manifest de exclusiones.

## Diseño/patrón

Configuración, no refactor de código.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **QUALITY-001-jscpd-profiles** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.

## Cierre (2026-07-23)

- Fuente canónica: `configs/jscpd-{owned,vendor,docs}.json`, expuestos por scripts npm focales y un comando agregado.
- Clasificación: owned excluye vendor y salidas técnicas; vendor se mide sin intervenirlo; docs cubre la arquitectura IA activa.
- Medición reproducible: 23 clones owned, 84 vendor y 0 docs con los perfiles actuales; los números reemplazan inferencias de un reporte global no categorizado.
- Gates: `npm run quality:duplicates:profiles` y checker Markdown en verde.
- Riesgo residual: los baselines son inventario, no umbrales permisivos; cada hallazgo owned debe resolverse o aceptarse con evidencia.
- Memory delta: quedan institucionalizados tres perfiles explícitos y ejecutables desde `package.json`.
