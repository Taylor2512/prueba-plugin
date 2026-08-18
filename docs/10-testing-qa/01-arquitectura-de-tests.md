# Arquitectura de tests

Una jerarquía por capa, una autoridad por concepto. Este documento explica las
decisiones que el tooling no puede derivar solo.

## Árbol canónico

```text
tests/
├── unit/
│   ├── behavior/      # decisiones y casos límite, por dominio
│   ├── contracts/     # contratos transversales de API/superficie
│   └── files/         # source-contracts GENERADOS (uno por archivo productivo)
├── integration/       # interacción entre autoridades
├── e2e/
│   ├── designer/
│   ├── form/
│   │   ├── digital-agreements/
│   │   └── multi-document/
│   ├── runtime/
│   ├── accessibility/
│   └── regressions/
├── support/
│   ├── playwright/    # contratos de superficie e interacciones
│   ├── builders/      # harnesses de construcción de datos
│   ├── assertions/    # helpers de aserción reutilizables
│   └── manifest/      # manifest generado de archivos fuente
└── tooling/           # self-tests del tooling empaquetado (ver más abajo)
```

Reglas:

- **Ningún `*.spec.ts` suelto en `tests/`.** Un test sin capa no tiene dueño.
- `tests/e2e/**` es la única raíz de Playwright; el resto lo ejecuta vitest.
- `tests/unit/files/**` está generado. No se edita a mano: se regenera con
  `npm test -- source-tests --apply`.

## Las cuatro dimensiones de cobertura

Se cuentan por separado a propósito, porque miden cosas distintas:

| Dimensión | Dónde vive | Qué demuestra |
|---|---|---|
| Source | `tests/unit/files` | El archivo existe, parsea y resuelve sus imports |
| Behavior | `tests/unit/behavior`, `tests/unit/contracts` | Decisiones y casos límite |
| Integration | `tests/integration` | Interacción entre autoridades |
| E2E | `tests/e2e` | Journeys reales observables |

**Un source-contract generado nunca cuenta como cobertura funcional.**
`coverage.mjs` excluye la capa `SOURCE` del cómputo: tener 426 archivos con
cuatro aserciones cada uno no demuestra que Guardar, Undo, multiusuario, firma o
generación de PDF funcionen.

Un caso de uso queda `CUBIERTO` sólo con marcadores `@caso ID` explícitos en al
menos **dos** capas de comportamiento. La coincidencia textual produce
`REVISAR`, nunca cobertura.

## Contratos de superficie en E2E

No existe un `abrirSisad()` genérico. Cada runtime espera su propia superficie:

| Helper | Contrato |
|---|---|
| `abrirDesigner` | `[data-sisad-pdfme-root="designer"]` + página de canvas visible |
| `abrirForm` | `[data-sisad-pdfme-root="form"]` + host del runtime |
| `abrirViewer` | `[data-sisad-pdfme-root="viewer"]` + host del runtime |
| `abrirRuntime` | `[data-sisad-pdfme-root]` + host del runtime |

El helper anterior exigía la clase CSS `.sisad-pdfme-root` para **cualquier**
ruta. Esa clase sólo está declarada en la hoja de estilos: ningún componente la
aplica. Lo que los wrappers publican es el **atributo** `data-sisad-pdfme-root`
con el modo. La consecuencia era que todos los E2E de `tests/e2e/**` fallaban
aunque la pantalla montara correctamente.

La lección general: una clase de layout no es un contrato de test. El contrato
es la superficie funcional observable.

## Paralelismo

Los E2E corren con **un solo worker**, también en local. Toda la suite ataca un
único servidor de Vite en desarrollo y montar el Designer es caro; con los
workers por defecto varias instancias competían y el `beforeEach` agotaba los
30 s. Diez de dieciocho specs de Designer fallaban por contención y pasaban al
ejecutarse aislados. Subir el timeout habría escondido el problema.

Un caso legítimamente largo se declara con `test.slow()` en el propio test —no
relajando el timeout global— y sólo después de comprobar que **pasa** con más
tiempo.

## `tests/tooling` no sigue esta jerarquía

Son self-tests del tooling que se distribuye como paquete: `MANIFEST.json`,
`SHA256SUMS.txt` y `scripts/install-project-tools.mjs` fijan esas rutas exactas.
Moverlos rompería la autoridad de empaquetado. Se ejecutan con `node`, no con
vitest, y `verify` los invoca por separado.

## Reportes

Autoridades estables, todas regenerables:

| Archivo | Genera |
|---|---|
| `reports/testing/TEST-AUDIT.md` / `.json` | `npm test -- audit` |
| `reports/testing/USE-CASE-COVERAGE.md` / `.json` | `npm test -- coverage` |
| `reports/testing/TEST-MIGRATION-MAP.md` / `.json` | `npm test -- organize` |
| `reports/testing/DEFECTOS-PRODUCTO.md` | manual — defectos con test rojo |

`DEFECTOS-PRODUCTO.md` documenta los tests que fallan **a propósito**. Un fallo
real del producto no se convierte en `skip`, timeout mayor ni aserción más
débil: se evidencia y el gate sigue rojo.
