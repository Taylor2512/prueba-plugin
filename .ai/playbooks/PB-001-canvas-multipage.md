# PB-001 — Canvas multipágina

## Objetivo

Eliminar dependencias implícitas de página 1.

## Pasos

1. Buscar `pageNumber/pageIndex/documentId/querySelector/getBoundingClientRect`.
2. Identificar dónde se resuelve página.
3. Asegurar DOM de página con metadata.
4. Asegurar root schema con metadata.
5. Corregir drop para usar página bajo puntero.
6. Corregir render por document/page.
7. Corregir overlays contra rect real.
8. Corregir no-overlap por owner/document/page.

## Parar si

Requiere más de 5 archivos modificados.
