# Alcance

## Producto

`src/sisad-pdfme` es una librería/componente frontend reutilizable para diseñar, completar, visualizar y generar documentos PDF.

## Dominios internos

- configuración y API pública;
- Designer, Form y Viewer;
- Canvas e interacciones;
- schemas y plugins;
- recipients, asignación y colaboración;
- documentos y routing;
- inspector y sidebars;
- snapshot y persistencia;
- generator y converter;
- diseño visual, Tailwind y tokens;
- pruebas, accesibilidad, rendimiento y distribución.

## Fuera del core

- reglas de negocio del host;
- endpoints específicos de SISAD-WEB;
- credenciales;
- flujos particulares de una empresa;
- lógica de formularios externos no generalizable.

El host se integra mediante configuración, adapters, callbacks, eventos y contratos públicos.
