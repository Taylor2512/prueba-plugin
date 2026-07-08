# Signature providers

Los proveedores de firma externos deben integrarse mediante adapter/registry.

El schema `signature` no debe depender directamente de un proveedor específico.

Configuración ejemplo:

```ts
signature: {
  mode: 'provider',
  providerKey: 'oneshot'
}
```
