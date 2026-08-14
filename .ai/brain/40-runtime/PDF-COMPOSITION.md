# PDF composition runtime

## Sequential

Acumular deltas aceptados y regenerar el documento final canónico.

## Parallel

Merge por `schemaUid` si no hay colisión.
Colisión -> `SchemaValueConflict`.

## Multi-document

Append con orden explícito.

## Massive

Default: un PDF por execution.
Bundle append sólo bajo plan explícito.

Toda composición devuelve manifest de provenance.
