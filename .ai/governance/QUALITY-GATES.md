# Gates de calidad

## Base

```bash
git diff --check
npm run lint
npm run build
npm run quality:duplicates:strict
npm run quality
```

## Según cambio

| Superficie | Gate adicional |
|---|---|
| schema/plugin | unit + Form/Viewer/Generator + snapshot |
| canvas | Playwright selección/move/resize/multipágina |
| inspector | unit de property paths + Playwright |
| snapshot | roundtrip + migración legacy |
| CSS/layout | visual/structural Playwright |
| adapters/public API | contract tests + build consumidor |

## Evidencia

No uses “debería funcionar”. Registra comando, resultado, alcance y limitaciones.
