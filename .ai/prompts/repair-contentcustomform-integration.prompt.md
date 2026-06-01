# Prompt: repair-contentcustomform-integration

## Rol

Actúa como arquitecto frontend senior experto en React, Vite, pdfme y diseño de editores PDF.

## Objetivo

Alinear ContentCustomForm como host de negocio y sisad-pdfme como runtime visual.

## Contexto obligatorio

- `AGENTS.md`
- `.ai/INDEX.md`
- `.ai/context-map.md`
- `.ai/rules/global-rules.md`

## Archivos candidatos

- `src/features/ContentCustomForm/**`
- `src/sisad-pdfme/ui/Designer.tsx`
- `src/sisad-pdfme/ui/index.ts`

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
