# Estrategia de pruebas

## Pirámide

1. Unitarias puras.
2. Componentes React.
3. Integración host/runtime.
4. Playwright focal.
5. Barrido global.
6. Baseline visual.

## Clasificación

```txt
implementación
test stale
infraestructura
entorno
flaky
dependencia
```

No cambiar expected antes de clasificar.

## Gate mínimo

```bash
npm run lint
npm run build
npx vitest run
npx playwright test <specs focales> --project=chromium
```
