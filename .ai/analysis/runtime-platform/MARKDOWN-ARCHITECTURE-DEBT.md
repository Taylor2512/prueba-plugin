# Markdown architecture debt

El snapshot documental suministrado demuestra tres fuentes de drift:

1. existe una campaña paralela de runtime además de `runtime-platform`;
2. existen paths persistentes con sufijos de revisión o fecha;
3. existen documentos de integración que contienen conocimiento de productos host concretos.

## Target

Consolidar todo el trabajo reusable bajo:

```text
.ai/brain/
.ai/knowledge/
.ai/plans/
.ai/prompts/
.ai/scrum/task-cards/runtime-platform/
reports/runtime-platform/evidence/
```

Reglas:

- Git conserva historia;
- un concepto tiene un path canónico;
- no crear copias por revisión;
- evidence usa nombre semántico o task ID estable;
- conocimiento de consumidores concretos no vive en el Brain canónico;
- generated packs se regeneran, no se editan manualmente.
