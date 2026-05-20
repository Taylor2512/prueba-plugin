# Índice maestro y ruta de lectura

> Documentación generada para consumo externo de `sisad-pdfme`.

## Propósito
Este paquete reorganiza la documentación del plugin para que pueda ser usado fuera del laboratorio y dentro de otros proyectos como SISAD Web.

## Fuentes analizadas
| Fuente | Archivo | Cobertura | Uso |
| --- | --- | --- | --- |
| Código unificado | plugin-sisad-pdfme.txt | 416 archivos TS/JS detectados | APIs, componentes, tests y flujos |
| Documentación existente | plugin-sisad-pdfme.md | 270 archivos MD reportados | Base documental previa |
| Estilos unificados | styles-sisad-pdfme.css | 4 archivos CSS reportados | Tokens, clases y layout |

## Ruta de lectura recomendada
1. `01-arquitectura/01-vision-general.md` para entender el producto.
2. `02-api-publica/01-entrypoints.md` antes de importar desde otro proyecto.
3. `03-runtime/01-designer-form-viewer.md` para montar Designer, Form y Viewer.
4. `04-componentes/02-canvas-interacciones.md` si se modifican coordenadas, Selecto o Moveable.
5. `05-schemas/01-registry-y-plugins.md` para extender campos.
6. `06-funcionalidades` para multidocumento, multiusuario, assignments, comentarios y persistencia.
7. `07-integracion` para consumirlo en SISAD Web u otro host.
8. `08-calidad` para tests, troubleshooting y reducción de redundancia visual.

## Alcance
- Incluye APIs públicas, componentes internos relevantes, flujos de runtime, ejemplos, contratos futuros y checklist.
- No asume backend real: los ejemplos actuales deben seguir funcionando con estado local/mocks.
- SISAD Web se considera implementación de referencia incompleta, no fuente de verdad.
