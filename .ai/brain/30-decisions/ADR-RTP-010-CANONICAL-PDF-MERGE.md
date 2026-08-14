# ADR RTP-010 — Canonical PDF merge

Cuando varias executions contribuyen al mismo documento lógico, preferir:

```text
merge canonical deltas -> generator -> final PDF
```

a combinar visualmente PDFs divergentes.

Append queda para documentos/resultados que deben conservar páginas independientes.
