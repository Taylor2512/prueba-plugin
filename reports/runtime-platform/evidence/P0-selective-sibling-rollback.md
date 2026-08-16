# Evidence — P0 selective sibling rollback / draft loss

- Worktree: `/Users/desarrollo1/Documents/proyectos de Taylor/frontend/prueba-plugin`
- Branch: `main` — HEAD al iniciar `73a5e87`, HEAD al cerrar `1d95c00`
- Árbol sucio preservado. Sin `reset`, `clean`, `stash` ni `checkout` global.

## FASE 1 — Identidad real de A/B/C/D

Resuelta desde el DOM vivo de `/runtime/form`, no por posición visual.

| | selector | `schema.type` | `schema.name` | uid | página | fila |
|---|---|---|---|---|---|---|
| A | `#text-text-0` | `text` | `text` | `text-0` | 0 | 1 |
| B | `#text-number-1` | `number` | `number` | `number-1` | 0 | 1 |
| C | `#text-fullName-2` | `fullName` | `fullName` | `fullName-2` | 0 | 1 |
| D | `#text-company-4` | `company` | `company` | `company-4` | 0 | 2 |

Todos en `unit/input index = 0` (un solo input row).

## FASE 2 — Repro

`tests/sibling-rollback.spec.ts`. Fallaba antes del fix:

```
Expected: "3333"   (C)
Received: "Ada Lovelace"
```

Matiz frente al parte inicial: C y D no quedaban vacíos, **revertían a su valor
inicial del template**. Es una reconstrucción desde el snapshot canónico, no un
borrado.

## FASE 3 — First divergence trace

Instrumentación temporal en `usePdfmeRuntimeInstance`, `text/uiRender` y
`usePreviewRuntime`, activada solo si el harness creaba `window.__RTP_TRACE`.
Retirada al cerrar; `grep -rn "RTP-TRACE-TEMP\|__RTP_" src/` → 0 resultados.

Divergencia por capas al escribir en C:

| capa | ¿conserva C? |
|---|---|
| DOM | sí (`"3333"`) |
| `text/uiRender` `commitText` | sí — dispara con `hasOnChange: true` |
| `Preview.onChange` → `handleOnChangeRenderer` | **no — nunca se invoca** |
| `Form.getInputs()` | no (`"Ada Lovelace"`) |
| `runtimeInputsMirrorRef` | no |
| `instance.setInputs` | no se llama |
| `runtime.destroy` / mount | no ocurre |

**CASO 1.** Y se descarta explícitamente el remount: `isolationKey` permaneció
`alice::contrato-marco`, sin eventos de destroy. La sospecha sobre `stateKey`
era infundada, como advertía el parte.

## Root cause

`createSchemaPlugin` (`src/sisad-pdfme/schemas/schemaBuilder.ts`) envuelve
`plugin.ui` con una capa de deduplicación por `(rootElement, schema.id)`.

- `text` = `createSchemaPlugin({ ui: renderTextUi })` → `text.ui` **ya viene
  envuelto**.
- `fullName`, `emailAddress`, `company`, `title` =
  `createSchemaPlugin({ ui: text.ui })` → **segunda capa sobre la primera**.

Con dos capas, la externa graba la firma de la emisión bajo la misma clave y la
interna la lee como duplicado, así que `originalOnChange` no se ejecuta **nunca**.
No es que deduplicara de más: descartaba el 100 % de las emisiones.

### Por qué B sobrevivía y C/D no

No era la posición. `text` y `number` definen su propio `ui` y solo se envuelven
una vez → comprometen valor. Los presets `textLike` reutilizan `text.ui` y se
envuelven dos veces → nunca comprometen. Al repintarse el formulario tras editar
A, los campos sin valor canónico volvían a su contenido inicial.

Mismo patrón latente en `select/index.ts`, `date/helper.ts` y
`signature/dateSigned.ts`, que invocan `text.ui` desde dentro de su propio `ui`.

### Alcance completo de la composición

Barrido `ui:\s*[a-zA-Z]+\.ui|[a-zA-Z]+\.ui\(` sobre `src/sisad-pdfme/schemas`:

| archivo | composición |
|---|---|
| `textLike/textLikeSchemaFactory.ts:50` | `ui: text.ui` |
| `signature/initials.ts:15` | `ui: baseSignature.ui` |
| `select/index.ts:155` | `await text.ui(...)` |
| `date/helper.ts:240` | `await text.ui(...)` |
| `signature/dateSigned.ts:64` | `text.ui({...})` |

`initials` no figuraba en el parte inicial y sufría el defecto idéntico:
`signature/index.ts:80` construye el base con `createSchemaPlugin`, así que
`initials` lo envolvía por segunda vez y **ninguna firma de iniciales llegaba a
los inputs canónicos**. El radio de impacto incluía la familia signing, no solo
`textLike`.

## Autoridad corregida

Un único archivo productivo: `src/sisad-pdfme/schemas/schemaBuilder.ts` (+24).

El `onChange` deduplicado se marca con `Symbol.for('sisad-pdfme.dedupedOnChange')`.
Si una envoltura recibe un `onChange` ya marcado, delega sin volver a envolver.

## Gates

```
vitest .../contracts/schemas .../contracts/form .../contracts/runtime
  Test Files  17 passed (17) | Tests  317 passed (317)

playwright tests/sibling-rollback.spec.ts tests/sibling-isolation.spec.ts
  10 passed

playwright tests/test-2.spec.ts tests/test-form-navigation.spec.ts
  4 passed

npm run test:sisad-pdfme
  Test Files  4 failed | 431 passed (435)
  Tests       4 failed | 2434 passed (2438)

npm run build            ✓ 8224 modules transformed
eslint <archivos tocados> 0 errors
git diff --check          limpio
git diff HEAD --stat      1 archivo productivo, +24
```

Los 4 fallos son preexistentes y ajenos: `files/converter/*.file.test.ts` marca
`./types.js` como no resuelto porque solo existe `converter/types.d.ts` y la
lista de extensiones de `tests/.../helpers/sourceContract.ts` no incluye `.d.ts`.
En la campaña anterior eran 5; el de `normalizeHostData` ya está corregido.

## Tests añadidos

- `tests/sibling-rollback.spec.ts` — repro literal del vídeo.
- `tests/sibling-isolation.spec.ts` — 9 casos: 20 ediciones alternadas,
  encadenado rápido, borrar y reescribir, vacío intencional, cero, transiciones
  entre plugins distintos, los cuatro presets entre sí, ausencia de remount,
  sibling nunca tocado.
- `tests/unit/.../schemas/schemaBuilderNestedPlugins.test.ts` — contrato de
  composición en la autoridad.

## Riesgos residuales

- El dedupe sigue activo en la capa más externa. Si en el futuro se compone un
  tercer nivel con un `onChange` construido a mano que imite la firma, la marca
  no aplica; la marca es la única señal.
- `select`, `date`, `time`, `dateTime` y `dateSigned` quedan cubiertos por el
  mismo fix pero **no** por tests E2E propios: requieren manejar widgets antd y
  file pickers. Recomendado cerrarlos antes de declarar esas familias.
- `checkbox`/`radioGroup`/`checkboxGroup` no pasan por `text.ui`; su aislamiento
  no lo cubre este incidente.
- La regla "sibling untouched no cambia" se verifica sobre el DOM. Un contrato
  fuerte necesitaría exponer los inputs canónicos al harness.
- `initials` queda cubierto por el fix pero sin test propio: sus emisiones nunca
  se caracterizaron. Cerrarlo junto con la familia signing.
- `_lastSigBySchemaId` sigue siendo un module global. Solo se usa cuando falta
  `rootElement`, que en runtime DOM siempre existe, así que hoy no afecta a dos
  Forms en el mismo realm; queda como deuda frente a la regla "sin module
  globals para estado de instancia".

## Re-verificación — 2026-08-14, HEAD `1d95c00`, árbol sucio intacto

Repetida sobre el mismo worktree, sin tocar el fix.

### Control negativo

Neutralizada temporalmente la guarda (`if (false && isDedupedOnChange(...))`) y
restaurada byte a byte después (`diff` contra copia previa: idéntico).

```
vitest schemaBuilderNestedPlugins.test.ts   4 failed (4)
playwright tests/sibling-rollback.spec.ts   1 failed
    sibling-rollback.spec.ts:54  →  expect(C).toHaveText('3333')
```

Los tests fallan sin el fix y pasan con él: caracterizan el defecto, no lo
acompañan.

### Gates

```
vitest schemaBuilderNestedPlugins.test.ts          4 passed (4)
playwright sibling-rollback + sibling-isolation   12 passed (12)
npm run test:sisad-pdfme
  Test Files  4 failed | 431 passed (435)
  Tests       4 failed | 2434 passed (2438)
eslint <archivos de la task>                       0 errors
tsc --noEmit                                     160 errors, 0 en los
                                                 archivos de esta task
```

Los 12 de Playwright frente a los 10 del cierre anterior: `sibling-isolation`
sumó los dos casos de schemas de opción (`select`/`checkbox` alternando con
texto).

`tsc --noEmit` está rojo en baseline (160 errores en Designer, Preview y varios
tests). Ninguno cae en `schemaBuilder.ts` ni en los tests añadidos
(`grep 'schemaBuilder\.ts|schemaBuilderNestedPlugins|sibling-'` → 0). **No se
declara typecheck verde**; queda como deuda previa, no de esta task.

Los 4 fallos de vitest son 2 archivos, ambos preexistentes:
`files/converter/index.ts.file.test.ts` y `files/converter/pdf2img.ts.file.test.ts`,
por `./types.js` (solo existe `converter/types.d.ts` y `helpers/sourceContract.ts`
no lista `.d.ts`).
