# Manual de portabilidad e integración — SISAD PDFME

Este paquete documenta cómo copiar `src/sisad-pdfme` e integrarlo en otro proyecto React/Vite.

## Qué contiene

- manual principal de instalación e integración;
- catálogo funcional de los módulos públicos;
- referencia completa de configuración y visibilidad;
- API de controller, hooks, adapters y eventos;
- ejemplos de configuración;
- inventario de limitaciones actuales;
- checklist de portabilidad.

## Base revisada

La documentación se elaboró a partir de la implementación consolidada del proyecto `prueba-plugin` generada el 28 de julio de 2026.

No se modificó el código fuente del componente.
No se ejecutaron `build`, `lint`, Vitest ni Playwright durante la generación de este paquete.

## Orden de lectura

1. `docs/07-integraciones/08-manual-portabilidad-sisad-pdfme.md`
2. `docs/08-api-reference/04-configuracion-completa.md`
3. `docs/08-api-reference/05-api-publica-controller-hooks-adapters.md`
4. `docs/13-ejemplos/06-integracion-copy-paste.md`
5. `docs/13-ejemplos/07-presets-configuracion.md`
6. `reports/portability/CURRENT-IMPLEMENTATION-GAPS.md`
7. `reports/portability/PORTABILITY-CHECKLIST.md`
