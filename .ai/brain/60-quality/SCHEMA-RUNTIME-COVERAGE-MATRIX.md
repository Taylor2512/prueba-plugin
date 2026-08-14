# Schema runtime coverage matrix

La matriz machine-readable vive en `unificados/SISAD-PDFME-SCHEMA-RUNTIME-MATRIX.json`.
No es una lista hardcodeada para runtime: es una checklist de QA derivada del catálogo
observado. El test harness debe derivar tipos/capabilities del registry vivo y reportar drift
contra esta referencia, no usarla como runtime source-of-truth.
