# SOLID y POO para el diseñador PDF

## Decisión

Usar POO basada en contratos y composición, no herencia profunda.

## Aplicación SOLID

| Principio | Aplicación |
|---|---|
| SRP | schemaTypes solo tipos, fieldChrome solo visual, commandBus solo comandos |
| OCP | nuevos schemas por registry/factory/config |
| LSP | plugin reemplazable sin romper snapshot |
| ISP | interfaces por capacidad |
| DIP | Canvas/Inspector dependen de contratos |

## Composición

```ts
type TextSchema =
  BaseSchema<'text'>
  & HasAppearance
  & HasValidation
  & HasDataBinding;
```

## Evitar

```ts
class TextSchema extends BaseSchema
```

si el objeto debe serializarse al snapshot.
