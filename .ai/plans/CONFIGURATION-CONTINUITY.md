# Continuidad de configuración

## Decisión

Mantener `SisadPdfmeGlobalConfig` como contrato y añadir una fachada por Provider:

`SisadPdfmeConfigService`

No usar singleton global.

## Estado efectivo

`registered + supported + enabled + visible + permitted + available + active + executable + reason`

## Canonicalización

- `visibility` es la fuente visual;
- `theme.density` es la densidad;
- `sidebars` controla comportamiento;
- `recipients.activeRecipientId` es canónico;
- `ui` queda para presentación;
- aliases legacy se migran con warnings.

## Fases

1. reparar exports;
2. auditar lectores directos;
3. config v2 y migración;
4. service y selectors;
5. registries de features/actions;
6. Provider;
7. sidebars/actions;
8. Canvas;
9. schemas/inspector;
10. colaboración/documentos/firmas;
11. configuración dinámica;
12. QA y documentación.

## Protección

No reescribir geometría, snapshot o generator para implementar flags.
