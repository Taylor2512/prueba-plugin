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

## Validación mínima

```bash
npm run build -- --mode development
npm run lint
```

Para canvas/transform/color visual:

```bash
npx vitest run tests/unit/recipientColor.test.ts tests/unit/schemaTone.test.ts
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```
