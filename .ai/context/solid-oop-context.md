# SOLID / OOP Context

## Enfoque

POO basada en contratos y composición.

Preferir:

```txt
interfaces
type aliases
discriminated unions
factories
strategy objects
adapters
commands
state unions
type guards
composition over inheritance
```

Evitar:

```txt
class BaseSchema extendida por todo
herencia profunda
Record<string, any>
as any nuevo
mega switch por schema.type
objetos no serializables
```

## SOLID

- SRP: un módulo, una responsabilidad.
- OCP: extender por registry/factory/config.
- LSP: todo plugin cumple contrato base.
- ISP: interfaces pequeñas por capacidad.
- DIP: UI depende de contratos.
