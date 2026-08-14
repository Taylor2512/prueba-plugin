# FORM-RUNTIME

```text
user input → schema interaction → codec → local transaction → runtime state → canonical event → host adapter → optional persistence
```

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/40-runtime/FORM-RUNTIME.md:START -->
## Remote data transaction semantics

Una carga remota es `origin=prefill/system` y no marca `touched` por sí sola.

Una selección/edición humana sí actualiza interaction state.

Background refresh no sobrescribe user-dirty sin policy explícita.

Requests/cache deben respetar User × document × runtime session cuando el dato sea sensible.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/40-runtime/FORM-RUNTIME.md:END -->
