# Contexto — No-overlap por owner

## Regla principal

Ningún schema del mismo owner/destinatario debe quedar superpuesto con otro schema del mismo owner en el mismo documento y página.

## Scope de comparación

```txt
mismo documentId
misma pageNumber/pageIndex
mismo ownerRecipientId/recipientId
excluir schema actual
```

## Grupos

Para `checkboxGroup` y `radioGroup`, la colisión se evalúa contra el bounding box completo del grupo, no contra una sola opción.

## Casos

- Crear dos campos en el mismo punto.
- Duplicar campo.
- Convertir checkbox a checkboxGroup.
- Agregar opción con `+`.
- Mover grupo.
- Redimensionar grupo.
- Importar snapshot con colisiones.

## Acción esperada

- Auto-placement para creación/duplicado.
- Reubicar o bloquear al mover si colisiona.
- Si no hay espacio para agregar opción, mostrar feedback no bloqueante y no romper canvas.
