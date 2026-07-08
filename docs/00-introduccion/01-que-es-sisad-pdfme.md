# Qué es `sisad-pdfme`

`sisad-pdfme` es un componente reutilizable para diseñar, llenar, visualizar y generar documentos PDF con campos posicionados sobre páginas.

Permite crear experiencias tipo diseñador PDF empresarial:

- cargar uno o varios documentos PDF;
- arrastrar campos sobre páginas;
- asignar campos a recipients/destinatarios;
- configurar propiedades del campo en un inspector;
- guardar snapshots versionados;
- renderizar formularios interactivos;
- visualizar documentos en modo readonly;
- generar PDF final con valores.

## Piezas principales

```txt
Designer  -> diseña campos sobre PDF
Form      -> captura valores interactivos
Viewer    -> muestra valores en solo lectura
Generator -> produce PDF final
```

## Enfoque

El componente debe ser genérico. No debe contener reglas específicas de SISAD Web, Uanataca, flujos externos o negocio de formularios.
