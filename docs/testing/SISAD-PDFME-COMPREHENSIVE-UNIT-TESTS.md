# SISAD-PDFME — suite unitaria integral

Baseline del pack actual: **403 source files / 86,008 líneas**.

## Entrega
- 403 test files dedicados, uno por cada archivo de `src/sisad-pdfme/**`.
- 1612 casos source-contract.
- 403 casos source→test.
- 190 casos unitarios de comportamiento/matriz.
- **2205 casos `it(...)` explícitos**.

Cada source dedicado valida existencia, merge markers, sintaxis TS/JS y resolución de imports
relativos. Esos checks NO sustituyen comportamiento: los contratos en `contracts/**` prueban
Form diff/sibling isolation, runtime modes, value adapters, option groups, schema registry,
recipients, traversal, conversiones y la matriz documentada de casos de uso.

El producto cartesiano completo de las dimensiones runtime generaría decenas de miles de
tests repetitivos. La estrategia correcta es pairwise/risk-driven en unitarios y Playwright
para Canvas/drag/drop/Moveable/Selecto/touch/IME/visual/PDF real.

## Inventario
| Dominio | Archivos | Líneas | Casos source-contract |
|---|---:|---:|---:|
| `ui` | 177 | 49,160 | 708 |
| `schemas` | 90 | 15,226 | 360 |
| `config` | 19 | 2,822 | 76 |
| `shared` | 16 | 3,158 | 64 |
| `react` | 14 | 1,027 | 56 |
| `common` | 12 | 3,229 | 48 |
| `converter` | 10 | 547 | 40 |
| `integration` | 8 | 1,524 | 32 |
| `recipients` | 8 | 803 | 32 |
| `runtime` | 8 | 1,416 | 32 |
| `contracts` | 7 | 1,834 | 28 |
| `collaboration` | 6 | 1,150 | 24 |
| `generator` | 6 | 818 | 24 |
| `adapters` | 5 | 122 | 20 |
| `canvas` | 3 | 547 | 12 |
| `templates` | 3 | 197 | 12 |
| `browser` | 2 | 71 | 8 |
| `assignments` | 1 | 588 | 4 |
| `commands` | 1 | 214 | 4 |
| `comments` | 1 | 494 | 4 |
| `context` | 1 | 111 | 4 |
| `devtools` | 1 | 68 | 4 |
| `documents` | 1 | 269 | 4 |
| `editor` | 1 | 178 | 4 |
| `externalForms` | 1 | 383 | 4 |
| `index.ts` | 1 | 52 | 4 |

## Ejecución
```bash
npm run test:sisad-pdfme:map
npm run test:sisad-pdfme:count
npm run test:sisad-pdfme:files
npm run test:sisad-pdfme:contracts
npm run test:sisad-pdfme
```

Tras renames/add/remove:
```bash
npm run test:sisad-pdfme:generate
npm run test:sisad-pdfme:map
```
