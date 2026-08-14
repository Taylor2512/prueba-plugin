# Snapshot/versioning

Snapshot portable, serializable y versionado. Toda migration es explícita y testeada.
Artifact binario no se serializa; se serializa referencia estable.

La migración Recipient→User y la migración de assignment dimensions deben reconocer
formatos antiguos por version/shape, producir el formato nuevo y conservar roundtrip
semántico. Nunca reinterpretar silenciosamente un objeto ambiguo.
