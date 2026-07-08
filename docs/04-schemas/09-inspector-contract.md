# Contrato del inspector por schema

Cada schema debe declarar qué secciones usa:

```ts
type SchemaInspectorContract = {
  sections: {
    basics?: boolean;
    content?: boolean;
    options?: boolean;
    appearance?: boolean;
    validation?: boolean;
    dataLabel?: boolean;
    help?: boolean;
    location?: boolean;
    collaboration?: boolean;
    advanced?: boolean;
  };
};
```

Esto evita que cada schema invente su propio sidebar.
