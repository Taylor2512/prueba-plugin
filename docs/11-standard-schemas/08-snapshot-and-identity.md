# Snapshot e identidad

## Campos críticos

```txt
schemaUid
id
type
name
position
width
height
rotation
documentId
pageNumber
recipientId
recipientColor
ownerRecipientId
ownerColor
groupId
groupType
groupName
optionId
selectedOptionIds
selectedOptionId
options
required
readOnly
```

## Reglas

- `SnapshotRecipient.color` es fuente de verdad sobre color si diverge.
- `__designer` debe sobrevivir a import/export.
- Legacy debe migrar sin perder owner.
- Grupos deben roundtrip completo.
