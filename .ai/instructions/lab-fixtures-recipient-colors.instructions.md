# Instruction: lab-fixtures-recipient-colors

## Objetivo

Reglas para fixtures de laboratorio con usuarios de color único.

## Reglas

- Mantener `sisad-pdfme` aislado y configurable.
- No duplicar lógica entre componentes.
- Exponer contratos mediante props, commands, events o snapshot.
- Cubrir cambios con tests.
- Actualizar documentación cuando cambie un contrato.

## Validación mínima

- `npm run test` o `npx vitest run` para lógica pura.
- `npx playwright test` para canvas, color visual o transformaciones.
- `npm run build` cuando cambien tipos o API pública.
