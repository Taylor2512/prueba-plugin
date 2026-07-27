# Arquitectura de configuración

Una instancia de configuración por `SisadPdfmeProvider`, no singleton global.

## Estados separados

- registered;
- supported;
- enabled;
- visible;
- permitted;
- available;
- active;
- executable;
- reason.

## Fuentes

`defaults → presets → legacy migration → host config → runtime overrides → permissions/context`

Los componentes consultan selectores, no interpretan el objeto global.

Cambios se clasifican como:

- `ui-state`;
- `runtime-options`;
- `engine-rebuild`;
- `runtime-remount`.

Véase `.ai/plans/CONFIGURATION-CONTINUITY.md`.
