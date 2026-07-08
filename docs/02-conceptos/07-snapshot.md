# Snapshot

El snapshot es el estado serializable del diseñador.

Debe preservar:

```txt
schemaUid
documentId
pageNumber
x/y/width/height/rotation
ownerRecipientId
ownerColor
options
selected values
__designer
```

No debe incluir referencias DOM ni funciones.
