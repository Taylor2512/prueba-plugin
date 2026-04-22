# Plan de migración a `platform/pdf`

## 1. Por qué migrar

El proyecto ya no es una simple modificación de `pdfme`. Funcionalmente y visualmente es un fork-producto con:

- engine propio;
- runtime extendido;
- colaboración;
- inspector avanzado;
- persistencia y API por field;
- branding parcial propio.

## 2. Problema actual

Aún conserva bastante identidad nominal heredada. Eso afecta:

- claridad de plataforma;
- venta/reutilización;
- documentación;
- percepción de propiedad intelectual de producto.

## 3. Objetivo de migración

Pasar de una estructura heredada a una plataforma explícita:

```text
src/platform/pdf/core
src/platform/pdf/editor
src/platform/pdf/schemas
src/platform/pdf/generator
src/platform/pdf/converter
src/platform/pdf/pdf-lib
```

## 4. Fases recomendadas

### Fase 1: branding visible
- nombres públicos;
- docs;
- labels visibles.

### Fase 2: aliases
- `@platform/pdf/*`
- compatibilidad temporal con aliases anteriores.

### Fase 3: carpetas y exports
- mover módulos;
- preservar índices públicos.

### Fase 4: CSS prefix
- pasar a prefijo de marca o de plataforma.

### Fase 5: contratos públicos
- estabilizar API pública.

## 5. Surface API recomendada

- `PdfEditor`
- `PdfViewer`
- `PdfFormView`
- `PdfEditorEngineBuilder`

## 6. Beneficios comerciales

- naming neutral y vendible;
- posibilidad de múltiples productos encima;
- separación clara entre plataforma y feature app.

## 7. Riesgos de migración

- imports rotos;
- tests que referencian nombres viejos;
- CSS selectors heredados;
- documentación desalineada.

## 8. Recomendación operativa

Hacer migración con:
- branch dedicada;
- script de renombre;
- aliases temporales;
- pruebas Playwright + unit.

## 9. Criterio de éxito

La migración será exitosa cuando:
- el producto compile igual;
- la API pública sea coherente;
- el branding heredado desaparezca de la superficie principal;
- la documentación deje de presentar el editor como una simple variante de pdfme.
