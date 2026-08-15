# Runtime session identity

Dentro de SISAD-PDFME el aislamiento mutable se define por:

```text
userId × documentId × sessionScopeKey
```

`sessionScopeKey` es opaco para el reusable. El host puede derivarlo de request/recipient,
pero el core no interpreta Request/routing. Cambiar cualquiera de esas dimensiones puede
recrear el runtime; una actualización de input normal no debe remount.
