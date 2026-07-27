# CONFIG-001 — Reparar API pública de configuración (Fase 1)

**Estado:** review · **Owner:** claude-opus · **Modelo:** Opus 4.8 max · **Worktree:** actual (`main`, sobre `d054900`)

## Objetivo observable

El barrel público de configuración vuelve a exportar el contrato completo (valores y tipos) para que el host tipe/consuma la configuración sin imports profundos. Se corrige la regresión que había vaciado `config/index.ts` y roto la cadena de re-exports de `integration/index.ts`.

## Evidencia

Plan §3.5 y §3.6. `config/index.ts` tenía un `;` aislado y sólo 3 tipos; `integration/index.ts` re-exportaba `resolveSisadPdfmeConfig` (valor) y ~12 tipos desde `../config/index.js` que ya no existían → `tsc` TS2724/TS2305 en `integration/index.ts(26,37,39-48)` y `adapters/index.ts(6)`, más el consumidor `features/pdfcomponent/integration/createLabPdfmeConfig.ts` sin `SisadPdfmeUiConfig`. `SisadPdfmeDocument`/`SisadPdfmeEventHandlers` habían perdido su `export` en `SisadPdfmeConfig.ts`.

## Archivos permitidos

- `src/sisad-pdfme/config/index.ts`
- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/integration/index.ts`
- `tests/unit/sisad-pdfme/config/public-api.test.ts` (nuevo)

## Archivos prohibidos

Resolver/migrador/servicio (Fases 2–3), `react/*` (WIP ajeno reciente), Canvas/snapshot/generator/pdf-lib. Sin cambios de comportamiento; sólo superficie de exports.

## Invariantes

Ningún símbolo re-exportado inexistente; no se altera la forma resuelta de la config ni `createSisadPdfmeConfig()`; sin nuevos errores `tsc` en archivos tocados.

## Diseño/patrón

Barrel canónico: `config/index.ts` re-exporta valores (`default/create/resolveSisadPdfmeConfig`) + tipos públicos desde `SisadPdfmeConfig.ts` y `SisadPdfmeRecipient` desde `recipients/recipientTypes.ts`. `SisadPdfmeConfig.ts` recupera `export` en `SisadPdfmeDocument` y `SisadPdfmeEventHandlers` (y elimina el `;` aislado). `integration/index.ts` suma `Provider{Props,Value}`, `Visibility/Ui/UiClassNames` a su bloque de tipos.

## Comandos de validación

``​`
npm run lint
npx vitest run tests/unit/sisad-pdfme/config
npm run build
``​`

## Criterios de aceptación

`import { resolveSisadPdfmeConfig, createSisadPdfmeConfig } from '@/sisad-pdfme/config'` funciona; host puede tipar `ResolvedSisadPdfmeConfig`, `SisadPdfmeDocument`, `SisadPdfmeEventHandlers`, `SisadPdfmeVisibilityConfig`, `SisadPdfmeUiConfig`, `Provider*` sin imports internos; gates focales verdes.

## Medición antes/después

- `tsc`: **resueltos** ~13 errores preexistentes (TS2724/TS2305 en `integration/index.ts`, `adapters/index.ts`, `createLabPdfmeConfig.ts`); **0 nuevos** por este cambio.
- Tests config: 7 → **10** (nuevo `public-api.test.ts`, 3 casos regresión).

## Riesgos y rollback

Riesgo bajo (sólo superficie de exports). El resto del delta `tsc` del árbol proviene del commit `d054900` (ajeno), no de este cambio. Rollback por archivo vía git.

## Memory delta

Sin delta durable nuevo; la nota de `[[listview-rightsidebar-testing-notes]]` sobre fallos antd en vitest sigue vigente.
