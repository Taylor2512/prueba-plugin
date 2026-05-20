# Designer, Form, Viewer y ciclo de vida

> Documentación generada para consumo externo de `sisad-pdfme`.

## Designer
Diseño estructural de plantillas: crear schemas, mover, redimensionar, seleccionar, configurar, comentar, asignar usuarios y guardar template.

```ts
const designer = new Designer({
  domContainer,
  template,
  plugins: builtInSchemaDefinitions,
  options: { lang: 'es', designerEngine }
});
```

## Form
Completar valores sin modificar layout.

```ts
const form = new Form({ domContainer, template, inputs, plugins: builtInSchemaDefinitions });
```

## Viewer
Vista previa sin edición estructural.

```ts
const viewer = new Viewer({ domContainer, template, inputs, plugins: builtInSchemaDefinitions });
```

## Cleanup en React
```tsx
useEffect(() => {
  const instance = new Designer({ domContainer: ref.current, template, plugins, options });
  return () => queueMicrotask(() => instance.destroy());
}, [templateVersion]);
```

Usar cleanup diferido evita el warning de React sobre desmontaje síncrono mientras React renderiza.
