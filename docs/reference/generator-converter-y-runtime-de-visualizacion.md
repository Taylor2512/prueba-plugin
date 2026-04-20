# Generator, Converter y runtime de visualización

## 1. Módulos clave fuera del editor

Aunque el foco visual suele ir al canvas, la plataforma se sostiene también sobre:

- `generator`
- `converter`
- `Viewer`
- `Form`
- `Preview`

## 2. `generator`

Este módulo representa la salida final hacia PDF. Su estabilidad es crítica.

### Debe garantizar
- compatibilidad con schemas soportados;
- layout consistente;
- respeto a estilos;
- serialización segura.

## 3. `converter`

El convertidor te da varias capacidades de producto:

- `pdf2img`
- `pdf2size`
- `img2pdf`

Eso te permite workflows como preview, roundtrip y validación documental.

## 4. Viewer y Form

### `Viewer`
Debería ser el runtime de visualización pura.

### `Form`
Debe ser el runtime interactivo para captura de datos.

## 5. `usePreviewRuntime`

La existencia de este hook indica una capa dedicada a preview/runtime, lo cual es correcto para desacoplar el editor de la experiencia de consumo.

## 6. Casos de uso de plataforma

- editor puro;
- formulario embebido;
- visor documental;
- exportador/generador;
- pipeline de conversión.

## 7. Recomendación de empaquetado

Si lo quieres vender o reutilizar, estos módulos deberían poder consumirse de forma independiente:

- `@platform/pdf/editor`
- `@platform/pdf/form`
- `@platform/pdf/viewer`
- `@platform/pdf/generator`
- `@platform/pdf/converter`

## 8. Riesgos

- acoplar demasiado editor y generator;
- duplicar lógica de layout;
- no versionar contratos entre schemas y generador.

## 9. Conclusión

La plataforma ya tiene los ingredientes para separarse en paquetes funcionales claros. Eso incrementa mucho su valor de reutilización.
