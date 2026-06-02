# SKILL — Placement multi-PDF/multi-página

## Cuándo usar

Cuando muchos schemas se apilan o no hay espacio en la página.

## Pasos

1. Medir page bounds.
2. Evaluar no-overlap por owner.
3. Buscar slot en página actual.
4. Buscar siguiente página/PDF.
5. Validar page stack.

## No hacer

No resolver con márgenes negativos o CSS.

## Validación

schema-no-overlap + page-stack-layout + multi-document tests.
