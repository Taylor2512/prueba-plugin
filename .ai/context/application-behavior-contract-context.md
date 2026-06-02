# Contexto — Contrato maestro de comportamiento SISAD PDFME

## Problema que resuelve

El proyecto sufre regresiones porque se corrigen síntomas locales. Cada fix debe validarse contra procesos transversales.

## Procesos maestros

1. Inicializar designer.
2. Cargar documentos/PDFs y page stack.
3. Cambiar destinatario activo.
4. Crear schema desde catálogo.
5. Seleccionar schema simple.
6. Seleccionar múltiples schemas.
7. Mover/redimensionar/rotar.
8. Usar shortcuts y command bus.
9. Convertir checkbox a checkboxGroup.
10. Agregar opción/casilla a grupo.
11. Duplicar/copiar/pegar/cortar/eliminar.
12. Agrupar/desagrupar selección temporal.
13. Alinear/distribuir.
14. Editar DetailView.
15. Sincronizar ListView.
16. Guardar/restaurar snapshot.
17. Renderizar Form.
18. Renderizar Viewer.
19. Generar PDF.
20. Ejecutar externalForms como host, no como renderer paralelo.

## Fuente de verdad

| Dominio | Fuente de verdad |
|---|---|
| Identidad | `schemaUid`, `id`, `__designer` |
| Documento/página | `documentId`, `pageNumber`, page stack |
| Owner/color | `ownerRecipientId`, `recipientId`, `ownerColor`, `recipientColor` |
| Geometría | schema rect en coordenadas de página |
| Selección temporal | `activeSchemas` / selection state |
| Grupo lógico | `__designer.group`, `groupId`, `groupType`, `optionId` |
| Comandos | `selectionCommands` + `commandBus` |
| Persistencia | `snapshotAdapter` |
| Ejecución | `Form`, `Viewer`, `Generator/PDF` |

## Separación conceptual

- `selectionGroup`: selección temporal de varios schemas en canvas.
- `schemaGroup`: grupo lógico persistente como `checkboxGroup` o `radioGroup`.

Nunca mezclar ambos conceptos.

## Regla de cambio

Antes de modificar un componente, declarar:

```md
Proceso afectado:
Componentes involucrados:
Estado antes/después:
Datos que se deben preservar:
Tests afectados:
```
