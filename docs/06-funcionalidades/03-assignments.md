# Assignments recipient/file/page

> Documentación generada para consumo externo de `sisad-pdfme`.

## Estructura
```ts
assignments[recipientId][fileId][pageNumber] = [schemaUid];
```

## APIs
| Export |
| --- |
| buildFileAssignments |
| buildPageAssignments |
| buildRecipientAssignments |
| buildSchemaAssignments |
| buildUserSchemaAssignments |
| getAssignmentsForFile |
| getAssignmentsForPage |
| getAssignmentsForRecipient |
| moveSchemaAssignment |
| reconcileAssignments |
| removeSchemaFromAssignments |
| validateAssignmentsConsistency |

## Reglas
- Usar `schemaUid`, no `id` temporal.
- Mover entre página/documento actualiza bucket.
- Eliminar schema lo remueve de todos los buckets.
- Duplicar schema crea nuevo uid y nueva asignación.
- Validar consistencia al cargar plantilla externa.
