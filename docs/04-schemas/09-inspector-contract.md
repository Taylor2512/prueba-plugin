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

## Reglas de configuración

- `signatureMode`, `signatureProviderKey`, `signatureProviderStatus` y `signatureProviderDisplay` son secciones propias de schemas de firma.
- Un schema no debe leer `options.visibility` o `options.assignment` directamente para decidir secciones visibles.
- La visibilidad del inspector debe salir del contrato canónico y de los selectores del wrapper.
