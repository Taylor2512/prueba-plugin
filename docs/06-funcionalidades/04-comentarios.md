# Comentarios, anclajes y replies

> Documentación generada para consumo externo de `sisad-pdfme`.

## APIs
| Export |
| --- |
| addAnchorToSchema |
| addCommentToSchema |
| addCommentWithAnchorToTemplate |
| attachCommentToField |
| createSchemaComment |
| createSchemaCommentAnchor |
| deleteCommentFromSchema |
| detachCommentFromField |
| filterCommentsByFileAndPage |
| findSchemaByUid |
| getCommentsForDocument |
| getCommentsForPage |
| getCommentsForSchema |
| moveCommentAnchor |
| reopenComment |
| resolveCommentInSchema |
| resolveTopLevelComment |
| updateCommentInSchema |

## Tipos
- Comentario de documento.
- Comentario de página.
- Comentario anclado a schema.
- Reply.
- Resolved/reopen.

## Modelo
```ts
comment: {
  id: 'comment-1',
  text: 'Revisar campo',
  schemaUid: 'client_name',
  fileId: 'doc-1',
  pageNumber: 1,
  authorId: 'legal-user-1',
  authorColor: '#D946EF',
  anchor: { x: 40, y: 80 }
}
```

## UI
Los pins deben ser clicables, pero el overlay completo no debe bloquear selección.
