# Prompt — Implementar faltantes del contrato por proceso

Objetivo: completar lo faltante de SISAD PDFME sin refactor masivo.

## Reglas

- Cargar `application-behavior-contract-context.md` y `process-flow-implementation-context.md`.
- Elegir un proceso por lote.
- No mezclar CSS visual con corrección funcional.
- Cada cambio debe incluir test unitario y/o Playwright.

## Fases

1. Identificar proceso con mayor riesgo.
2. Mapear componentes reales con `rg`.
3. Crear test que falle.
4. Implementar mínimo cambio.
5. Validar build/lint/tests.
6. Actualizar docs/matriz.

## Entrega

```md
## Proceso completado
## Faltante corregido
## Archivos modificados
## Tests
## Riesgos residuales
```
