# 03 Recipient Runtime State

## Propósito

Estado runtime de recipients y propagación visual.

## Alcance

Este documento aplica únicamente a `sisad-pdfme` como fork aislado, configurable y extensible.

## Reglas principales

- Cada destinatario/usuario debe poder tener un color único.
- El catálogo debe reflejar el color del destinatario activo.
- Los schemas existentes preservan su `ownerColor`.
- Transformaciones de schema seleccionado deben convivir con selección, toolbar, context menu, inline edit y shortcuts.
- Todo cambio debe ser testeable y documentado.

## Archivos relacionados

- `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `tests/unit/*`
- `tests/playwright/*`

## Criterios de aceptación

- [ ] El comportamiento es configurable.
- [ ] No se pierde geometría del canvas.
- [ ] Hay prueba unitaria o Playwright.
- [ ] La documentación está actualizada.
