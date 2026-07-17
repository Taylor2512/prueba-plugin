# Plan maestro de estabilización visual, UX y QA post‑migración Tailwind — SISAD PDFME

**Fecha:** 2026-07-17  
**Ruta objetivo:** `http://localhost:5174/lab/multi-document-routing`  
**Alcance:** Designer, Canvas, LeftSidebar, RightSidebar, DetailView, ListView, DocumentsRail, rails colapsados, CtlBar, popovers, lint y pruebas.

---

## 1. Veredicto ejecutivo

La migración visual avanzó mucho, pero el estado actual no debe considerarse todavía una versión UX estable. Las capturas muestran un diseñador funcional con estas regresiones principales:

1. El botón **Guardar** invade el switcher del RightSidebar y compite con las pestañas.
2. El **DetailView no puede desplazarse** hasta las secciones inferiores.
3. El RightSidebar usa demasiadas superficies, bordes, radios y sombras anidadas.
4. El LeftSidebar hace que casi todos los campos parezcan activos por el borde azul permanente.
5. Los menús de “Más”, los selectores de validación y el selector de zoom se ven desconectados del diseño del producto.
6. La vista documental mezcla “documentos” y “páginas”, y varias acciones quedan recortadas.
7. El toolbar contextual del Canvas puede cubrir el schema seleccionado.
8. El estado colapsado de los sidebars todavía se siente como controles flotantes aislados.
9. `npm run lint` no está estable: existen **4 errores y 208 advertencias**.
10. Hay artefactos de pruebas E2E fallidas en color de propietario, transformación, foco, rails y cobertura de tipos de schema.

La prioridad correcta es:

```txt
P0 Integridad funcional
→ P1 jerarquía del workspace
→ P2 densidad y consistencia visual
→ P3 accesibilidad y responsive
→ P4 limpieza completa de warnings y estabilización de pruebas
```

No se debe seguir “decorando” antes de cerrar scroll, hooks, memoización, foco, selección y ownership.

---

## 2. Novedad arquitectónica importante: la migración no quedó totalmente Tailwind-only

`src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó vacío, pero los estilos residuales fueron trasladados a:

```txt
src/sisad-pdfme/ui/runtimeStyles.ts
```

Ese archivo contiene CSS como string e inyecta un `<style>` desde el runtime. Por tanto:

```txt
CSS en archivo .css = 0
CSS puro real = todavía existe dentro de runtimeStyles.ts
```

Esto no es necesariamente incorrecto para contratos técnicos imposibles o inconvenientes de expresar con clases:

- geometría de stage/canvas/paper;
- selectores de nodos generados por Moveable, Selecto o Scena Guides;
- pseudoestados sobre DOM de terceros;
- reglas dinámicas de impresión/PDF;
- scrollbar técnico;
- pointer-events de overlays;
- variables runtime.

Sí es incorrecto mantener allí skin ordinario:

- colores y sombras de tarjetas;
- padding y radio de botones;
- apariencia de tabs;
- cards de sidebars;
- estados hover/focus;
- listas del inspector;
- chips y badges;
- layout visual del header.

### Regla de cierre

`runtimeStyles.ts` debe quedar clasificado línea por línea:

```txt
KEEP_TECHNICAL
MIGRATE_TO_TAILWIND
DELETE_DEAD
```

No crear otro CSS global ni otro archivo de estilos inyectados.

---

## 3. Diagnóstico visual por superficie

## 3.1 Workspace y botón Guardar

### Problema

Guardar está presentado como una pastilla flotante junto al menú `…`, encima del área superior derecha. En varias capturas invade el switcher `Campos / Detalle / Docs` y hace que `Detalle` aparezca recortado como “D”.

Esto produce tres errores de jerarquía:

- Guardar parece pertenecer al RightSidebar.
- El switcher pierde espacio y legibilidad.
- La posición cambia visualmente según se abre o cierra el sidebar.

### Diseño objetivo

Guardar debe pertenecer al **toolbar global del stage**, no al panel derecho.

Estructura recomendada:

```tsx
<div className="grid h-11 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-solid border-slate-200/60 bg-white/90 px-3 backdrop-blur">
  <DocumentContext className="min-w-0 justify-self-start" />
  <UnitPager className="justify-self-center" />
  <div className="flex items-center gap-1 justify-self-end">
    <SaveAction />
    <GlobalMoreMenu />
  </div>
</div>
```

### Reglas

- Altura: `44–48 px`.
- No usar posición respecto al viewport.
- No depender del ancho del RightSidebar.
- El stage se reduce al abrir los sidebars; Guardar permanece dentro de su columna.
- Estado visible:
  - `Guardado`;
  - `Cambios sin guardar`;
  - `Guardando…`;
  - `Error al guardar`.
- En ancho reducido:
  - icono Guardar;
  - texto ocultable;
  - tooltip obligatorio.
- El botón `…` global debe contener:
  - Atajos;
  - cuadrícula;
  - guías;
  - snaps;
  - padding;
  - insertar/duplicar página;
  - exportar.

El menú `…` del RightSidebar no debe contener configuración global del Canvas.

---

## 3.2 Scroll roto del DetailView

### Causa raíz confirmada

El contrato correcto ya había sido documentado con `SidebarBody` como propietario único del scroll. En la versión actual se cambió:

```txt
overflow-y-auto overflow-x-hidden overscroll-contain
```

por:

```txt
overflow-hidden
```

Al mismo tiempo, el nuevo `right-sidebar-panel-stack` y sus slots también usan `overflow-hidden`. El contenido largo del DetailView queda recortado y no existe un descendiente que recupere el scroll.

### Contrato final

```txt
aside              h-full min-h-0 flex flex-col overflow-hidden
content            min-h-0 flex-1 flex flex-col overflow-hidden
panel switcher     shrink-0
panel stack        min-h-0 flex-1 overflow-hidden
active slot        min-h-0 flex-1 overflow-hidden
detail host        min-h-0 flex-1 overflow-hidden
sidebar frame      h-full min-h-0 flex flex-col overflow-hidden
header             shrink-0
body               min-h-0 flex-1 overflow-y-auto overflow-x-hidden
footer             shrink-0
```

Clase recomendada para `SidebarBody`:

```tsx
'flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-gutter:stable] px-2 pb-3 pt-2'
```

### Archivos foco

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
```

### Criterios

- Scroll hasta `Datos y conexiones`, `Asignación y bloqueo` y `Avanzado`.
- Cabecera del schema no se desplaza.
- Tabs no se desplazan.
- Sin scroll horizontal.
- Un solo propietario de scroll por panel.
- El scroll no se reinicia al cambiar un input.
- Cambiar de schema puede volver arriba únicamente cuando cambia realmente `schemaUid`.

---

## 3.3 DetailView

### Problemas

- Secciones excesivamente altas aunque tengan pocos controles.
- Radios de 18–24 px repetidos.
- Bordes grises oscuros en cada accordion.
- Mucho espacio vacío en Información del campo, Reglas e Interacción.
- La jerarquía de subtítulos compite con el nombre de la sección.
- El select de validación utiliza el desplegable nativo del sistema y rompe el lenguaje visual.
- Inputs de ubicación pueden quedar debajo del viewport sin acceso por el fallo de scroll.
- El header de selección usa un punto azul sin explicar owner/estado.

### Diseño objetivo

```tsx
<section className="overflow-hidden rounded-xl border border-solid border-slate-200/70 bg-white">
  <button className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-slate-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200">
    ...
  </button>

  <div className="space-y-3 border-t border-solid border-slate-100 px-3 py-3">
    ...
  </div>
</section>
```

### Reglas

- Radio máximo recomendado: `12 px`.
- Sin sombra permanente.
- Separación entre secciones: `8 px`.
- No usar `min-h-*` fijo en contenido.
- Dos columnas solo cuando ambos controles caben con mínimo de 120 px.
- Geometría:
  - X/Y: dos columnas;
  - ancho/alto: dos columnas;
  - rotación: una fila;
  - alineación: grilla 4×2 compacta.
- Secciones inicialmente abiertas:
  - Información;
  - Reglas principales.
- Secciones inicialmente cerradas:
  - Datos y conexiones;
  - Asignación;
  - Avanzado.
- “Editar texto” debe ser contextual:
  - visible para schemas text-like;
  - oculto para tipos que no soportan edición inline.
- Evitar duplicar `Nombre del campo` + `Renombrar`; una única acción y una única persistencia.

### Selectores

Usar un selector controlado del sistema de componentes, no `<select>` nativo si se requiere paridad visual. El popup debe:

- renderizarse en portal;
- tener `max-height`;
- respetar viewport;
- no modificar altura del panel;
- cerrarse con Escape;
- devolver foco al trigger;
- usar `data-interaction-exclusion`.

---

## 3.4 RightSidebar — switcher y cabecera

### Problemas

- Tabs sin espacio por Guardar.
- “Detalle” recortado.
- Docs y Campos compiten con acciones globales.
- El botón colapsar no tiene patrón idéntico al LeftSidebar.
- Context header, Reasignar, contador y menú aparecen en la misma línea aunque no caben.

### Diseño objetivo

Dos filas como máximo:

```txt
Fila 1: Tabs + collapse
Fila 2: Contexto del panel + acciones locales
```

Para ListView:

```txt
Campos        11/11
2 seleccionados           Reasignar   …
```

Para Detail:

```txt
contract_date
Texto · Cliente principal
```

Para Docs:

```txt
Documentos
2 cargados                 Subir PDF
```

### Reglas

- El switcher es `shrink-0`.
- Tabs con texto completo en panel abierto.
- Rail colapsado solo iconos + tooltip.
- Reasignar aparece únicamente con selección válida.
- En selección simple, Reasignar puede estar en menú contextual.
- En multiselección, aparece como acción primaria contextual.
- No mostrar un contador de usuarios aislado sin etiqueta.

---

## 3.5 ListView

### Problemas

- El borde azul permanente hace que todos los schemas parezcan seleccionados.
- El botón eliminar siempre visible agrega ruido.
- El owner color y el selected state se confunden.
- Filas altas y con demasiado espacio.
- Nombres técnicos largos dominan el panel.
- Lock y delete compiten en el extremo derecho.

### Estado visual correcto

```txt
Owner:
- barra izquierda de 3 px con ownerColor;
- siempre visible con opacidad media.

Hover:
- fondo slate muy suave.

Selected:
- fondo sky-50/50;
- ring sky-200;
- owner bar a opacidad completa.

Focus:
- ring accesible, distinto de selected.

Locked:
- icono lock;
- no bajar toda la opacidad de la fila.

Delete:
- visible en hover/focus o dentro de `…`;
- siempre accesible por teclado.
```

### Densidades

```txt
comfortable: 56–64 px
compact:     48–52 px
minimal:     40–44 px
```

No crear tres skins diferentes; solo cambia espacio y metadata visible.

---

## 3.6 DocumentsRail

### Problemas observados

- “Subir P” aparece recortado.
- El copy dice “Selecciona una página”, pero las filas parecen documentos.
- Delete queda flotando fuera de la tarjeta.
- Cards grandes con radio excesivo.
- El segundo número del header aparece aislado.
- Selección usa una superficie gris grande, no un estado claro.
- No existe jerarquía visual entre documento y páginas.

### Contrato recomendado

```txt
Documento
 ├─ nombre
 ├─ cantidad de páginas
 ├─ estado activo
 └─ acciones
```

Si se requiere seleccionar páginas:

```txt
Documento expandible
 ├─ Página 1
 ├─ Página 2
 └─ ...
```

No mezclar ambos niveles en una misma fila.

### Fila objetivo

```tsx
<div className="group grid min-h-14 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-solid border-slate-200/70 bg-white px-2.5 py-2 hover:bg-slate-50/70 data-[selected=true]:border-sky-200 data-[selected=true]:bg-sky-50/50">
```

- Delete dentro de la última columna.
- Upload:
  - texto completo con ancho suficiente;
  - en panel mini, icon-only + tooltip.
- Acción destructiva con confirmación.
- El documento activo usa un badge compacto, no texto mezclado con el número.

---

## 3.7 LeftSidebar

### Problemas

- Todos los botones tienen borde azul fuerte y parecen seleccionados.
- Tres niveles de superficie:
  - grupo;
  - wrapper;
  - botón.
- Sombras y radios repetidos.
- Las estrellas tienen demasiado contraste y tamaño.
- Las categorías ocupan altura excesiva.
- El panel se siente más ancho por densidad que por contenido.

### Diseño objetivo

- Una única superficie visible por plugin.
- Borde neutral por defecto.
- Azul solo para:
  - hover;
  - focus;
  - dragging;
  - favorito activo como acento pequeño.
- Altura list: `44–48 px`.
- Icono: `20–22 px`.
- Star: `28×28`, sin círculo morado permanente.
- Category header: `32–36 px`.
- Grupo con borde opcional muy sutil o sin borde.
- El layout seleccionado por el usuario no debe cambiar cuando cambia la densidad responsive.

---

## 3.8 Toolbar contextual del Canvas

### Problema

La pastilla de dimensiones y la barra `Eliminar / Más` pueden cubrir el schema, especialmente attachment y campos cercanos a la parte superior.

### Solución

- Anclar al bounding box real.
- Separación de 8 px.
- Preferencia arriba.
- Flip abajo si no cabe.
- Clamp dentro del stage.
- No usar ancho fijo grande.
- Métricas y acciones en una única barra o en dos superficies pequeñas coordinadas.
- El toolbar no participa en Selecto.
- El toolbar no inicia drag.
- `pointer-events-auto` solo en controles.
- A 1 schema:
  - Eliminar;
  - Más.
- A N schemas:
  - alinear;
  - distribuir;
  - duplicar;
  - eliminar;
  - reasignar si aplica.

---

## 3.9 Menús y popovers

### Error de información

El menú del RightSidebar contiene acciones del Canvas:

- cuadrícula;
- guías;
- snaps;
- padding;
- insertar página;
- duplicar página;
- exportar.

Estas acciones deben estar en el menú global del stage.

El menú local del RightSidebar debe contener únicamente:

```txt
Campos:
- renombrar;
- seleccionar todo;
- ordenar;
- densidad;
- mostrar/ocultar metadata.

Detalle:
- copiar identificador;
- restablecer sección;
- expandir/colapsar secciones.

Docs:
- subir;
- renombrar documento;
- duplicar;
- eliminar;
- ordenar.
```

### Diseño del popover

- Ancho: `208–240 px`.
- Radio: `10–12 px`.
- Padding: `6 px`.
- Item: `36–40 px`.
- Icono + label.
- Separadores por grupo.
- Check para toggles.
- No usar menú nativo oscuro.
- Portal y clamp al viewport.
- `z-index` centralizado.

---

## 3.10 Zoom

### Problemas

- El menú nativo se ve demasiado grande y desconectado.
- El trigger puede quedar con estilos disabled/focus inconsistentes.
- La lista tapa schemas por encima del toolbar.

### Diseño

- Toolbar inferior: `40–44 px`.
- Trigger: `72–80 px`.
- Popup abre hacia arriba.
- Menú: `96–112 px`.
- Opciones: 25, 50, 75, 100, 125, 150, 200.
- `100%` destacado.
- `fit page` y `fit width` como acciones separadas.
- Conversión única:
  - interno: `1`;
  - visible: `100%`.

---

## 3.11 Rails colapsados

### Diseño objetivo

Ambos lados deben compartir:

```txt
44 px de ancho
mismo componente SidebarRail
mismo icon button
mismo tooltip
mismo active indicator
misma animación
```

El rail derecho debe mostrar:

- Campos;
- Detalle;
- Comentarios;
- Docs.

Detalle disabled sin selección, con motivo en tooltip.

El rail izquierdo debe mostrar:

- Campos;
- Favoritos;
- Destinatarios o pestañas configuradas.

Al abrir un panel:

- no perder selección;
- no perder scroll del Canvas;
- no cambiar zoom;
- no desplazar el documento de forma brusca;
- restaurar el panel solicitado.

---

## 4. Errores de lint confirmados

## 4.1 Error P0 — `SisadPdfmeForm.tsx`

### Síntoma

React Compiler no puede preservar el `useMemo` de `runtimeConfig` porque el callback consume `collaborationOptions`, pero el array de dependencias enumera sus componentes en vez del objeto usado.

### Corrección recomendada

```tsx
const collaborationOptions = useMemo(
  () =>
    recipientFilterEnabled && !isGlobalView && effectiveActiveRecipientId
      ? { activeRecipientId: effectiveActiveRecipientId, isGlobalView }
      : { isGlobalView },
  [effectiveActiveRecipientId, isGlobalView, recipientFilterEnabled],
);

const runtimeConfig = useMemo(
  () => ({
    ...
    options: {
      ...resolvedConfig.runtimeOptions,
      designerEngine: resolvedConfig.designerEngine,
      collaboration: collaborationOptions,
    },
  }),
  [collaborationOptions, onInputChange, resolvedConfig, template, values],
);
```

También eliminar `cloneDeep` si no se utiliza.

No silenciar la regla del compiler.

---

## 4.2 Tres errores P0 — `SchemaDropCommitFlash.tsx`

### Síntoma

`useState`, `useState` y `useEffect` se ejecutan después de un early return.

### Regla

Todos los hooks deben ejecutarse siempre en el mismo orden.

### Estructura correcta

```tsx
const SchemaDropCommitFlash = ({ flash }) => {
  const [visible, setVisible] = useState(false);
  const [renderedFlash, setRenderedFlash] = useState(flash);

  useEffect(() => {
    if (!flash) {
      setVisible(false);
      return;
    }

    setRenderedFlash(flash);
    setVisible(true);

    const timer = window.setTimeout(() => setVisible(false), 420);
    return () => window.clearTimeout(timer);
  }, [flash]);

  if (!renderedFlash) return null;

  return (
    <div
      data-visible={visible}
      ...
    />
  );
};
```

Evitar timers simultáneos, limpiar el timer al cambiar flash y respetar `prefers-reduced-motion`.

---

## 5. Estrategia para 208 warnings

No corregir 208 warnings mezclando código productivo y tests generados en una sola pasada.

### 5.1 Primero código de producción

Objetivo:

```txt
src/** = 0 errores, 0 warnings
```

Grupos:

1. Imports/constantes sin uso:
   - `DEFAULT_SIGNATURE_PROVIDERS`;
   - `RESULTS_PANEL_STYLE`;
   - `normalizeText`;
   - constantes `SUMMARY`, `HELP`, etc.
2. Fachadas legacy con imports muertos:
   - `labExamples.js`;
   - catálogos separados.
3. `no-explicit-any`:
   - wrappers públicos;
   - adapters;
   - runtime config.
4. Memoización React Compiler.

### 5.2 Corregir duplicación del lint

Actualmente muchas advertencias aparecen dos veces:

```txt
no-unused-vars
@typescript-eslint/no-unused-vars
```

Config recomendada:

```js
{
  files: ['**/*.{ts,tsx}'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
}
```

Para JS/JSX mantener solo `no-unused-vars`.

### 5.3 Tests generados

Los tests generados concentran gran parte de `any`.

Elegir un contrato:

```txt
Opción A: tiparlos correctamente.
Opción B: excluir tests/generated del lint de producción y crear lint:generated separado.
```

No ocultarlos con un disable global.

Scripts recomendados:

```json
{
  "lint:src": "eslint src --max-warnings=0",
  "lint:tests": "eslint tests --max-warnings=0",
  "lint:generated": "eslint tests/**/generated",
  "lint": "npm run lint:src && npm run lint:tests"
}
```

### 5.4 Imports rotos en pruebas

Hay pruebas que todavía importan rutas eliminadas:

```txt
@/features/pdfcomponent/template
@/features/pdfcomponent/utils/binary
```

No recrear wrappers muertos para hacer pasar las pruebas. Actualizar los tests a la API canónica actual.

---

## 6. Pruebas fallidas detectadas y dominios a investigar

Los artefactos actuales registran fallos en:

```txt
schema owner — active recipient accent
schema owner — consumers from same resolver
schema transform — selected schema to page anchors
selection — focus returns to canvas
sidebar rail — never overlaps right rail
sidebar rail — restores requested panel
standard schemas — expected schema types
```

### 6.1 Owner color

Revisar la cadena:

```txt
recipient registry
→ schema ownership metadata
→ resolveSchemaOwnerTone
→ Renderer
→ fieldChrome
→ ListView
→ DetailHeader
```

El selected state no debe usar un color distinto que tape ownerColor.

### 6.2 Transform/page anchors

No cambiar expected hasta verificar:

- documentId;
- pageNumber;
- pageIndex;
- paperRef activo;
- zoom;
- scroll offsets;
- rect del stage;
- transforms.

### 6.3 Focus return

Después de cerrar:

- popover;
- modal Reasignar;
- selector;
- menú contextual;

el foco debe volver a:

- trigger, si sigue visible;
- Canvas, si la acción modifica selección.

No hacer `blur()` global incondicional.

### 6.4 Rails

Verificar:

- ancho real publicado;
- offset del stage;
- rail persistente;
- panel solicitado;
- restauración después de colapsar;
- no solapar Guardar;
- no solapar barra externa del host.

### 6.5 Tipos estándar

El test debe comparar:

```txt
schema registry canónico
vs.
catálogo visible/configurado
vs.
bundle normalizado
```

No debe depender de texto traducido ni del DOM visual completo.

Si un schema se oculta por configuración, el test debe conocer esa configuración; no se debe rebajar la cobertura reemplazando una verificación integral por “existe el botón de descargar”.

---

## 7. Plan de ejecución

## Fase 0 — Congelar baseline

```txt
[ ] Commit de la migración terminada.
[ ] Guardar capturas actuales.
[ ] Registrar `git status --short`.
[ ] Ejecutar lint, build, unit y e2e sin modificar expected.
[ ] Crear matriz real de fallos.
```

Comandos:

```bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
```

---

## Fase 1 — P0 funcional

Máximo cinco archivos por pase.

### Pase 1A

```txt
SisadPdfmeForm.tsx
SchemaDropCommitFlash.tsx
```

Validar:

```bash
npx eslint src/sisad-pdfme/react/SisadPdfmeForm.tsx \
  src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx

npx vitest run tests/unit/sisad-pdfme/react/runtime-modes.test.tsx
npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
```

### Pase 1B — scroll

```txt
RightSidebar/layout.tsx
RightSidebar/RightSidebar.tsx
DetailView/DetailViewContent.tsx
DocumentsRail.tsx
CommentsRail.tsx
```

Validar scroll por panel y ausencia de overflow horizontal.

---

## Fase 2 — Toolbar global y Guardar

Archivos:

```txt
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/UnitPager.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
```

Tareas:

```txt
[ ] Crear topbar de stage en tres columnas.
[ ] Sacar Guardar del área del RightSidebar.
[ ] Mover acciones globales al menú del stage.
[ ] Mostrar estado de persistencia.
[ ] Mantener testId/aria-label/action registry.
```

---

## Fase 3 — RightSidebar visual

### 3A Switcher/header

- tabs legibles;
- dos filas cuando sea necesario;
- collapse simétrico;
- acciones locales.

### 3B ListView

- owner accent;
- selected state separado;
- delete contextual;
- densidades.

### 3C Documents

- jerarquía documento/página;
- cards compactas;
- upload no recortado;
- delete dentro de fila.

### 3D Detail

- cards compactas;
- dropdown unificado;
- grid adaptable;
- secciones progresivas.

---

## Fase 4 — LeftSidebar, Canvas toolbar y rails

```txt
[ ] Reducir borde azul permanente.
[ ] Quitar superficies anidadas.
[ ] Rediseñar favorite.
[ ] Clampear toolbar contextual.
[ ] Unificar SidebarRail.
[ ] Mantener centro visual del PDF.
```

---

## Fase 5 — QA y pruebas

Orden:

```txt
1. unitarios de helpers y contratos;
2. components de sidebars;
3. interaction/modal/focus;
4. canvas transform;
5. owner color;
6. visual snapshots;
7. barrido completo.
```

Specs focales:

```bash
npx playwright test \
  tests/playwright/right-sidebar-visual-polish.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  tests/playwright/list-view-regression.spec.ts \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/sidebar-rail-collapse-actions.spec.ts \
  tests/playwright/sidebar-collapse-parity.spec.ts \
  --project=chromium
```

Agregar o estabilizar:

```txt
right-sidebar-detail-scroll.spec.ts
save-toolbar-no-overlap.spec.ts
right-sidebar-popover-boundaries.spec.ts
documents-rail-document-page-hierarchy.spec.ts
detail-dropdown-focus-return.spec.ts
```

---

## 8. Criterios de aceptación finales

### Funcional

```txt
[ ] DetailView llega hasta la última sección.
[ ] List, Detail, Comments y Docs tienen scroll correcto.
[ ] Guardar nunca se solapa con tabs ni rails.
[ ] Todos los menús cierran con Escape y devuelven foco.
[ ] Reasignar conserva selección al cancelar.
[ ] Owner color coincide en Canvas, ListView y DetailHeader.
[ ] Zoom, documento, página y selección no cambian al colapsar paneles.
[ ] Ningún botón visible carece de handler real.
```

### Visual

```txt
[ ] Una sola superficie por tarjeta o control.
[ ] Sin borde azul permanente en todos los plugins.
[ ] Radios entre 10 y 14 px salvo shell principal.
[ ] Sin sombras profundas permanentes.
[ ] Delete no domina las filas.
[ ] Menús y selects comparten diseño.
[ ] Documento sigue siendo protagonista.
```

### Calidad

```txt
[ ] npm run lint:src = 0 errores / 0 warnings.
[ ] npm run lint:tests = 0 errores / 0 warnings.
[ ] npm run build = exit 0.
[ ] Vitest completo en verde.
[ ] Playwright completo en verde o fallos explícitamente clasificados.
[ ] Sin cambios de expected para ocultar regresiones.
```

### Tailwind-first

```txt
[ ] No se crea CSS global nuevo.
[ ] Skin visual vive en JSX/TSX.
[ ] runtimeStyles.ts conserva solo CSS técnico clasificado.
[ ] No se usa !important salvo integración de tercero demostrada.
[ ] No se toca geometría crítica sin spec de regresión.
```

---

## 9. Orden recomendado de task-cards

```txt
TASK-P0-001 lint hooks and compiler
TASK-P0-002 right sidebar single scroll owner
TASK-UI-001 stage topbar and save ownership
TASK-UI-002 right sidebar switcher hierarchy
TASK-UI-003 list view owner/selection density
TASK-UI-004 documents rail hierarchy
TASK-UI-005 detail view progressive inspector
TASK-UI-006 left sidebar neutral catalog skin
TASK-CANVAS-001 contextual toolbar collision
TASK-UI-007 unified rails and collapse restoration
TASK-QA-001 repair current failed specs
TASK-QA-002 visual and accessibility baseline
TASK-CSS-001 classify runtimeStyles residual CSS
```

No ejecutar estas task-cards en paralelo si comparten `RightSidebar.tsx`, `Designer/index.tsx`, `CtlBar.tsx` o `runtimeStyles.ts`.
