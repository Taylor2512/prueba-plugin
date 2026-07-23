# Entrega SISAD PDFME — reducción de duplicidad

Este ZIP es un overlay: conserva las rutas originales del proyecto y contiene únicamente archivos modificados/nuevos.

## Aplicación

1. Extraer en la raíz de `prueba-plugin`.
2. Revisar `ENTREGA/INFORME_DEDUP.md` y `ENTREGA/MANIFEST_CAMBIOS.txt`.
3. Ejecutar lint, build, quality, unit tests y Playwright en el repositorio original.

## Alternativa

Usar `ENTREGA/sisad-pdfme-dedup.patch` con `git apply --check` y `git apply`.

## Advertencia

No se modificaron archivos truncados/redactados del consolidado ni el fork interno de `pdf-lib`. No se afirma que el build completo haya pasado en el sandbox porque no se recibieron dependencias instaladas ni el checkout íntegro.
