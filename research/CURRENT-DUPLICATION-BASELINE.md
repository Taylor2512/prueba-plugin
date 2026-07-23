# Baseline de duplicidad actual

## Reporte global

- 529 archivos.
- 94.143 líneas.
- 103 clones.
- 2.121 líneas duplicadas (2,25%).

## Clasificación manual de bloques

- 61 clones en `src/sisad-pdfme/pdf-lib` (vendor).
- 26 clones en `documentacion-common-sisad-pdfme.md` (consolidado/generado).
- 16 clones en código propio.

## Código propio prioritario

- `smartPlacement.ts`: 64 líneas.
- `useDesignerKeyboardShortcuts.ts`: dos bloques de 35 líneas más cruces menores.
- `RightSidebar.tsx`: 18 líneas.
- `detailSchemas.ts` / `detailSectionTaxonomy.ts`: 19 líneas.
- overlays, selection commands, clipboard, modal y actions: bloques menores.

La métrica global no debe presentarse como deuda homogénea. El objetivo de sprint es reducir `owned`, no reescribir upstream ni editar documentos generados.
