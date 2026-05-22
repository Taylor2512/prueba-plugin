<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Source of truth: .ai/ -->


# Instruction: inspector-transform-panel

## Objetivo

Reglas del inspector derecho para transformación y color ownership.

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
