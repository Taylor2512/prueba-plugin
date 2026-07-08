# Recipients

Los recipients representan usuarios, firmantes o actores del documento.

```ts
type Recipient = {
  id: string;
  name: string;
  role?: 'signer' | 'viewer' | 'coordinator' | string;
  color?: string;
};
```

## Regla de color

El color activo se usa para nuevos schemas. Los schemas existentes conservan su `ownerColor` original.
