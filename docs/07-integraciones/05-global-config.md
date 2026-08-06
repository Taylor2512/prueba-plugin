# Configuración global

```ts
const config = createSisadPdfmeConfig({
  configVersion: 2,
  runtime: { mode: 'designer' },
  documents: { mode: 'multi' },
  persistence: {
    mode: 'host',
    autosave: false,
  },
});
```

## Defaults importantes

```text
canvas.enabled = true
sidebars.left.enabled = true
sidebars.right.enabled = true
collaboration.enabled = true
assignment.enabled = true
signatures.enabled = true
documents.mode = single
persistence.mode = local
persistence.autosave = false
debug.enabled = false
```

## Semántica

```text
enabled
visible
allowed
available
```

No trate estos conceptos como equivalentes.
