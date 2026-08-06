# SISAD PDFME — Documentación de implementación V2

Overlay preparado para la raíz del repositorio `prueba-plugin`.

## Propósito

Actualizar la documentación para que un equipo externo pueda copiar,
configurar, integrar, probar y mantener SISAD PDFME sin depender de conocimiento
tácito.

## Uso

```bash
unzip SISAD-PDFME-DOCUMENTACION-IMPLEMENTACION-V2.zip

rsync -a \
  SISAD-PDFME-DOCUMENTACION-IMPLEMENTACION-V2/ \
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/
```

No use `--delete`.

Después revise el diff y ejecute los gates indicados en `DOCS-MERGE-MAP.md`.
