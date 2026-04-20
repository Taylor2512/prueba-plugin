# Segunda tanda de documentación técnica por áreas concretas

## Objetivo

Esta segunda tanda reorganiza la documentación del proyecto **sisad-pdfme** por áreas funcionales concretas, con foco en arquitectura, contratos, runtime, canvas, inspector, colaboración y pruebas.

A diferencia de la primera entrega, aquí el contenido está separado por subsistemas reales del código. La intención es que cada documento pueda ser leído por una persona distinta del equipo según su responsabilidad:

- arquitectura y motor
- canvas y overlays
- panel derecho, detalle y widgets
- configuración de schemas: persistencia, API y Form JSON
- colaboración y sincronización
- testing, deuda técnica y guía de evolución

## Fuentes tomadas en cuenta

Esta tanda se construyó a partir de:

- estructura actual del código consolidado del proyecto
- documentación Markdown previa del repositorio
- estilos globales y estilos de interacción del editor
- pruebas unitarias y Playwright existentes
- evolución del fork desde `pdfme` hacia `sisad-pdfme`

## Mapa de documentos

1. `01-ARQUITECTURA-PLATAFORMA-Y-ENGINE.md`
2. `02-CANVAS-OVERLAYS-E-INTERACCIONES.md`
3. `03-PANEL-DERECHO-DETALLE-Y-WIDGETS.md`
4. `04-SCHEMA-CONFIG-PERSISTENCIA-API-FORMJSON.md`
5. `05-COLABORACION-SINCRONIZACION-Y-COMENTARIOS.md`
6. `06-TESTING-CALIDAD-Y-HOJA-DE-RUTA.md`

## Lectura recomendada

### Si vas a tocar el motor o contratos
Empieza por:
- Arquitectura de plataforma y engine
- Schema config, persistencia, API y Form JSON
- Colaboración y sincronización

### Si vas a tocar UX del editor
Empieza por:
- Canvas, overlays e interacciones
- Panel derecho, detalle y widgets
- Testing y hoja de ruta

### Si vas a preparar venta o reutilización como plataforma
Empieza por:
- Arquitectura de plataforma y engine
- Testing, calidad y hoja de ruta
- Schema config y runtime

## Resumen ejecutivo

El proyecto ya no se comporta como una simple integración de `pdfme`. En la práctica, se ha convertido en una plataforma de edición PDF con identidad propia. Los indicadores más claros son:

- separación fuerte por paquetes internos: `common`, `converter`, `generator`, `pdf-lib`, `schemas`, `ui`
- engine fluido con configuración de sidebars, canvas, HTTP, schema identity y colaboración
- runtime de persistencia, API y salida Form JSON por schema
- editor visual con catálogo izquierdo, inspector derecho, overlays y edición inline
- pruebas dedicadas a interacción, shell, colaboración y cambios de schema

La recomendación estructural sigue siendo avanzar hacia una **plataforma PDF reusable** con contratos públicos estabilizados y documentación modular por subsistema.

## Convenciones usadas en esta tanda

- “schema” se usa para describir la unidad de campo/elemento colocada en el canvas.
- “engine” se refiere al `DesignerEngine` y a su builder/configuración.
- “runtime” se refiere a ejecución de persistencia, API, preview y sincronización.
- “editor” se refiere al conjunto de UI: canvas, sidebars, overlays, docs rail e inspector.

## Resultado esperado de esta tanda

Después de leer estos documentos, el equipo debería poder:

1. ubicar responsabilidades por capa
2. distinguir contratos públicos de detalles internos
3. implementar nuevos widgets sin romper arquitectura
4. extender persistencia, API o colaboración con menos riesgo
5. planificar renombre futuro a una marca de plataforma más vendible
