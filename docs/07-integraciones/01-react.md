# Integración React

Ejemplo conceptual:

```tsx
function Editor() {
  const [template, setTemplate] = useState(initialTemplate);
  return <Designer template={template} onChangeTemplate={setTemplate} />;
}
```

El host debe controlar negocio, no duplicar UI interna del diseñador.
