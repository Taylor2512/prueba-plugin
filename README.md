# Suite integral de pruebas — SISAD PDFME

Suite generada a partir del código, documentación, estilos y especificación funcional consolidados el 16 de julio de 2026.

## Alcance

Incluye pruebas para:

- catálogo y familias de schemas;
- option groups, checkbox/radio/select;
- firma y providers;
- recipients, permisos, colores y registry;
- assignments;
- documents, páginas y routing;
- comentarios y anchors;
- snapshot, migración y validación;
- runtime Designer/Form/Viewer;
- teclado y acciones;
- LeftSidebar;
- RightSidebar, ListView y DetailView;
- Docs, Comments y Reasignar;
- Canvas, multipágina, drag/drop y zoom;
- selector de usuario activo;
- regresiones visuales y migración Tailwind.

## Integración

Desde la raíz de `prueba-plugin`:

```bash
unzip SISAD_PDFME_TEST_SUITE.zip -d /tmp/sisad-pdfme-tests
cp -R /tmp/sisad-pdfme-tests/sisad-pdfme-generated-test-suite/tests ./
```

Los archivos se ubican en subcarpetas `generated`, por lo que no reemplazan pruebas existentes:

```txt
tests/unit/generated/
tests/playwright/generated/
```

## Ejecución

```bash
npx vitest run tests/unit/generated
npx playwright test tests/playwright/generated --project=chromium
```

Ejecución por dominio:

```bash
npx vitest run tests/unit/generated/recipients
npx vitest run tests/unit/generated/schemas
npx playwright test tests/playwright/generated/right-sidebar --project=chromium
npx playwright test tests/playwright/generated/canvas --project=chromium
```

## Consideraciones

1. Las pruebas unitarias importan la API real desde `@/sisad-pdfme/...` y `@sisad-pdfme/schemas`.
2. Los specs Playwright usan la ruta `/lab/multi-document-routing` y selectores semánticos con fallbacks.
3. Funciones opcionales se omiten mediante `test.skip()` cuando el host las deshabilita por configuración.
4. Casos que documentan defectos confirmados pero todavía no corregidos usan `it.todo` o `test.fixme` para no bloquear la integración inicial.
5. `css-migration-budget.test.ts` usa el presupuesto observado en los archivos analizados: 47 `@apply` en `sisad-pdfme.css` y 1 en `tokens.css`. Reduzca esos límites cuando avance la migración.
6. Las capturas de `visual-baseline.spec.ts` requieren crear/aceptar snapshots la primera vez:

```bash
npx playwright test tests/playwright/generated/visual/visual-baseline.spec.ts --update-snapshots
```

## Archivos de apoyo

- `TEST_CASE_MATRIX.csv`: matriz de casos y cobertura.
- `KNOWN_GAPS.md`: riesgos y casos pendientes detectados.
- `INTEGRATION_CHECKLIST.md`: pasos para integrar sin dañar las pruebas actuales.
- `scripts/run-generated-tests.sh`: ejecución completa.
