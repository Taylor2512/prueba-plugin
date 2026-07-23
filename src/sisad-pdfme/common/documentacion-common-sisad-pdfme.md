# Índice técnico de `@sisad-pdfme/common`

Este archivo dejó de ser una copia consolidada de la documentación del código.
La información canónica vive junto a cada módulo, en su JSDoc y tipos exportados;
las reglas transversales y el inventario resumido viven en [`README.md`](README.md).

## Contratos y datos

- [`types.ts`](types.ts): tipos TypeScript públicos.
- [`schema.ts`](schema.ts): contratos Zod de runtime.
- [`constants.ts`](constants.ts): unidades, PDF base y fuentes por defecto.
- [`version.ts`](version.ts): versión pública del paquete.
- [`index.ts`](index.ts): exports públicos de `@sisad-pdfme/common`.

## Colaboración y comentarios

- [`collaboration.ts`](collaboration.ts): identidades, destinatarios, assignments y
  creación de comentarios/anclas.
- [`comments.ts`](comments.ts): operaciones de comentarios embebidos y top-level.

## Templates y expresiones

- [`dynamicTemplate.ts`](dynamicTemplate.ts): reflujo de schemas dinámicos y
  tablas multipágina.
- [`expression.ts`](expression.ts): placeholders y evaluación segura de AST.
- [`schemaPageTraversal.ts`](schemaPageTraversal.ts): recorrido canónico de schemas
  por página.

## Plugins y utilidades

- [`pluginRegistry.ts`](pluginRegistry.ts): registro y resolución de plugins.
- [`helper.ts`](helper.ts): validación, unidades, PDF base64 y fuentes.

## Regla de mantenimiento

No vuelvas a copiar aquí APIs, encabezados JSDoc, riesgos ni explicaciones completas
de cada módulo. Actualiza el módulo propietario y, si cambia una regla transversal,
[`README.md`](README.md). Este índice solo debe cambiar cuando se añade, elimina o
redistribuye una responsabilidad de `common`.
