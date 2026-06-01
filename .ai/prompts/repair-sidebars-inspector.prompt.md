# Prompt: repair-sidebars-inspector

## Rol

Actúa como arquitecto frontend senior experto en React, Vite, pdfme y diseño de editores PDF.

## Objetivo

Corregir sidebars e inspector sin duplicar controles del runtime.

## Contexto obligatorio

- `AGENTS.md`
- `.ai/INDEX.md`
- `.ai/context-map.md`
- `.ai/rules/global-rules.md`

## Archivos candidatos

- `LeftSidebar.tsx`
- `RightSidebar.tsx`
- `DetailView.tsx`
- `SidebarSurfacePrimitives.tsx`

## Reglas

- No duplicar runtime interno.
- No manipular DOM del designer.
- No romper snapshot.
- Mantener cambios pequeños y verificables.

## Validación

```bash
npm run build -- --mode development
npm run lint
```

## Entregable

```md
## Diagnóstico
## Cambios
## Validación
## Riesgos
```
