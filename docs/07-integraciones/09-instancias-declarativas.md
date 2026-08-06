# Instancias declarativas

```ts
type SisadPdfmeRegisteredInstance = {
  id: string;
  revision?: string | number;
  definition: SisadPdfmeInstanceDefinition;
  resources?: SisadPdfmeInstanceResources;
  handlers?: SisadPdfmeInstanceHandlers;
  className?: string;
  style?: React.CSSProperties;
};
```

## Identidad

- `id`: identidad estable;
- `revision`: nueva revisión deliberada;
- `instanceKey`: firma directa sin objeto registrado.

## Precedencia de estado

```text
definition.state
→ resources.state
→ runtime
→ definition.defaultState
→ resources.defaultState
→ definition legacy
→ resources
→ fallback
```

## Recomendado

```tsx
<SisadPdfmeInstance instance={registeredInstance} />
```
