# Font Registry Contract

## Propósito

Usar una autoridad de fuentes compartida por schemas textuales, firma e iniciales.

## Descriptor

```ts
type FontDescriptor = {
  key: string;
  label: string;
  cssFamily: string;
  pdfFontName?: string;
  source: 'system' | 'bundled' | 'host';
  category?: 'sans' | 'serif' | 'handwriting' | 'monospace' | 'display';
};
```

La implementación final puede extender este contrato sin crear registries paralelos.

## Firma e iniciales

`SignatureStyleDefinition` referencia `fontKey` y conserva:

- styleId;
- fontStyle;
- fontWeight;
- skewDeg;
- letterSpacing.

Firma e iniciales adoptadas por la misma identidad usan el mismo `styleId`.

No mutar la receta histórica de un `styleId` ya persistido. Nuevos estilos usan IDs nuevos.

## Loading

Antes de rasterizar una firma:

```text
ensureFontLoaded
→ ready
→ preview
→ artifact
```

No rasterizar silenciosamente un fallback y cambiar luego de apariencia.

## Paridad

```text
Designer/Form preview
=
Viewer
=
Generated PDF
```

Una fuente disponible sólo en CSS no cuenta como paridad PDF.

## Recursos host

Fuentes host-provided se inyectan como runtime resources. No guardar bytes de fuentes en
el schema JSON.
