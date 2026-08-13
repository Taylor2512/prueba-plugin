# Sanitización Markdown

## Regla principal

La historia vive en Git, evidence y frontmatter; **no en el nombre físico del archivo**.

Correcto:

```text
.ai/brain/20-contracts/RUNTIME-STATE.md
.ai/brain/30-decisions/ADR-RUNTIME-OWNERSHIP.md
.ai/plans/FORM-RUNTIME.md
```

Incorrecto:

```text
.ai/brain-v10/
RUNTIME-STATE-V4.md
FORM-RUNTIME-V2-FINAL.md
FORM-RUNTIME-copy-3.md
```

## Colisiones

La sanitización solo aplica automáticamente:

1. rename sin target;
2. eliminación de duplicado idéntico con backup.

Si dos revisiones diferentes quieren ocupar la misma ruta, el comando se bloquea.
La reconciliación debe elegir/combinar el contenido deliberadamente; después se ejecuta
de nuevo la sanitización.

No se hace un merge automático de prosa divergente porque eso puede cambiar contratos
o decisiones.
