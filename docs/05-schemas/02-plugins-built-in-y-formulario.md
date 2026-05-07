# Plugins built-in y formulario dinámico

> Documentación generada para consumo externo de `sisad-pdfme`.

## Plugins principales
| Plugin | Uso | Runtime esperado |
| --- | --- | --- |
| text | Texto simple o editable. | designer/form/viewer/generator |
| multiVariableText | Texto con variables. | designer/form/viewer/generator |
| signature | Firma. | designer/form/viewer/generator |
| checkbox | Booleanos. | form/viewer/generator |
| radioGroup | Selección única. | form/viewer/generator |
| select | Lista. | form/viewer/generator |
| date/dateTime/time | Fechas. | form/viewer/generator |
| barcodes | QR/códigos. | viewer/generator |
| image/svg | Medios. | designer/viewer/generator |
| line/rectangle/ellipse | Estructura. | designer/viewer/generator |
| table | Tablas dinámicas. | designer/viewer/generator |

## Formulario dinámico
```text
schema.name     → clave de input
schema.type     → componente renderizado
schema.required → validación
schema.editable → input editable
schema.hidden   → visibilidad
__designer.api  → catálogos/prefill
__designer.form → JSON final
```

## Recomendación
El formulario no debe crear campos nuevos. Solo debe completar valores de schemas existentes.
