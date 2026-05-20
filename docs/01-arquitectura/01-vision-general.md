# Visión general de la plataforma

> Documentación generada para consumo externo de `sisad-pdfme`.

## Qué es `sisad-pdfme`
Es una plataforma de edición documental basada en PDF con runtime de diseñador, formulario, visor, generación, conversión, schemas extensibles, colaboración, comentarios y ruteo multidocumento.

## Capas
```text
common       → contratos, helpers, validaciones, comments, collaboration, assignments
schemas      → plugins renderizables y catálogo de campos
ui           → Designer, Form, Viewer, canvas, sidebars, overlays, runtime API
generator    → PDF final desde template + inputs
converter    → pdf2img, pdf2size, img2pdf
lab/features → ejemplos vivos sin backend
```

## Principio de consumo
Los proyectos externos deben importar desde entrypoints públicos y no desde componentes internos. Los componentes internos se documentan para mantener el plugin, no para acoplar consumidores.

## Casos de uso cubiertos
- Diseñar una plantilla nueva sobre PDF real.
- Editar una plantilla ya diseñada.
- Completar una plantilla como formulario dinámico.
- Ver una plantilla con datos sin edición estructural.
- Generar PDF final.
- Manejar varios documentos y páginas.
- Manejar varios usuarios/destinatarios con ownership, vista global/usuario y locks.
- Configurar datos conectados, prefill, API y JSON de salida.
- Manejar firmas por dibujo/imagen/P12/proveedor.
