# Toolbar y CommandBus

El CommandBus centraliza acciones:

- undo/redo;
- duplicate;
- delete;
- align;
- distribute;
- lock/unlock;
- assign recipient;
- update schema.

Las toolbars deben disparar comandos, no mutar estado de forma paralela.
