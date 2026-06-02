# Prompt — Mejorar diseño de schemas inspirado en DocuSign/Wix

Objetivo: refinar diseño visual de schemas dentro del canvas sin tocar geometría funcional salvo evidencia.

## Revisar

```bash
rg "checkboxGroup|radioGroup|checkbox|select|text|number|signature|date|Renderer|SelectionContextToolbar|canvas-interactions|tokens|ownerColor|selected|hover" src/sisad-pdfme
```

## Diseño esperado

- PDF protagonista.
- Schemas ligeros.
- Color owner sutil.
- Idle/hover/selected/group-selected diferenciados.
- Group dash suave.
- Botón `+` integrado.
- Toolbar compacta.

## No hacer

- No copiar CSS/branding de DocuSign.
- No arreglar coordenadas con CSS.
- No tocar `.moveable-*` ni `.selecto-*` globalmente.

## Validación

- `npm run build -- --mode development`
- `npm run lint`
- Playwright visual focalizado si existen snapshots.
