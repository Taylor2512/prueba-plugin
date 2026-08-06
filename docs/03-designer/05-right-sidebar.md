# RightSidebar

El RightSidebar agrupa:

- DetailView / inspector;
- ListView;
- Documents rail;
- Comments rail.

## Reglas

- No duplicar paneles desde el host.
- La selección actual debe sincronizarse con DetailView.
- ListView debe usar `schemaUid` como identidad.

## Sincronización del inspector

El vínculo inspector ↔ canvas es bidireccional y debe seguir estas reglas:

- El formulario se rehidrata cuando cambian los **valores** del schema activo, no
  solo al cambiar de selección: arrastre, resize, rotación, alineación y undo
  deben reflejarse en los campos.
- La rehidratación se aplaza mientras el foco está en un campo de texto de la
  sección, nunca por un botón con foco (la alineación vive dentro de `box`).
- Un commit escribe **solo** las claves que el usuario tocó en esa interacción.
  Si escribe todo el formulario, una edición de `width` reescribe la `position`
  cargada y revierte lo que se hizo en el canvas.
- La firma de rehidratación excluye `content`: en imágenes y firmas es un data
  URI grande y el inspector nunca lo edita.
- Los campos cuyo nombre es una ruta (`validation.type`) se persisten anidados
  pero el formulario los identifica por el nombre literal: la sección expone
  ambos al hidratar, o el valor se guarda y nunca vuelve.

## Permisos y solo lectura

- `schema.readOnly` describe si el **destinatario** puede rellenar el campo, no
  si el **diseñador** puede configurarlo. Los comandos de estructura
  (`changeSchemas`, update, group, order, style) se rigen por `canEditStructure`.
- Usar `isEditable` ahí congela el inspector de cualquier campo en solo lectura
  —incluido el switch que activa esa bandera— y bloquea los tipos que nacen con
  `readOnly: true`, como `note`.
- El guard del CommandBus descarta en silencio (solo `console.warn`): un cambio
  que no se aplica no muestra nada al usuario.
