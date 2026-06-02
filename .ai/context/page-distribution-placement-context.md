# Contexto — Distribución multi-documento y multi-página

## Regla

No insertar todos los schemas en la misma zona. Usar todas las páginas y PDFs disponibles.

## Política de placement

1. Intentar zona preferida en página actual.
2. Buscar slots libres en la misma página.
3. Buscar página siguiente del mismo PDF.
4. Buscar otro PDF disponible si el escenario lo permite.
5. Si no hay espacio, mostrar feedback claro.

## No-overlap

No se solapan schemas si comparten:

- `documentId`
- `pageNumber`
- `ownerRecipientId`/ownerId

Para grupos se usa bounding box total.

## Validaciones

- No crear huecos fantasma entre páginas.
- No cambiar page gap por insertar schemas.
- No usar CSS para corregir placement.
- No mezclar DOM px con coordenadas de schema.
