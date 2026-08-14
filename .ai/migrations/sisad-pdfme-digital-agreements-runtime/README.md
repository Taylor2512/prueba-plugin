# Hash-checked Brain migration

Los archivos `../../archive/migrations/digital-agreements-runtime-brain-targets/**` son reemplazos propuestos para documentos canónicos ya
existentes. **No copiarlos a ciegas.** Ejecutar el helper:

```bash
node tools/sisad-pdfme-runtime/apply-../../archive/migrations/digital-agreements-runtime-brain-targets.mjs .
node tools/sisad-pdfme-runtime/apply-../../archive/migrations/digital-agreements-runtime-brain-targets.mjs . --apply
```

El apply sólo modifica un target si su SHA1 actual comienza con el baseline registrado.
Si el Brain vivo cambió, reporta `CONFLICT_HASH` y se debe hacer merge manual.

<!-- project-tools:navigation:start -->
## Navegación generada
<!-- project-tools:navigation:end -->
