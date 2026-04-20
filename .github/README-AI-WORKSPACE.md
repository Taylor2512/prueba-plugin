# AI Workspace del proyecto PDF Editor

Este workspace fue generado para guiar asistentes, agentes y modelos hacia una visión clara del producto.

## Visión del producto

Construir un editor PDF moderno sobre React y sisad-pdfme modificado con una experiencia tipo Wix/Figma/DocuSign:

- canvas dominante
- paneles compactos y contextuales
- sidebars colapsables
- overlays flotantes
- command bus reutilizable
- runtime desacoplado
- arquitectura escalable
- bajo acoplamiento entre UI, canvas, conversiones y datos
- diseño premium y consistente
- soporte para plantillas, campos, firmas, drag & drop, capas y propiedades avanzadas

## Principios de construcción

1. El canvas es el centro del producto.
2. Las acciones complejas deben abrirse bajo demanda, no ocupar espacio fijo.
3. Las herramientas deben ser contextuales, no invasivas.
4. La arquitectura debe separar editor, laboratorio, conversiones y shell visual.
5. Cada archivo debe tener responsabilidad clara.
6. La UI debe ser consistente, accesible y escalable.
7. El sistema debe poder evolucionar hacia multi-documento, colaboración y flujos de firma.

## Áreas críticas

- runtime del diseñador
- panel izquierdo tipo action rail
- panel derecho contextual
- overlays sobre canvas
- barra superior compacta
- resultados en bottom drawer
- comandos unificados
- persistencia de estado UI
- estilos unificados y tokens de diseño
- compatibilidad con sisad-pdfme modificado

