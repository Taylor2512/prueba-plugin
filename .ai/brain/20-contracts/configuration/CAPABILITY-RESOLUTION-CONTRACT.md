# Capability resolution contract

Una capability es la unidad canónica de comportamiento configurable.

```ts
type CapabilityState = {
  id: string;
  registered: boolean;
  supported: boolean;
  enabled: boolean;
  visible: boolean;
  permitted: boolean;
  available: boolean;
  active: boolean;
  executable: boolean;
  reason?: string;
};
```

## Fail closed

Un ID desconocido o una definición incompleta nunca se vuelve ejecutable por default.

```text
not registered -> supported=false -> enabled=false -> executable=false
```

`defaultEnabled=true` sólo existe dentro de una definición registrada y validada.

## Resolution

```text
registered
∧ supported
∧ enabled by resolved profile/config
∧ dependencies satisfied
∧ permission
∧ availability
= executable
```

`visible` es presentación; `executable` es comportamiento. Ocultar no sustituye autorización.
