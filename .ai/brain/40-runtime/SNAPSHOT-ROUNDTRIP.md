# SNAPSHOT-ROUNDTRIP

```text
runtime state → canonical snapshot → serialize/version → validate/deserialize → same semantic state

Sólo se acepta la representación actual. Un snapshot inválido se rechaza de
forma explícita y nunca se convierte silenciosamente a un documento default.
```
