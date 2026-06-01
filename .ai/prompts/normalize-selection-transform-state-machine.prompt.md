# Prompt: normalize-selection-transform-state-machine

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Normalizar state machine.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `interactionState.ts`
- `interactionGuards.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```
