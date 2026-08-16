# Host participant -> SISAD-PDFME User

A host may call its participant anything in its own domain.

At the public adapter boundary it projects only reusable identity/capability data:

```text
id
displayName
color
role/capabilities
hostReference (opaque)
```

Do not project business routing position, business process status, notification channels or
host lifecycle stages into the core User model.

The canonical reusable language is `User`.
