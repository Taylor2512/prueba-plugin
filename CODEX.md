# CODEX.md — Adaptador Codex

Codex se usa para cambios atómicos, verificables y con bajo riesgo.

## Método

```txt
leer contexto mínimo -> localizar con rg -> modificar poco -> validar -> reportar rollback
```

## Tareas ideales

- Ajustar una función de color, owner o snapshot.
- Corregir guard de Moveable/Selecto.
- Crear test unitario cercano.
- Eliminar wrapper o alias sin valor.
- Ajustar prompt/doc puntual.
- Endurecer `checkboxGroup` o `radioGroup` sin tocar runtime global.

## Validación mínima

```bash
npm run build -- --mode development
npm run lint
```

Para schemas estándar y grupos:

```bash
npx vitest run tests/unit/checkboxGroup.schema.test.ts tests/unit/schemaStandardSupport.test.ts tests/unit/schemaAutoPlace.test.ts tests/unit/schemaCollision.test.ts tests/unit/snapshotAdapter.test.ts
npx playwright test tests/playwright/checkbox-group-docusign-behavior.spec.ts tests/playwright/schema-no-overlap.spec.ts --project=chromium
```
