# DEDUP-002 — registro de atajos

**Estado:** ready · **Owner:** por asignar · **Modelo:** consultar router · **Worktree:** por definir

## Objetivo observable

Eliminar tres bloques equivalentes en `useDesignerKeyboardShortcuts.ts` y la duplicidad con `ui/hooks.ts` mediante un command registry único.

## Evidencia

Reporte jscpd del 22 de julio de 2026.

## Archivos permitidos

src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts; src/sisad-pdfme/ui/hooks.ts

## Archivos prohibidos

`src/sisad-pdfme/pdf-lib`, snapshot/global generator y cualquier archivo no requerido por callers o tests directos.

## Invariantes

API pública, identidad/routing/ownership, comportamiento de canvas y compatibilidad de snapshot.

## Caracterización previa

Vitest de teclas, modifiers, locks, modal y preventDefault.

## Diseño/patrón

Command Registry + adapters de eventos; conservar diferencias Mac/Windows.

## Pasos

Aplica la skill `sisad-dry-refactor`: caracteriza el caso, crea la fuente canónica, migra callers y ejecuta los gates declarados en esta tarjeta.

## Criterios de aceptación

La coincidencia descrita en **DEDUP-002-keyboard-command-registry** queda eliminada o aceptada con evidencia; no se introducen clones owned nuevos ni regresiones en sus pruebas focales.

## Riesgos y rollback

Mantener un commit de caracterización separado y revertir la extracción si aumenta branching o rompe pruebas.

## Memory delta

Actualizar métricas y decisiones solo si nace una nueva fuente canónica o política durable.
