<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Source of truth: .ai/ -->


# Instruction: schema-icon-color-sync

## Objetivo

Reglas para PluginIcon, fallback icons, catalog cards y CSS vars.

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
