# PDF composition analysis

## Principio

Componer PDFs no significa siempre concatenar bytes.

SISAD-PDFME debe distinguir:

1. canonical data merge;
2. regenerate final PDF;
3. append documents;
4. bundle independent executions;
5. conflict detection.

## Sequential

Preferir:

```text
canonical state
 + accepted delta stage A
 + accepted delta stage B
 -> generate final PDF
```

frente a concatenar una copia completa por cada stage.

## Parallel

Si dos executions cambian schemas distintos, sus deltas pueden combinarse y regenerarse.

Si cambian el mismo `schemaUid`, no existe ganador silencioso:
se produce conflicto explícito.

## Massive

El resultado canónico por defecto es un PDF por execution.
Un bundle unificado es una operación explícita posterior.
