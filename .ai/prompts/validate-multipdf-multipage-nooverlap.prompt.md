# Prompt — Validar multi-PDF, multi-página y no-overlap

Objetivo: garantizar que los schemas se distribuyen en páginas/PDFs disponibles y no se superponen por owner.

## Revisar

```bash
rg "schemaAutoPlace|schemaCollision|resolveSmartDropPosition|hasOverlap|documentId|pageNumber|pageIndex|pageStack|multi-document-routing|labExamples|template" src tests
```

## Casos

- 2 PDFs mínimo.
- 2 páginas mínimo por PDF.
- Insertar todos los schemas disponibles.
- No overlap por owner/doc/page.
- Grupos usan bounding box total.
- Si no hay espacio, buscar otra página/PDF.
- No huecos fantasma entre páginas.

## Tests

- `schema-visual-audit.spec.ts`
- `schema-no-overlap.spec.ts`
- `multi-document-routing-design.spec.ts`
- `page-stack-layout.spec.ts`
