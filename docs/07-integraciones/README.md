# Integración y portabilidad

## Orden de lectura

1. [React](./01-react.md)
2. [Frontera host/core](./02-host-app.md)
3. [Configuración global](./05-global-config.md)
4. [Adapters del host](./06-host-adapters.md)
5. [Instancias declarativas](./09-instancias-declarativas.md)
6. [Manual maestro](./08-manual-portabilidad-sisad-pdfme.md)
7. [Implementación por fases](./10-implementacion-por-fases.md)
8. [Checklist de consumer project](./11-checklist-consumer-project.md)

## Especializadas

- `03-signature-providers.md`
- `04-external-forms.md`
- `07-pdfcomponent-lab-as-host-reference.md`

## Regla

El host entrega datos, configuración, adapters y handlers. SISAD PDFME conserva
la propiedad del canvas, schemas, selección, sidebars, inspector y runtime.
