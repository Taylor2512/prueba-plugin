# Regression Matrix

## Unit

| Caso | Cobertura | Evidencia |
|---|---|---|
| defaults completos | `createSisadPdfmeConfig()` sin args resuelve una config usable | `tests/unit/sisad-pdfme/config/visibility.test.ts`, `tests/unit/sisad-pdfme/config/public-api.test.ts` |
| merge profundo sin mutación | los cambios de config no rompen los snapshots de entrada | `tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts` |
| arrays reemplazados, no concatenados | la resolución conserva la semántica esperada de listas | `tests/unit/sisad-pdfme/config/configSelectors.test.ts`, `tests/unit/sisad-pdfme/config/configMigration.test.ts` |
| precedencia canónica sobre legacy | la config canónica gana sobre aliases migrados | `tests/unit/sisad-pdfme/config/configMigration.test.ts`, `tests/unit/sisad-pdfme/config/public-api.test.ts` |
| migración de aliases | los aliases viejos se normalizan al shape nuevo | `tests/unit/sisad-pdfme/config/configMigration.test.ts` |
| combinaciones inválidas | la validación rechaza estados imposibles | `tests/unit/sisad-pdfme/config/configValidation.test.ts`, `tests/unit/sisad-pdfme/config/signatures.test.ts` |
| feature dependencies | features y acciones derivadas respetan dependencias | `tests/unit/sisad-pdfme/config/featureRegistry.test.ts`, `tests/unit/sisad-pdfme/config/actionConfigRegistry.test.ts`, `tests/unit/sisad-pdfme/config/componentRegistry.test.ts` |
| action state con razón | las acciones ocultas o deshabilitadas explican el motivo | `tests/unit/sisad-pdfme/ui/actions/designerActionState.test.ts`, `tests/unit/sisad-pdfme/config/designerUiMap.test.ts` |
| change impact | se distinguen cambios de presentación de cambios de runtime | `tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts`, `tests/unit/sisad-pdfme/config/designerUiMap.test.ts` |
| subscribe/unsubscribe | los consumidores reciben updates puntuales y se liberan bien | `tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts` |
| transaction emite una sola actualización | una transacción agrupa cambios y notifica una sola vez | `tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts` |

## Contract

| Caso | Cobertura | Evidencia |
|---|---|---|
| `createSisadPdfmeConfig()` funcional sin argumentos | el barrel público expone la fábrica y resuelve defaults | `tests/unit/sisad-pdfme/config/public-api.test.ts`, `tests/unit/generated/config/configResolver.test.ts` |
| API pública sin imports internos | el host usa el barrel y hooks públicos, no internals | `tests/unit/sisad-pdfme/config/public-api.test.ts` |
| config serializable sin handlers | la salida pública se mantiene compatible con transporte simple | `tests/unit/sisad-pdfme/config/public-api.test.ts` |
| tipos públicos accesibles | los tipos del barrel siguen exportados | `tests/unit/sisad-pdfme/config/public-api.test.ts` |
| misma entrada produce misma config canónica | resolver determinista para input equivalente | `tests/unit/generated/config/configResolver.test.ts`, `tests/unit/sisad-pdfme/config/public-api.test.ts` |

## React

| Caso | Cobertura | Evidencia |
|---|---|---|
| un service por Provider | cada provider mantiene su propia instancia de config | `tests/integration/sisad-pdfme/config-dynamic.test.tsx`, `tests/unit/sisad-pdfme/react/runtime-modes.test.tsx` |
| un RecipientRegistry por Provider | el scope de recipients no se comparte por accidente | `tests/unit/useSisadPdfmeController.recipients.test.tsx`, `tests/unit/recipientRegistry.test.ts` |
| wrappers comparten recursos | los wrappers del mismo host reusan recursos sin duplicarlos | `tests/unit/sisad-pdfme/react/runtime-modes.test.tsx`, `tests/integration/sisad-pdfme/config-dynamic.test.tsx` |
| cambio visual no recrea EventHub | un update de presentación conserva engine y hub | `tests/integration/sisad-pdfme/config-dynamic.test.tsx` |
| cambio de recipients no crea registry paralelo | los updates de recipients mutan el registry existente | `tests/unit/useSisadPdfmeController.recipients.test.tsx` |
| `useSyncExternalStore` actualiza solo consumidores relevantes | los consumers derivan estado sin recalcular de más | `tests/unit/sisad-pdfme/config/configSelectors.test.ts`, `tests/unit/sisad-pdfme/config/SisadPdfmeConfigService.test.ts` |

## Playwright

| Escenario actual | Archivo | Qué valida |
|---|---|---|
| `presentation-only updates keep runtime resources stable` | `tests/playwright/configuration/dynamic-config.spec.ts` | cambios de visibilidad no reconstruyen `designerEngine` ni `eventHub` |
| `runtime mode changes trigger controlled rebuilds` | `tests/playwright/configuration/dynamic-config.spec.ts` | el cambio de `runtime.mode` sí provoca rebuild controlado |
| `reset restores the initial config and diagnostics` | `tests/playwright/configuration/dynamic-config.spec.ts` | `reset()` vuelve al estado inicial y conserva diagnósticos |

### Escenarios de cierre

La task-card pide 16 escenarios de regresión para esta suite. El orden recomendado es:

1. deshabilitar `LeftSidebar`
2. ocultar `LeftSidebar` sin desactivar comandos
3. deshabilitar `RightSidebar`
4. habilitar solo panel `Fields`
5. habilitar `Fields` + `Detail`
6. activar `Comments` y `Documents`
7. deshabilitar `Moveable` manteniendo selección
8. deshabilitar `Selecto` manteniendo click simple
9. `readonly` permite inspeccionar y bloquea mutación
10. ocultar `Delete`
11. mostrar `Delete` deshabilitado con razón
12. activar/desactivar `Reassign`
13. cambiar densidad sin perder selección
14. cambiar layout sin perder zoom
15. cambiar flags calientes sin remount
16. cambiar `runtime.mode` con remount controlado

## Criterio de cierre

- `unit` confirma defaults, merge, validación, dependencias y transaction semantics.
- `contract` confirma barra pública, tipos y resolver determinista.
- `react` confirma scope por provider y updates granulares.
- `playwright` confirma estabilidad visual, rebuild controlado y reset.
- `Config QA` solo cierra cuando el suite Playwright completo y las capas previas quedan verdes contra la misma configuración canónica.
