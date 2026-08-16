# Documentación técnica — `@sisad-pdfme/converter`

## 1. Propósito

Este conjunto de archivos forma el paquete de conversión de SISAD PDFME. Su objetivo es aislar operaciones de bajo nivel relacionadas con PDF e imágenes:

```txt
PDF -> imágenes
PDF -> tamaños de página
imágenes -> PDF
```

El diseño separa la lógica core de conversión de los detalles de entorno. Por eso `pdf2img.ts` y `pdf2size.ts` reciben un objeto `Environment`, mientras que `index.browser.ts` y `index.node.ts` inyectan implementaciones concretas para navegador o Node.

## 2. Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `img2pdf.ts` | Crea un PDF nuevo insertando una imagen por página. |
| `pdf2img.ts` | Renderiza páginas PDF a imágenes usando un adaptador de entorno. |
| `pdf2size.ts` | Lee tamaños de páginas PDF y los convierte a milímetros. |
| `index.browser.ts` | Entry point para navegador: PDF.js worker URL, DOM canvas y dataURL. |
| `index.node.ts` | Entry point para Node: PDF.js worker y `canvas` opcional. |
| `index.ts` | Entry point público por defecto, reexporta browser y alias semánticos. |
| `modules.d.ts` | Declaraciones TypeScript para workers de PDF.js. |
| `types.d.ts` | Tipo común `ImageType`. |

## 3. Flujo `pdf2img`

```txt
ArrayBuffer PDF
  -> index.browser.ts / index.node.ts
  -> pdfjsLib.getDocument(...)
  -> pdf2img.ts
  -> getPage(pageNum)
  -> page.getViewport({ scale })
  -> createCanvas(width, height)
  -> page.render(...)
  -> canvasToArrayBuffer(...)
  -> ArrayBuffer[]
```

Punto clave: `pdf2img.ts` no crea directamente `document.createElement` ni `require('canvas')`; esa dependencia se inyecta.

## 4. Flujo `pdf2size`

```txt
ArrayBuffer PDF
  -> getDocument(pdf)
  -> numPages
  -> getPage(i + 1)
  -> getViewport({ scale, rotation: 0 })
  -> pt2mm(width/height)
  -> Size[]
```

Esto permite que el diseñador conozca dimensiones reales del PDF en milímetros antes de renderizar páginas o ubicar schemas.

## 5. Flujo `img2pdf`

```txt
ArrayBuffer[] imágenes
  -> detectar jpeg/png por bytes mágicos
  -> PDFDocument.create()
  -> embedJpg/embedPng
  -> addPage()
  -> calcular tamaño página
  -> convertir márgenes mm -> pt
  -> encajar imagen sin deformar
  -> centrar imagen
  -> doc.save()
  -> ArrayBuffer PDF
```

## 6. Riesgos técnicos detectados

### 6.1 `index.node.ts`: `canvas` puede no existir

El archivo intenta cargar `canvas` con `require('canvas')`. Si no está instalado, `pdf2img` fallará al llamar `createCanvas(...)`. Esto es aceptable si `canvas` es una dependencia opcional, pero conviene mostrar un error más explícito antes de llamar la función.

Recomendación futura:

```ts
if (!createCanvas) {
  throw new Error('The optional canvas package is required to use pdf2img in Node.js');
}
```

### 6.2 `img2pdf.ts`: `imageType` está declarado pero no se usa

`Img2PdfOptions` contiene `imageType`, pero la implementación detecta el tipo desde el buffer y no usa esa opción. Esto no rompe, pero puede confundir.

Opciones:

```txt
1. Eliminar imageType de Img2PdfOptions.
2. Usarlo como override explícito antes de detectar bytes.
3. Mantenerlo documentado como reservado/futuro.
```

### 6.3 `pdf2img.ts`: rango end es inclusivo

El código convierte `range.end` a `end + 1`, por lo que el rango es inclusivo en la API pública.

Ejemplo:

```txt
start: 0, end: 0 => página 1
start: 1, end: 2 => páginas 2 y 3
```

Esto debe documentarse para evitar confusión con `slice`, donde el final suele ser exclusivo.

### 6.4 `pdf2size.ts`: usa Promise.all para todas las páginas

Para PDFs grandes, leer todas las páginas en paralelo puede consumir memoria. Si aparecen PDFs muy pesados, conviene cambiar a procesamiento secuencial o limitar concurrencia.

### 6.5 `index.ts`: reexporta browser por defecto

Esto está bien para builds frontend, pero en Node debe existir una configuración de package exports o import directo a `index.node.ts`.

Ejemplo futuro en `package.json`:

```json
{
  "exports": {
    ".": {
      "browser": "./dist/index.browser.js",
      "node": "./dist/index.node.js",
      "default": "./dist/index.browser.js"
    }
  }
}
```

## 7. Regla de arquitectura

Este módulo debe permanecer como infraestructura técnica. No debe importar ni conocer:

```txt
Designer
Canvas
Moveable
Selecto
SnapshotAdapter
schemas
DetailView
consumer host
Uanataca
reglas de negocio SISAD
```

Debe exponer utilidades puras consumibles por UI, generator, importadores o adaptadores.

## 8. Validación manual sugerida

```txt
[ ] Convertir PDF de 1 página a imagen.
[ ] Convertir PDF multipágina a imágenes.
[ ] Convertir solo rango start/end.
[ ] Leer tamaños de PDF A4.
[ ] Leer tamaños de PDF con páginas diferentes.
[ ] Convertir PNG a PDF.
[ ] Convertir JPG a PDF.
[ ] Convertir varias imágenes a PDF multipágina.
[ ] Probar browser con worker PDF.js.
[ ] Probar Node con paquete canvas instalado.
```
