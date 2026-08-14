# Multi-user Form

Con múltiples Users:

- `activeUserId` es explícito;
- assignments deciden acceso;
- value scope puede ser shared o per-user;
- signature/artifact/table transient state no cruza scopes;
- cambio de User no destruye el state del User anterior;
- dos Forms en el mismo JS realm no comparten singletons mutables.
