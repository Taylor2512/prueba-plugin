# Checklist de integración

## Antes de copiar

- [ ] Crear una rama o checkpoint.
- [ ] Confirmar que `vitest.config.ts` incluye `tests/unit/**/*.test.{ts,tsx,js,jsx}`.
- [ ] Confirmar que `playwright.config.ts` incluye `tests/playwright/**/*.spec.ts`.
- [ ] Levantar el lab en `http://localhost:5174`.
- [ ] Confirmar que `/lab/multi-document-routing` existe.

## Después de copiar

- [ ] Ejecutar `npx vitest run tests/unit/generated`.
- [ ] Corregir imports únicamente si el repositorio cambió después del pack analizado.
- [ ] Ejecutar Playwright por dominio.
- [ ] Revisar tests omitidos por funcionalidades opcionales.
- [ ] Crear snapshots visuales en Chromium.
- [ ] Ratchetear los presupuestos de CSS después de cada lote Tailwind.

## No hacer

- No reemplazar `tests/unit/setupTests.ts`.
- No mover las pruebas generadas fuera de `generated` hasta estabilizarlas.
- No adaptar una regresión cambiando el expected para que pase sin investigar.
- No agregar `waitForTimeout` como sincronización principal.
- No depender exclusivamente de clases Tailwind en E2E; usar roles, nombres, data attributes y test IDs.
