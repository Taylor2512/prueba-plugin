# Legacy retirement contract

Un candidato legacy/dead sólo se elimina después de:

```text
static reference search
 -> dynamic registry/reference audit
 -> public API check
 -> snapshot compatibility check
 -> test/evidence
 -> adapter/deprecation if needed
 -> removal
 -> full gates
```

Knip/JSCPD son señales, no autoridad automática de borrado.

No usar `--fix --allow-remove-files` de manera global en el runtime.
