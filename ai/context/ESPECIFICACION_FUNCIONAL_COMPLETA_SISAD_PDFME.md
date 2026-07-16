# Especificación funcional consolidada — SISAD PDFME

## 1. Alcance

Este documento consolida los requisitos discutidos para schemas, Canvas, LeftSidebar, RightSidebar, ListView, DetailView, DocumentsRail, CommentsRail, colaboración, runtime, snapshot y migración Tailwind.

El contrato objetivo es una librería portable:

```txt
Designer  -> diseña campos sobre PDF
Form      -> captura valores
Viewer    -> muestra valores readonly
Generator -> produce el PDF final
```

`src/sisad-pdfme` no debe contener reglas de negocio específicas de SISAD Web, DigitalAgreements, Uanataca o un backend concreto. Los hosts integran mediante configuración, adapters, events, recipients, documents, persistence y signature providers.

---

# 2. Principios estructurales

## 2.1. Una fuente de verdad por concepto

| Concepto | Fuente de verdad |
|---|---|
| selección | `activeSchemaIds` del Designer |
| usuario/recipient activo | `RecipientRegistry` |
| ownership/color | resolver central de owner |
| acceso/lock | resolver central de interacción |
| acciones | ActionRegistry/CommandBus |
| inspector | contrato declarativo por schema |
| valores runtime | `schemaUid` + inputs |
| documento/página | routing documental |
| persistencia | snapshot versionado |

No duplicar selección, ownership, permisos o estado de panel en varios componentes.

## 2.2. Canvas como protagonista

- Sidebars compactos.
- Sin exceso de cards anidadas.
- Sin sombras permanentes innecesarias.
- Sin bordes negros inesperados.
- PDF claramente separado del fondo.
- Scroll independiente.
- Toolbars que no tapen el documento.

## 2.3. Tailwind-first

Tailwind en JSX/TSX para layout, skin, estados, densidad, inputs, tabs, filas, badges y modales.

CSS puro solo para contratos técnicos imposibles de expresar localmente:

- Moveable;
- Selecto;
- Scena Guides;
- geometría paper/canvas;
- coordinación stage → sidebar → canvas;
- zoom/transform;
- print;
- portals y nodos de terceros;
- variables runtime.

Meta correcta:

```txt
0 @apply
```

No es obligatorio:

```txt
0 líneas CSS
```

---

# 3. Contrato universal de schema

Todo schema debe conservar:

```txt
schemaUid
type
name
label
documentId
fileId
fileTemplateId
pageNumber
pageIndex
x
y
width
height
rotation
ownerRecipientId
ownerRecipientIds
ownerColor
recipientId
required
readOnly / readonly
locked
objectLocked
collaborationLock
hidden
defaultValue
content
validation
__designer
```

## 3.1. Identidad

- `schemaUid`: identidad técnica estable.
- `name`: clave/variable persistente y única cuando se exige.
- `label`: nombre visible.
- `type`: solo lectura en el inspector.
- Renombrar no cambia `schemaUid`.
- Duplicados muestran advertencia.
- Copiar/pegar genera nueva identidad técnica.

## 3.2. Routing

Mover, duplicar, restaurar o reasignar no debe perder:

- documento;
- archivo;
- página;
- índice;
- asignaciones;
- owner.

## 3.3. Geometría

Debe soportar posición, tamaño, rotación, alineación, límites de página, movimiento con teclado, resize, snap y validación fuera de límites.

---

# 4. Estados visuales de schema

Estados mínimos:

```txt
idle
hovered
selected
multi-selected
dragging
resizing
rotating
invalid
readonly
locked
hidden
blocked-by-recipient
editing-by-me
editing-by-other
```

Reglas:

- Ownership no equivale a selección.
- Owner color se usa como acento, icon tint o badge.
- Invalid usa semántica de error.
- Readonly y locked deben diferenciarse.
- Designer muestra chrome; Form muestra control limpio; Viewer/PDF no muestran chrome de edición.

---

# 5. Selección

## 5.1. Sincronización

- Click en Canvas selecciona la fila del ListView.
- Click en ListView selecciona el schema del Canvas.
- Click vacío limpia selección cuando no hay modal.
- `activeSchemaIds` es la única selección persistente.

## 5.2. Selección múltiple

```txt
Mac:
- Command + click: toggle
- Shift: rango

Windows/Linux:
- Ctrl + click: toggle
- Shift: rango
- Ctrl + Shift: rango aditivo cuando la policy lo permita
```

Selecto permite selección por región.

## 5.3. ListView

El ListView solo puede guardar estado local para:

- anchor;
- active drag id;
- hover;
- foco.

No mantiene otra colección de seleccionados.

## 5.4. Grupos

Para `radioGroup` y `checkboxGroup`:

- root seleccionable;
- opciones internas fuera de Selecto/Moveable;
- grupo se mueve como unidad;
- edición interna mediante doble click o acción explícita;
- borde de grupo;
- botón `+` fuera del área Moveable;
- copiar/pegar preserva offsets, dirección y orden.

---

# 6. Drag, reorder, clipboard y shortcuts

## 6.1. LeftSidebar → Canvas

Debe existir:

- preview;
- animación;
- drop válido/inválido;
- owner correcto;
- coordenadas normalizadas;
- soporte multipágina/multidocumento;
- prevención de solapamiento según policy;
- no scroll accidental del catálogo.

## 6.2. Reorder ListView

- DnD solo desde grip.
- El cuerpo selecciona.
- Acciones no inician drag.
- Movimiento pequeño no se convierte en drag.
- Reordenar visibles se fusiona con `allSchemas`.
- Ocultos/filtrados conservan orden relativo.

## 6.3. Clipboard

Debe soportar:

```txt
copy
cut
paste
duplicate
delete
undo
redo
```

Al copiar múltiples schemas o grupos:

- conservar orden;
- conservar distancias;
- aplicar offset común;
- mantenerse dentro de página;
- preservar configuración;
- generar IDs nuevos;
- respetar policy de owner.

## 6.4. Atajos

```txt
Ctrl/Cmd+C -> copiar
Ctrl/Cmd+X -> cortar
Ctrl/Cmd+V -> pegar
Ctrl/Cmd+D -> duplicar
Delete/Backspace -> eliminar
Ctrl/Cmd+Z -> undo
Ctrl/Cmd+Shift+Z -> redo
Flechas -> mover
Escape -> cancelar/cerrar
+/- -> zoom
? -> ayuda
```

Se suspenden en inputs, textarea, contenteditable, modales y popups visibles.

---

# 7. Familias de schemas

## 7.1. Text-like

Incluye:

```txt
text
number
date
dateTime
time
fullName
emailAddress
company
title
multiVariableText
```

Comparten placeholder, defaultValue, required, readonly, validation, appearance, dataLabel y tooltip.

### Text

- multiline opcional;
- fuente;
- tamaño;
- tamaño dinámico;
- color/fondo;
- opacidad;
- align horizontal/vertical;
- line height;
- spacing;
- padding;
- límites y patrón.

### Number

- min/max;
- enteros/decimales;
- precisión;
- formato;
- separadores;
- validación numérica.

### Date/DateTime/Time

- formato;
- locale;
- restricciones;
- default;
- representación coherente en Form/Viewer/PDF.

### MultiVariableText

- plantilla;
- variables `{variable}`;
- datos de muestra;
- preview;
- validación;
- fallback.

## 7.2. Checkbox

- checked/unchecked;
- default;
- required;
- readonly;
- value adapter estable;
- indicador visual único y claro.

## 7.3. RadioGroup y CheckboxGroup

- opciones apiladas;
- orientación configurable;
- diseño boxed;
- borde de grupo;
- botón `+`;
- agregar/eliminar/reordenar;
- label/value por opción;
- default;
- IDs de opción estables;
- radio circular;
- checkbox cuadrado;
- edición desde DetailView.

RadioGroup permite una opción. CheckboxGroup permite varias y puede exigir al menos una.

## 7.4. Select/Dropdown

- opciones label/value;
- placeholder;
- default;
- required;
- readonly;
- agregar/eliminar/reordenar;
- validación de duplicados.

El editor de opciones debe ser compartido con grupos y aislar eventos del Canvas.

## 7.5. Firma

Incluye:

```txt
signature
initials
dateSigned
```

Modos técnicos:

```txt
draw
image
p12
provider
```

Mapeo del host:

```txt
Firma SISAD -> draw
Electrónica -> p12
OneShot -> provider + providerKey=oneshot
```

Debe conservar recipient, required, provider capabilities, estado y renderers Designer/Form/Viewer/PDF.

## 7.6. Action-based

### Attachment

- tipos permitidos;
- máximo de archivos;
- máximo tamaño;
- reemplazo;
- mostrar nombre/estado;
- readonly;
- required;
- recipient;
- adapter de storage.

### Note

- contenido informativo;
- readonly por defecto;
- estilo y visibilidad;
- no parecer input si es informativa.

### Approve/Decline

- acciones semánticas;
- label/icon/tono;
- callback/command;
- recipient;
- disabled reason;
- no doble ejecución.

## 7.7. Media

Image/SVG/Stamp:

- source;
- fit;
- aspect ratio;
- opacidad;
- borde;
- fallback;
- PDF render.

## 7.8. Barcode

QR, Code128, EAN, PDF417 y otros:

- valor;
- validación por estándar;
- color;
- incluir texto;
- tamaño;
- quiet zone.

## 7.9. Table

- columnas/filas;
- header;
- repetir header;
- estilos;
- fondo alternado;
- contenido dinámico;
- crecimiento y división de página en generación.

## 7.10. Shapes

Line/Rectangle/Ellipse:

- color;
- borde;
- fondo;
- opacidad;
- radio;
- rotación;
- resize.

## 7.11. Custom

Debe declarar key, defaults, categoría, icono, factory, renderer Designer/Form/Viewer/PDF, inspector contract, value adapter, validation y snapshot compatibility.

---

# 8. LeftSidebar

## 8.1. Función

Catálogo para buscar, filtrar, marcar favoritos y arrastrar campos.

## 8.2. Fuentes

```txt
Base
Custom
Auto
```

Categorías:

```txt
Recientes
Firmas
Texto
Fecha y hora
Selecciones
Imagen y medios
QR y códigos
Estructura
Acciones
General
```

## 8.3. Búsqueda y filtros

Buscar por label, type, tags, descripción, categoría y custom name.

Filtros:

```txt
Todos
Favoritos
Recientes
Recipient activo
```

## 8.4. Favoritos y recientes

- Toggle sin iniciar drag.
- Persistencia según host.
- Recientes al usar/insertar.
- Contadores reales.

## 8.5. Layouts

```txt
list
tiles
icons
```

Todos comparten drag, click, favorite, recent, tooltip, keyboard, owner, disabled y test IDs. Solo cambia presentación.

La densidad no cambia el layout elegido.

## 8.6. Custom fields

Modal para crear/editar definición con nombre, label, base type, categoría, defaults y validación de duplicados.

## 8.7. Auto-place

Soporta campos prefill/auto con descriptor de owner, documento, página y posición sugerida.

## 8.8. Collapse y scroll

- Un scroll owner.
- No scroll accidental durante drag.
- Rail compacto configurable.
- Sin botones anchos huérfanos al colapsar.
- Restaura estado al expandir.

---

# 9. RightSidebar general

## 9.1. Paneles

```txt
fields
detail
docs
comments
```

Soporta modo controlado, interno y `auto`.

- Un schema seleccionado: puede abrir Detail.
- Cero o varios: Fields en modo auto.
- Host explícito no se sobreescribe.
- Docs puede ser default en multidocumento mediante configuración.

## 9.2. Switcher

- Tabs en una fila.
- Sin wrap.
- Collapse no deforma tabs.
- En ancho mínimo puede ocultar label visual y conservar `sr-only`.
- `Documento:*` y context summary no se montan en la fila de tabs.

## 9.3. Presentación

```txt
docked
overlay
```

Debe evitar solapes, conservar Canvas usable y no dejar controles flotantes cuando está colapsado.

## 9.4. Scroll

```txt
SidebarFrame: overflow-hidden
Header: shrink-0
Body: overflow-hidden
Panel viewport: overflow-y-auto
```

Un solo scroll owner por panel y posición independiente para Fields, Detail, Docs y Comments.

---

# 10. RightSidebar Fields/ListView

## 10.1. Header y toolbar

Debe mostrar título, total, selección, Reasignar, Más, búsqueda, filtro por tipo y filtros configurables.

No duplicar otro header dentro del sortable container.

## 10.2. Fila

Debe mostrar:

- grip;
- icono;
- label principal;
- name técnico secundario;
- tipo;
- owner;
- badges;
- acciones.

Badges/estados:

```txt
required
readonly
locked
hidden
invalid
duplicate name
assigned
unassigned
editing by me
blocked by recipient
```

## 10.3. Acciones

- abrir detalle;
- delete;
- hide/show;
- lock/unlock;
- comments;
- reassign;
- more.

No cambian el ancho al aparecer, detienen propagación y respetan permisos.

## 10.4. Selección y reorder

- `activeSchemaIds` fuente única.
- Click replace.
- Ctrl/Cmd toggle.
- Shift range.
- Hover sincronizado con Canvas.
- `aria-selected`.
- Reorder filtrado conserva orden global.

## 10.5. Empty states

Distinguir:

- sin schemas;
- filtro sin resultados;
- sin campos en documento/página;
- ocultos por recipient.

---

# 11. DetailView/Inspector

## 11.1. Contrato declarativo

Cada schema declara secciones aplicables:

```txt
basics
content
options
appearance
validation
dataLabel
help
location
collaboration
advanced
fileRules
connections
comments
```

No usar `if (type === ...)` disperso.

## 11.2. Header

Muestra icono, label, name, type, owner, documento/página, selección, estado de acceso, volver y acciones.

## 11.3. Secciones

### Información del campo

- name;
- label;
- data label;
- tooltip/help;
- rename;
- advertencia duplicado;
- type readonly.

### Contenido

Default, placeholder, texto, note content, action label o template.

### Opciones

Agregar, eliminar, subir, bajar, label, value y default.

### Apariencia

Solo controles aplicables: opacidad, fuente, tamaño, spacing, line height, align, colores, border, radius, dynamic size.

### Validación

Required, readonly, hidden, tipo, patrón, min/max y mensaje.

### Reglas de archivo

Solo attachment: tipos, cantidad, tamaño, reemplazo, nombre y estado.

### Ubicación y tamaño

X, Y, ancho, alto, rotación, alineación y lock.

### Datos y conexiones

```txt
Persistencia
Salida JSON
Consulta API
```

Debe incluir estado, validar, configurar, labels, field key, mapping, errores y adapter real. No stubs silenciosos.

### Asignación y bloqueo

Owner, recipient, estado, lock, readonly, editing by me/other, reassign, release edit y lock/unlock. Labels/tones de un resolver central.

### Comentarios

Ver, agregar, contador y navegar al hilo.

### Advanced

Solo si contiene controles reales.

## 11.4. Interacción

- Switch con un click.
- Inputs y dropdowns no interactúan con Canvas.
- Cerrar popup no congela selección.
- Cambios controlados.
- Sin DOM imperativo.
- Sin secciones vacías.
- Sin alturas mínimas artificiales.

---

# 12. DocumentsRail

Debe soportar:

- lista de documentos;
- preview;
- número;
- páginas;
- activo;
- seleccionar;
- subir PDF;
- agregar página;
- eliminar con permiso;
- disabled reason;
- empty state;
- scroll propio.

En multidocumento conserva documentId/fileId, routing, assignments y página activa. Puede usar split/stacked según ancho.

---

# 13. CommentsRail

Debe soportar:

- comentario por schema;
- comentario por página;
- anchor por coordenadas;
- hilo activo;
- agregar;
- responder si bridge lo permite;
- resolver/reabrir si bridge lo permite;
- contador;
- navegación;
- empty state;
- scroll propio.

Dialog:

- Cancelar/X/Escape;
- Guardar una vez;
- eventos aislados;
- restaurar interacción al cerrar.

---

# 14. Reasignación

## 14.1. Apertura

Desde selección simple/múltiple, ListView y DetailView.

## 14.2. Modal

Muestra seleccionados, cantidad, owner actual, búsqueda, recipients, rol, color, actual, Cancelar y Reasignar.

## 14.3. Confirmación

Actualiza:

```txt
ownerRecipientId
ownerRecipientIds
recipientId
ownerColor
recipientColor
userColor
assignments
snapshot
runtime access
```

No cambia:

```txt
schemaUid
routing
locked
readOnly
objectLocked
collaborationLock
```

## 14.4. Cierre

Cancelar, X, Escape, mask configurada y confirmar.

Debe conservar selección, liberar modal lock, limpiar pointer state y no congelar Canvas. AntD oculto no cuenta como popup abierto.

---

# 15. Usuario activo y colaboración

Selector visible cuando colaboración está habilitada.

Muestra usuario, color, rol y global view.

Al cambiar:

- actualiza RecipientRegistry;
- activeRecipientId;
- permisos;
- filtros;
- owner de nuevos schemas;
- runtime.

No debe repintar incorrectamente schemas existentes ni desaparecer al cambiar de panel derecho.

---

# 16. Multipágina y multidocumento

Debe soportar:

- varios PDFs;
- varias páginas;
- tamaños diferentes;
- page navigator;
- scroll continuo;
- página 2+;
- schema routing;
- máscaras no activas;
- documento/página activa;
- assignments por documento/página;
- coordenadas contra el paper correcto.

---

# 17. Form, Viewer y Snapshot

## 17.1. Form

- controles interactivos;
- recipient filtering;
- required;
- readonly;
- hidden;
- validation;
- valores por schemaUid;
- cambios al host;
- inputs por documento;
- guardado parcial;
- reasignaciones reflejadas.

## 17.2. Viewer

- readonly;
- sin sidebars;
- sin Moveable/Selecto;
- sin chrome;
- respeta hidden y recipient.

## 17.3. Snapshot

Preserva template, schemas, IDs, documents, routing, recipients, assignments, ownership, colors, locks, validation, groups, opciones, firma, conexiones, comentarios, config e inputs cuando aplica.

Restaurar no genera IDs nuevos ni pierde geometría o metadatos.

---

# 18. Acciones y accesibilidad

Cada acción debe tener:

```txt
visible
enabled
disabledReason
handler
label
ariaLabel
testId
shortcut
```

Reglas:

- icon-only con tooltip;
- botón sin handler no se renderiza;
- `type="button"`;
- focus visible;
- `aria-selected` en filas;
- `aria-pressed` en toggles;
- tabs con roles;
- foco restaurado en modales;
- no usar `aria-hidden` sobre controles.

---

# 19. Responsive y densidad

Densidades:

```txt
comfortable
compact
minimal/narrow
```

Reglas:

- no coexistir `mini` y `minimal`;
- tabs no hacen wrap;
- densidad no cambia layout LeftSidebar;
- funciones críticas siempre tienen alternativa;
- overlay no bloquea permanentemente el Canvas;
- un scroll owner por panel.

---

# 20. Rendimiento

- Memoizar resolvers.
- No duplicar listas ni selección.
- No ejecutar scrollIntoView en cada render.
- No reconstruir plugin registry.
- Evitar remount de widgets.
- No consultar todo el DOM salvo guards técnicos.
- Montar paneles según necesidad o preservar scroll con una estrategia explícita.

---

# 21. Criterios de aceptación

## Schemas

```txt
[ ] Identidad/routing estables.
[ ] Owner coherente.
[ ] Estados diferenciados.
[ ] Designer/Form/Viewer/PDF coherentes.
[ ] Inspector proporcional.
[ ] Ningún control visible sin persistencia.
```

## LeftSidebar

```txt
[ ] Búsqueda, favoritos y recientes.
[ ] list/tiles/icons.
[ ] Drag preview.
[ ] Sin scroll accidental.
[ ] Custom y auto-place.
[ ] Collapse correcto.
```

## RightSidebar

```txt
[ ] Tabs en una fila.
[ ] Un scroll owner por panel.
[ ] Canvas ↔ ListView sincronizado.
[ ] Reorder.
[ ] Detail auto-focus.
[ ] Docs/Comments.
[ ] Collapse sin distorsión.
```

## DetailView

```txt
[ ] Secciones declarativas.
[ ] Sin secciones vacías.
[ ] Switch con un click.
[ ] Inputs aislados.
[ ] Opciones editables.
[ ] Connections reales.
[ ] Access resolver único.
```

## Reasignación

```txt
[ ] Simple y múltiple.
[ ] Cancelar conserva selección.
[ ] Confirmar actualiza ownership.
[ ] Locks preservados.
[ ] Cierre no congela Canvas.
```

## Runtime

```txt
[ ] Form por recipient.
[ ] Viewer readonly.
[ ] Snapshot roundtrip.
[ ] Multi-document.
[ ] PDF sin chrome.
```

## Tailwind

```txt
[ ] No CSS visual nuevo.
[ ] 0 @apply.
[ ] Residual técnico documentado.
[ ] Baseline visual comparable.
```

---

# 22. Prioridades

## P0

1. Selección única y sincronizada.
2. Scroll por panel.
3. Reasignar sin freeze.
4. Selector de usuario.
5. Drag/drop.
6. Multipágina/multidocumento.
7. Persistencia real del inspector.
8. Tailwind sin regresiones.

## P1

1. Inspector declarativo.
2. Editor de opciones común.
3. Ownership/access central.
4. Grupos.
5. Firma técnica + políticas del host.
6. Attachment runtime.
7. Connections con adapters.

## P2

1. Atajos completos.
2. Copy/paste de grupos.
3. Layouts del catálogo.
4. Favoritos/recientes.
5. Comentarios anclados.
6. QA responsive.

---

# 23. Regla de diagnóstico

Clasificar cada incidencia antes de corregir:

```txt
DATA
STATE
INTERACTION
LAYOUT
STYLE
RUNTIME
SNAPSHOT
HOST INTEGRATION
```

No corregir state con CSS, layout con z-index ni funcionalidad desconectada mostrando un botón sin handler.

Arquitectura objetivo:

```txt
schema + context
  -> profile resolver
  -> access resolver
  -> action state
  -> renderer/widget
  -> controlled update
  -> snapshot/runtime
```
