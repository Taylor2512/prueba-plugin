# Generación, conversión y paridad visual

> Documentación generada para consumo externo de `sisad-pdfme`.

## Flujo
```text
Designer guarda template
→ Form completa inputs
→ Viewer valida vista final
→ validateRequiredFields
→ generate
→ PDF final
```

## APIs
```ts
const sizes = await pdf2size(pdfBytes);
const images = await pdf2img(pdfBytes);
const pdf = await img2pdf(images);
const output = await generate({ template, inputs, plugins });
```

## Reglas
- Cachear `pdf2size` y `pdf2img` por documento/hash.
- No recalcular tamaño en cada scroll.
- Viewer y generator deben coincidir visualmente.
- Plugins con `ui` también deben tener `pdf` si generan salida.
