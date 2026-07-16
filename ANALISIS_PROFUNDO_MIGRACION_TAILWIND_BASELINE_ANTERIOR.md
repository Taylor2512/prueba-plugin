# Análisis profundo — Migración Tailwind y recuperación del baseline visual de SISAD PDFME

## 1. Resumen ejecutivo

La migración ya no está en una fase inicial. El estado consolidado más reciente muestra:

```txt
src/sisad-pdfme/ui/styles/sisad-pdfme.css
- 509 líneas
- 90 apariciones de @apply

src/sisad-pdfme/ui/styles/tokens.css
- 150 líneas
- 0 @apply

src/features/pdfcomponent/labRoutes.css
- eliminado/neutralizado

src/styles/sisad-tailwind-bridge.css
- vacío

src/styles/tailwind.css
- única fuente de @tailwind
```

La reducción fue grande, pero el proceso se volvió lento y alteró el diseño porque se confundieron tres objetivos distintos:

1. **Mover skin visual local a JSX/TSX.**
2. **Eliminar reglas duplicadas o huérfanas.**
3. **Eliminar absolutamente todo CSS.**

Los dos primeros son correctos. El tercero no lo es.

El objetivo técnico final debe ser:

```txt
0 @apply en las hojas CSS
≠
0 líneas CSS
```

El CSS técnico debe continuar existiendo como CSS plano para:

```txt
- geometría de paper/canvas;
- selectores descendientes de Moveable, Selecto y Scena Guides;
- relaciones stage → canvas → sidebar;
- pointer-events coordinados;
- estados de drag/resize/rotate;
- print;
- keyframes realmente usados;
- custom properties runtime;
- selectores de terceros que no reciben className.
```

Forzar que esos contratos vivan en JSX/TSX produciría wrappers artificiales, lógica duplicada, estilos inline difíciles de mantener o regresiones en selección, scroll, zoom y multipágina.

---

## 2. Qué muestran las imágenes de la versión anterior

Las capturas anteriores no representan una sola pantalla: documentan el contrato visual y funcional completo del editor.

## 2.1 Shell principal

La versión anterior conservaba:

```txt
- título “Multidocumento integral”;
- selector de usuario activo visible;
- botones “Usuario activo” y “Estado”;
- canvas central con cuadrícula;
- LeftSidebar estable;
- RightSidebar estable;
- CtlBar flotante centrado;
- ResultsPanel en la zona inferior;
- paginador superior centrado;
- acción Guardar separada del RightSidebar.
```

El selector de usuarios no era decoración. Formaba parte de la navegación contextual del editor y permitía confirmar el usuario activo, permisos, filtros y colores.

## 2.2 LeftSidebar

El baseline anterior muestra:

```txt
- anchura compacta pero utilizable;
- grupos Recientes, Firmas, Texto, Imagen y medios, Selecciones;
- items neutros con borde fino;
- iconografía consistente;
- controles de layout visibles;
- scroll vertical propio;
- azul usado como acento, no como estado activo permanente.
```

## 2.3 Canvas

El canvas anterior muestra:

```txt
- cuadrícula visible;
- página claramente separada del fondo;
- reglas superior e izquierda;
- field chrome por propietario;
- toolbar contextual próxima al schema seleccionado;
- scroll multipágina;
- zoom visible como porcentaje.
```

## 2.4 RightSidebar

Las capturas anteriores cubren:

```txt
- lista de campos;
- detalle/inspector;
- documentos;
- comentarios;
- reasignación;
- conexión/persistencia;
- opciones de select;
- formato;
- reglas del archivo;
- ubicación y tamaño.
```

La referencia no exige restaurar cada pixel antiguo. Sí exige preservar:

```txt
- jerarquía;
- densidad;
- navegación;
- visibilidad de acciones;
- distribución de espacios;
- continuidad de tabs;
- scroll;
- estados activos;
- selector de usuario.
```

---

## 3. Qué cambió realmente

No todo cambio visual se debe a Tailwind.

## 3.1 Regresiones de cascada

Durante la migración se retiraron reglas CSS antes de que el nodo propietario tuviera todas las clases equivalentes.

Síntomas típicos:

```txt
- filas con borde nativo negro;
- botones con border-style outset;
- tabs partidos en dos líneas;
- paneles sin ancho;
- headers con altura incorrecta;
- sombras/radios inconsistentes;
- scroll perdido;
- contenido recortado.
```

El proyecto usa:

```txt
preflight: false
```

Por eso clases como `border`, `border-b` o `border-r` no siempre producen el mismo resultado esperado si no se declara explícitamente:

```txt
border-solid
```

## 3.2 Cambios de estructura React

Algunos cambios no son CSS:

```txt
- PageHeader oculto en el shell embebido;
- selector de usuario movido a RegisteredUsersSelector/CtlBar;
- Docs como panel inicial para multi-document;
- RightSidebar reconstruido con rails;
- ResultsPanel convertido en drawer/pill;
- cambios en controlled/uncontrolled state;
- cambio del panel mode esperado por tests.
```

Estos casos no se corrigen restaurando selectores CSS.

## 3.3 Cambios funcionales legítimos

No se debe revertir:

```txt
- wrappers públicos SisadPdfmeDesigner/Form/Viewer;
- RecipientRegistry;
- owner colors;
- modal Reasignar corregido;
- ListView plano;
- Docs default en multidocumento;
- scroll multipágina;
- selectionPolicy;
- CommandBus/ActionRegistry;
- separación host/core.
```

La recuperación visual debe montarse sobre esta arquitectura, no reemplazarla con el DOM antiguo.

---

## 4. Causa principal de la lentitud

El registro muestra un ciclo repetitivo:

```txt
1–2 selectores
→ build completo
→ dos pruebas Playwright
→ actualizar task-card
→ actualizar ledger
→ volver a investigar
```

Ese patrón fue seguro al principio, pero dejó de ser eficiente.

También existen dos task-cards activas sobre los mismos archivos:

```txt
TASK-CSS-026
TASK-REGRESSION-021
```

y hubo edición paralela de:

```txt
sisad-pdfme.css
RightSidebar
DetailView
ListView
LeftSidebar
CtlBar
ResultsPanel
```

Eso provoca:

```txt
- colisiones;
- conteos desactualizados;
- reglas borradas mientras otro agente cambia consumidores;
- revalidaciones repetidas;
- decisiones contradictorias;
- trabajo rehecho.
```

---

## 5. Estado real de `sisad-pdfme.css`

La hoja actual tiene 509 líneas y 90 `@apply`.

## 5.1 Bloques globales y shell

Rangos aproximados:

```txt
25–109
```

Contienen:

```txt
root
box sizing
scrollbars
page
header
grid
workspace
designer root/background/workspace/stage
```

Acción:

```txt
- mover page/header/grid/workspace al nodo React propietario;
- conservar root reset/scrollbar como CSS plano global;
- conservar dimensiones runtime basadas en variables;
- eliminar duplicaciones.
```

## 5.2 Canvas, preview y paper

Rangos aproximados:

```txt
110–155
200–274
```

Contienen:

```txt
canvas/preview scroll
grid background
paper root
scale layer
paper page geometry
page surface
padding
Scena Guides
Moveable
```

Acción:

```txt
- no migrar en bloque;
- separar visual local de geometría;
- canvas/paper geometry queda en CSS plano;
- skin de Canvas/Paper puede vivir en JSX solo si el mismo nodo es dueño en Designer y Preview;
- descendientes de Scena/Moveable quedan en CSS técnico.
```

## 5.3 LeftSidebar

Rangos aproximados:

```txt
184–199
325–327
345–375
451–463
```

Acción:

```txt
- root visual y estado collapsed/expanded → LeftSidebar.tsx;
- estado draggable → wrapper del item con data variants;
- conservar únicamente contratos cross-tree que no puedan expresarse localmente;
- resolver duplicación de draggable-shell.
```

## 5.4 RightSidebar

Rangos aproximados:

```txt
286–390
```

Contiene dos tipos de reglas diferentes:

### Migrables

```txt
- root surface;
- transform de apertura;
- width responsive;
- radius;
- background;
- shadow;
- reduced motion.
```

### Técnicas/cross-tree

```txt
stage[data-sidebar-open] → canvas padding-right
stage[data-sidebar-open] → control-bar right
variant compact → canvas padding
```

No deben eliminarse juntas. El bloque debe dividirse:

```txt
RightSidebar.tsx
+
CSS técnico de coordinación del stage
```

## 5.5 Drag, selección y overlays

Rangos aproximados:

```txt
433–474
```

Contienen:

```txt
drag cursor
drop validity
Moveable visibility
toolbar visibility
inline edit visibility
plugin drag states
mask visibility
option-group floating action visibility
```

Acción:

```txt
- mantener como CSS plano cuando el estado vive en stage y afecta descendientes;
- migrar únicamente estados del nodo propietario;
- no convertir relaciones stage→descendiente en lógica React duplicada.
```

## 5.6 Keyframes

Rangos aproximados:

```txt
400–429
476–509
```

Nombres:

```txt
rs-slide-in
rs-panel-switch
rs-stagger-in
schema-drag-preview-enter
schema-drop-commit-flash-enter
toolbar-reveal
```

En el consolidado actual no aparecen referencias activas a esos nombres fuera de sus declaraciones.

Acción:

```txt
- ejecutar búsqueda exacta en src, tests y Tailwind config;
- si el resultado es 0, eliminar el keyframe;
- no conservar animaciones por historial;
- si una clase arbitraria las consume, mantener solo la animación realmente usada.
```

---

## 6. Duplicaciones y conflictos detectados

## 6.1 Root font

Existe definición de fuente en el bloque raíz inicial y otra definición posterior de `.sisad-pdfme-root`.

Acción:

```txt
dejar una sola fuente de verdad
```

## 6.2 Canvas background/grid

El canvas aparece en bloques compartidos y específicos:

```txt
designer-canvas + preview-scroll
designer-canvas
root designer-canvas[data-grid-visible]
```

Esto permite que una regla posterior cambie padding, background o tamaño sin que el componente lo muestre claramente.

Acción:

```txt
- Preview.tsx posee preview;
- Canvas.tsx posee canvas;
- CSS solo mantiene grid técnico si depende de data attributes;
- no compartir skin visual entre ambos por selector compuesto.
```

## 6.3 Paper surface

La superficie del papel se define tanto para:

```txt
[data-paper-page]
```

como para:

```txt
[data-canvas-page]
```

con radios y sombras distintas.

Acción:

```txt
- geometría en Paper;
- skin por runtime mode mediante className/data-render-mode;
- una sola sombra por modo;
- eliminar reglas que compiten por orden de cascada.
```

## 6.4 LeftSidebar draggable

`left-sidebar-draggable-shell[data-dragging=true]` aparece en más de una zona.

Acción:

```txt
una sola regla o, preferiblemente, data variant en el wrapper TSX
```

## 6.5 Media queries vacías

Hay bloques media sin contenido.

Acción:

```txt
eliminar inmediatamente
```

---

## 7. Clasificación estimada de los 90 `@apply`

La clasificación exacta debe confirmarse con el script de auditoría, pero el archivo actual permite estimar:

| Destino | Estimación | Acción |
|---|---:|---|
| `MIGRATE_TO_TSX` | 25–32 | Skin y layout local |
| `KEEP_AS_PLAIN_TECHNICAL_CSS` | 45–55 | Reescribir propiedades CSS sin `@apply` |
| `DELETE_DUPLICATE_OR_ORPHAN` | 8–15 | Eliminar con evidencia |
| `KEEP_GLOBAL_PLAIN_CSS` | 5–10 | Reset local, scrollbar, variables |

El cierre correcto es:

```txt
0 @apply
~220–320 líneas de CSS plano técnico
150 líneas de tokens
```

No es correcto exigir:

```txt
0 líneas en sisad-pdfme.css
```

---

## 8. Plan acelerado corregido

## Paquete 0 — Congelar concurrencia

Antes de modificar:

```txt
- dejar una sola task-card activa;
- detener edición paralela de los mismos archivos;
- hacer commit/checkpoint del estado actual;
- medir 509 líneas / 90 @apply;
- capturar baseline actual y baseline anterior.
```

## Paquete 1 — Eliminación segura

Eliminar con una única validación al final:

```txt
- media queries vacías;
- root font duplicado;
- keyframes sin consumidores;
- comentarios obsoletos;
- reglas exactas duplicadas.
```

Objetivo esperado:

```txt
509 → ~440–460 líneas
90 → ~80–85 @apply
```

## Paquete 2 — Shell y wrappers

Archivos:

```txt
Root.tsx
Designer/index.tsx
Preview.tsx
PdfmeLabPage.jsx
RegisteredUsersSelector.tsx
```

Migrar:

```txt
page
header
grid
workspace
root/background/workspace/stage skin
lab-runtime-host
```

No tocar paper geometry.

## Paquete 3 — LeftSidebar

Archivos:

```txt
LeftSidebar.tsx
LeftSidebarTabs.tsx
LeftSidebarSearch.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
```

Objetivos:

```txt
- neutral state;
- selected/hover/drag separados;
- root/expanded/collapsed local;
- draggable state local;
- conservar scroll.
```

## Paquete 4 — RightSidebar

Archivos:

```txt
RightSidebar.tsx
layout.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
SidebarSurfacePrimitives.tsx
```

Migrar root visual y responsive local.

Conservar CSS técnico:

```txt
stage → canvas padding
stage → CtlBar offset
cross-tree variant compact
```

## Paquete 5 — Canvas/Paper split

No rediseñar.

Separar:

```txt
- visual del canvas;
- visual del preview;
- geometría paper;
- grid;
- terceros.
```

Mover solo visual local.

Convertir `@apply` técnico a CSS plano.

## Paquete 6 — Drag/interaction

No mover selectores cross-tree a React.

Reescribir:

```txt
@apply cursor-copy;
```

como:

```css
cursor: copy;
```

y lo mismo para:

```txt
display
opacity
pointer-events
outline
filter
```

Objetivo:

```txt
eliminar Tailwind de CSS sin eliminar CSS técnico
```

## Paquete 7 — QA final

Ejecutar una vez:

```bash
npm run build
npx playwright test
```

Comparar:

```txt
- selector de usuario;
- LeftSidebar;
- lista/detalle/docs/comentarios;
- Reasignar;
- conexión;
- canvas;
- página 2+;
- zoom;
- ResultsPanel;
- scroll.
```

---

## 9. Regla de validación para acelerar

Durante un paquete:

```bash
npx tsc --noEmit
```

Al cerrar el paquete:

```bash
npm run build
```

Playwright solo por dominio.

No hacer:

```txt
selector
→ build
→ Playwright
→ ledger
```

Hacer:

```txt
15–30 reglas relacionadas
→ typecheck
→ build
→ pruebas de dominio
→ ledger
```

---

## 10. Criterios de aceptación finales

## Tailwind

```txt
[ ] 0 @apply en sisad-pdfme.css.
[ ] 0 @apply en tokens.css.
[ ] labRoutes.css eliminado.
[ ] bridge vacío o eliminado.
[ ] una sola entrada @tailwind.
```

## CSS residual

```txt
[ ] Todo bloque residual está clasificado.
[ ] No queda skin local trasladable.
[ ] Geometría y terceros permanecen en CSS plano.
[ ] No hay keyframes huérfanos.
[ ] No hay media queries vacías.
[ ] No hay selectores duplicados por cascada.
```

## Diseño

```txt
[ ] Selector de usuario visible.
[ ] Header mantiene jerarquía de la versión anterior.
[ ] LeftSidebar conserva densidad y neutral state.
[ ] RightSidebar mantiene tabs/list/detail/docs/comments.
[ ] CtlBar no tapa ResultsPanel.
[ ] Papel y canvas tienen contraste correcto.
[ ] Owner color no se confunde con selección.
```

## Comportamiento

```txt
[ ] Drag desde catálogo.
[ ] Reorder ListView.
[ ] Selección simple/múltiple.
[ ] Reasignar sin freeze.
[ ] Página 2+.
[ ] Zoom y fit.
[ ] Scroll independiente.
[ ] Multi-document.
[ ] Form/Viewer.
```

---

## 11. Conclusión

La migración está avanzada. El cuello de botella ya no es la cantidad de CSS, sino:

```txt
- concurrencia;
- validación por micro-slice;
- objetivo incorrecto de “vaciar CSS”;
- mezcla de cambios visuales y estructurales;
- reglas técnicas tratadas como skin;
- cascada duplicada entre canvas/preview/paper.
```

La estrategia correcta permitirá terminar más rápido:

```txt
509 líneas / 90 @apply
→
0 @apply
+
CSS técnico plano y documentado
+
paridad visual con la versión anterior
```
