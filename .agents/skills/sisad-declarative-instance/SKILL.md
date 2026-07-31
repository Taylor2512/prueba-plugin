# Skill — SISAD declarative instance

## Trigger

Usar cuando una integración repite estado, callbacks, configuración,
normalización o recipes alrededor de Designer/Form/Viewer.

## Resultado

Preferir:

```jsx
<SisadPdfmeInstance definition={definition} resources={resources} handlers={handlers} />
```

## Reglas

- Mantener APIs bajas.
- Definition JSON-safe.
- Resources no serializables.
- Handlers separados.
- Core TS/TSX.
- Examples JS/JSX/JSON.
- Reassign depende de recipients asignables.
- No tocar geometría para simplificar montaje.
