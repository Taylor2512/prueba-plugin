# External Forms

ExternalForms debe consumir `Form` y `Viewer`, no reconstruir renderers manuales.

Flujo:

```txt
snapshot -> resolve document -> resolve recipient -> Form -> values -> Viewer -> Generator
```
