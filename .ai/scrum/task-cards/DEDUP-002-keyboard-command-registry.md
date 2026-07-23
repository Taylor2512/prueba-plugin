# DEDUP-002 — registro de atajos

**Estado:** done · **Owner:** shared-batch · **Modelo:** GPT-5.6 Sol · **Worktree:** codex/shared-batch (`/workspace/wt-shared`)

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

## Cierre (2026-07-23)

- Fuente canónica: tablas de comandos y adaptadores en `useDesignerKeyboardShortcuts.ts`; `ui/hooks.ts` conserva un único caller delegado.
- Patrón: Command Registry acotado para callbacks, selection commands e inserciones; las variantes con fallback permanecen explícitas.
- Medición: jscpd focal, 1 coincidencia residual (7 líneas, 57 tokens) entre forma del contexto y parámetros; clasificada `owned-acceptable` porque extraerla degradaría el contrato tipado del hook.
- Gates: ESLint focal; 3 tests Vitest de resolución, foco editable y carga del módulo; jscpd focal.
- Riesgo residual: los shortcuts con semántica distinta (undo/redo, delete, group/style) siguen explícitos para no introducir un mega-command.
- Memory delta: no cambia política durable; la fuente canónica ya estaba definida por la tarjeta.
