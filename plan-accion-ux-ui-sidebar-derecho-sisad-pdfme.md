# Plan de acción UX/UI y comportamiento — SISAD PDFME

## Objetivo

Corregir las regresiones visuales y de interacción observadas en el diseñador `multi-document-routing`, priorizando:

1. que el botón flotante de colapso del sidebar derecho **no aparezca cuando el panel está colapsado**;
2. que el rail colapsado sea la única vía visible para reabrir el panel;
3. que documentos, inspector, validaciones y asignación/bloqueo funcionen con una jerarquía clara;
4. que el canvas conserve su protagonismo sin tocar Moveable, Selecto, Paper, coordenadas, zoom ni generator.

---

# 1. Diagnóstico principal

## 1.1 Causa del botón superpuesto del sidebar derecho

En `src/sisad-pdfme/ui/components/Designer/index.tsx`, el `SidebarCollapseHandle` derecho se renderiza siempre que el sidebar no esté detached:

```tsx
{!rightSidebarDetached ? (
  <SidebarCollapseHandle
    side="right"
    expanded={sidebarOpen}
    ...
  />
) : null}
```

La condición no comprueba `sidebarOpen`. Por eso, al colapsar el panel, el botón sigue flotando sobre el rail.

Además, el CSS lo posiciona desde el `stage`:

```css
.sisad-pdfme-designer-stage > .sisad-pdfme-designer-right-sidebar-toggle-btn {
  top: 3.75rem;
  right: 0.75rem;
}
```

Cuando el panel está cerrado, el botón vuelve a `right: 0.75rem`, exactamente sobre la zona del rail. El resultado visual es la superposición observada sobre el icono de Campos/Capas.

## 1.2 Comportamiento objetivo

### Panel expandido

- Mostrar un botón de colapso integrado visualmente en el panel.
- El botón puede estar dentro del encabezado o en el borde interno del panel.
- No debe flotar sobre el canvas ni sobre los tabs.

### Panel colapsado

- No renderizar `SidebarCollapseHandle`.
- Mantener únicamente el `SidebarRail` con los modos:
  - Campos;
  - Propiedades;
  - Comentarios;
  - Documentos.
- Al pulsar cualquier icono del rail:
  1. seleccionar ese modo;
  2. abrir el sidebar;
  3. enfocar el encabezado del panel correspondiente.

El rail pasa a ser el mecanismo de reapertura. No se necesita un segundo botón de “expandir”.

---

# 2. Corrección inmediata del sidebar derecho

## Archivos

```text
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
```

## 2.1 Renderizar el handle solo cuando está abierto

Cambio mínimo en `Designer/index.tsx`:

```tsx
{!rightSidebarDetached && sidebarOpen ? (
  <SidebarCollapseHandle
    side="right"
    expanded
    presentation={rightSidebarPresentation}
    density={rightSidebarPresentation === 'overlay' ? 'compact' : 'full'}
    labelExpanded="Ocultar panel derecho"
    labelCollapsed="Mostrar panel derecho"
    onToggle={() => setSidebarOpen(false)}
    className={`${DESIGNER_CLASSNAME}right-sidebar-toggle-btn`}
  />
) : null}
```

No pasar `expanded={false}` al handle derecho. En estado cerrado no debe existir en el DOM.

## 2.2 Abrir desde el rail

El rail debe recibir un callback único:

```ts
type RightSidebarMode = 'fields' | 'detail' | 'comments' | 'docs';

const openModeFromRail = (mode: RightSidebarMode) => {
  setInternalViewMode(mode);
  onViewModeChange?.(mode);
  setSidebarOpen(true);
};
```

Cada botón del rail debe usar:

```tsx
onClick={() => openModeFromRail(item.key)}
aria-label={`Abrir ${item.label}`}
aria-controls={rootId}
aria-expanded={false}
```

## 2.3 Integrar el botón de cierre dentro del panel expandido

La opción más estable es mover el handle al `panel-switcher-wrap` o al header principal de `RightSidebar`, en lugar de posicionarlo desde el `stage`.

Diseño recomendado:

```text
[ Campos | Propiedades | Comentarios | Documentos ] [ ‹ ]
```

- botón de 28 × 28 px;
- sin posición absoluta;
- tooltip controlado;
- `aria-label="Ocultar panel derecho"`;
- no debe desplazar los tabs de forma perceptible.

Después de integrarlo, eliminar la regla global de posición del toggle derecho en el stage.

## 2.4 Dimensiones del rail

```text
Ancho: 44 px
Padding superior: 8 px
Botón: 32 × 32 px
Separación: 6 px
Radio: 10–12 px
Indicador activo: borde izquierdo o fondo tonal suave
```

No usar pills verticales grandes. No colocar sombras fuertes en cada botón.

---

# 3. Panel de documentos

## Problemas observados

- El título dice “Selecciona una página”, pero la lista representa documentos.
- El contador `2` aparece separado y sin contexto.
- El botón `Subir` queda apretado o parcialmente cortado.
- La acción eliminar está visualmente separada de la tarjeta activa.
- La tarjeta activa tiene demasiado fondo y altura.
- Documento y página se mezclan en la misma jerarquía.

## Comportamiento objetivo

### Header

```text
Documentos                         [Subir]
2 documentos
```

No usar “Selecciona una página” si la lista principal es documental.

### Ítem

```text
[icono] Declaración de datos        [⋮]
        14 páginas · Página 1 activa
```

El menú `⋮` debe contener:

- Cambiar nombre, si aplica.
- Reemplazar PDF.
- Eliminar documento.

No mostrar un botón rojo de papelera flotando fuera de la tarjeta.

### Selección

- Un clic cambia el documento activo.
- No cambiar zoom de manera automática.
- No restablecer el scroll del canvas salvo que cambie de página/documento.
- La selección activa debe tener un acento del color del usuario, no un gran bloque azul.

## Archivos

```text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
```

---

# 4. DetailView e inspector

## 4.1 Anchura real y diseño responsive

Las métricas actuales sitúan el sidebar derecho alrededor de 276 px. El inspector debe diseñarse para esa anchura, no para 340–400 px.

### Reglas

- Usar `minmax(0, 1fr)` en todas las columnas.
- Cada input debe tener `min-width: 0`.
- No permitir que labels reduzcan el ancho útil del input.
- Evitar grids fijos que fuercen tres campos en una sola fila.

## 4.2 Ubicación y tamaño

Distribución objetivo:

```text
Alineación
[8 botones en grid 4 × 2]

X                  Y
[input]            [input]

Ancho              Alto
[input]            [input]

Rotación
[input ancho completo]
```

Los valores no pueden verse cortados como `9?` o `1?`.

Usar `InputNumber` con:

- ancho 100%;
- mínimo 0;
- step correcto;
- validación visible;
- no cambiar valor con rueda del mouse si el control no tiene foco.

## 4.3 Formato

Dividir internamente:

```text
TIPOGRAFÍA
Fuente | Tamaño

ESTILO
Negrita | Cursiva | Subrayado

ALINEACIÓN
Horizontal
Vertical

ESPACIADO
Altura de línea | Espaciado

COLORES
Texto | Fondo
```

No presentar los nueve botones como una matriz sin subtítulos.

Ocultar propiedades no aplicables al tipo de schema. Por ejemplo, un action schema no necesita toda la configuración tipográfica de un campo de texto.

## 4.4 Perfiles de expansión

Para `select`:

- `identity`: abierto;
- `options`: abierto;
- `validation`: cerrado;
- `interaction`: cerrado;
- `box`: cerrado;
- `appearance`: cerrado;
- `collaboration`: cerrado;
- `advanced`: oculto o cerrado.

Solo una o dos secciones abiertas por defecto. Abrir varias secciones produce un panel excesivamente largo.

## Archivos

```text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDetailProfiles.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorNumberInput.tsx
```

---

# 5. Dropdown de validación

## Problemas

- El popup ocupa demasiada altura.
- Cubre las secciones siguientes.
- Las opciones son demasiado grandes.
- No aprovecha el espacio lateral disponible.

## Solución

En `InspectorSelect.tsx`:

- portal al `document.body`;
- `popupClassName="sisad-inspector-select-popup"`;
- `listHeight={224}`;
- placement dinámico o `bottomRight` para el sidebar derecho;
- ancho mínimo 220 px y máximo 280 px;
- altura de fila 32–36 px;
- scroll interno cuando existan más opciones;
- cierre con Escape;
- devolver foco al trigger.

CSS:

```css
.sisad-inspector-select-popup {
  min-width: 220px;
  max-width: min(280px, calc(100vw - 24px));
}

.sisad-inspector-select-popup .ant-select-item {
  min-height: 34px;
  padding: 6px 10px;
}
```

No resolverlo aumentando z-index de forma arbitraria.

---

# 6. Editor de opciones

## Problemas

- Las acciones de mover/eliminar tienen poco contraste.
- El indicador de valor predeterminado no es suficientemente claro.
- El input y botón “Agregar” quedan apretados.
- Reordenar con flechas genera demasiados controles repetidos.

## Diseño objetivo

```text
☰  Pendiente                         ● Predeterminado  ⋮
☰  Aprobado                                             ⋮
☰  Rechazado                                            ⋮

[Nueva opción…                         ] [Agregar]
```

- usar drag handle para reordenar;
- menú `⋮` para eliminar o duplicar;
- radio/check explícito para valor predeterminado;
- Enter agrega opción;
- Escape limpia el input;
- impedir nombres vacíos o duplicados según política;
- conservar `optionId` al renombrar o reordenar;
- ningún evento debe propagarse al canvas o crear otro schema.

## Archivos

```text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx
src/sisad-pdfme/schemas/options/optionModel.ts
src/sisad-pdfme/schemas/options/optionValueAdapter.ts
```

---

# 7. Asignación y bloqueo

## Problemas críticos

- El panel muestra “Bloqueado para edición”, mientras el modal muestra “Bloqueado” y la tarjeta inferior puede indicar “En edición por ti”.
- Se expone `recipient-1` en lugar del nombre visible.
- El propietario aparece también como co-propietario.
- “Avanzado” se abre por defecto y domina el modal.
- Se muestran timestamps epoch sin formato.
- `Bloqueado por` se representa como input, aunque debería ser informativo.
- El modal no prioriza las acciones Guardar/Cancelar.

## Modelo de estado único

Crear o consolidar:

```ts
type SchemaAccessState = {
  collaborationLock: 'none' | 'mine' | 'other';
  objectLocked: boolean;
  readOnly: boolean;
  canEdit: boolean;
  canMove: boolean;
  canDelete: boolean;
  lockOwnerId: string | null;
  lockOwnerLabel: string | null;
  statusLabel: string;
  statusTone: 'neutral' | 'info' | 'warning' | 'danger';
};
```

Usar el mismo resolver en:

- canvas chrome;
- DetailHeader;
- ListView;
- SchemaCollaborationWidget;
- toolbar contextual;
- menú contextual.

## Modal objetivo

```text
Gestionar asignación y acceso

Estado
[ En edición por ti ]

Propietario
[ Cliente Principal · Firmante ]

Co-propietarios
[ Seleccionar participantes… ]

Bloqueo
Bloqueado por Cliente Principal
Desde 12 jul 2026, 10:02

Opciones técnicas ▸

Cancelar                         Guardar cambios
```

### Reglas

- Excluir al propietario principal de `coOwners`.
- Resolver todos los IDs con `recipientNameMap`/usuarios.
- `Avanzado` cerrado por defecto.
- Ocultar datos técnicos en producción salvo `developerMode`.
- Formatear fechas con `Intl.DateTimeFormat`.
- Modal con `max-height: 80dvh`.
- Body con scroll interno.
- Footer sticky siempre visible.
- No permitir guardar un owner dentro de co-owners duplicado.

## Archivos

```text
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
src/sisad-pdfme/collaboration/lockManager.ts
src/sisad-pdfme/collaboration/schemaLockGuard.ts
```

---

# 8. Canvas y overlays

## Problemas observados

- La toolbar contextual puede cubrir un schema vecino.
- El tooltip técnico `contract_stage` aparece mientras ya existe el label inferior del schema.
- La medición, toolbar, tooltip y selección se muestran simultáneamente.
- `Resultados` y zoom compiten en la parte inferior.

## Acciones

1. Mantener la geometría existente de overlays.
2. Aplicar una política visual:
   - toolbar al seleccionar;
   - métrica solo durante resize/move o hover breve;
   - tooltip técnico solo cuando no esté abierta la toolbar;
   - inline edit únicamente durante edición.
3. Reducir la toolbar a:

```text
Eliminar | Duplicar | Más
```

4. Cerrar toolbar al hacer click fuera o pulsar Escape.
5. Convertir `Resultados` en un elemento de status bar o separarlo al menos 8–12 px del zoom.

No modificar:

```text
Canvas.tsx
Moveable.tsx
Selecto.tsx
Paper.tsx
coordinateMath.ts
designerCoordinateService.ts
```

Los ajustes deben limitarse a skins, políticas de visibilidad y composición de overlays existentes.

---

# 9. Orden de implementación

## P0 — Regresiones funcionales y de confianza

1. Ocultar el `SidebarCollapseHandle` derecho cuando `sidebarOpen === false`.
2. Reabrir el panel únicamente desde los iconos del rail.
3. Mover el botón de cierre al encabezado del panel expandido.
4. Unificar estados de bloqueo y nombres de usuario.
5. Cerrar “Avanzado” por defecto en asignación/bloqueo.
6. Evitar propietario duplicado en co-propietarios.
7. Corregir inputs numéricos cortados del inspector.
8. Limitar y portar el popup de validación.

## P1 — Jerarquía y densidad

1. Rediseñar `DocumentsRail`.
2. Ajustar perfiles de secciones del inspector.
3. Reorganizar Formato por subgrupos.
4. Simplificar editor de opciones.
5. Reducir superficies anidadas y sombras.
6. Mejorar estados hover/focus/active del rail.

## P2 — Comportamiento fino

1. Preservar scroll y zoom al abrir/cerrar paneles.
2. En overlay, Escape cierra el panel.
3. El modo seleccionado del rail se conserva al reabrir.
4. Restaurar foco al botón que abrió el panel.
5. Cerrar popups cuando cambia schema/documento.
6. Evitar overlays simultáneos innecesarios.

---

# 10. Pruebas obligatorias

## `tests/e2e/sidebar-collapse-parity.spec.ts`

```text
- panel derecho abierto: existe botón Ocultar panel derecho;
- panel derecho cerrado: NO existe right-sidebar-toggle-btn;
- panel cerrado: existe rail con 4 modos;
- click Campos abre panel en fields;
- click Propiedades abre panel en detail;
- click Comentarios abre panel en comments;
- click Documentos abre panel en docs;
- rail no tiene botones superpuestos;
- aria-expanded y aria-controls correctos;
- navegación completa con teclado;
- no hay overflow horizontal.
```

## `tests/e2e/inspector-detailview-profiles.spec.ts`

```text
- select abre identity y options solamente;
- validation popup cabe en viewport;
- X/Y/ancho/alto/rotación no se cortan;
- no existen secciones vacías;
- formato solo muestra propiedades aplicables.
```

## `tests/e2e/schema-lock-state-consistency.spec.ts`

```text
- lock mío => “En edición por ti” en header, modal, lista y menú;
- lock ajeno => “Bloqueado por <nombre>”;
- ningún ID técnico visible fuera de developerMode;
- owner no aparece duplicado como co-owner;
- advanced cerrado por defecto;
- Guardar/Cancelar siempre visibles.
```

## `tests/e2e/documents-rail.spec.ts`

```text
- muestra conteo correcto de documentos;
- seleccionar documento cambia el activo;
- subir PDF no queda cortado;
- eliminar está dentro del menú del ítem;
- no confunde documento con página;
- mantiene zoom al cambiar de tab del sidebar.
```

## Comandos

```bash
npm run build
npm run lint
npx playwright test tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium
npx playwright test tests/e2e/inspector-detailview-profiles.spec.ts --project=chromium
npx playwright test tests/e2e/schema-lock-state-consistency.spec.ts --project=chromium
npx playwright test tests/e2e/documents-rail.spec.ts --project=chromium
```

---

# 11. Criterios de aceptación

```text
[ ] El botón flotante derecho no existe cuando el sidebar está colapsado.
[ ] El rail es la única vía visible para reabrir el sidebar.
[ ] El botón de cierre no tapa tabs, Guardar ni iconos del rail.
[ ] Los cuatro iconos del rail son accesibles y abren su modo correspondiente.
[ ] El panel de documentos distingue documento y página.
[ ] El botón Subir nunca queda cortado.
[ ] X/Y/ancho/alto/rotación se leen completos a 276 px.
[ ] El popup de validación no cubre todo el inspector.
[ ] El editor de opciones conserva optionId y no crea schemas accidentales.
[ ] No se muestran IDs como recipient-1 al usuario final.
[ ] El propietario no aparece duplicado como co-propietario.
[ ] El estado de bloqueo coincide en canvas, inspector, lista y modal.
[ ] Avanzado está cerrado por defecto y los timestamps están formateados.
[ ] Guardar y Cancelar permanecen visibles en el modal.
[ ] Abrir/cerrar paneles no cambia zoom ni selección.
[ ] No se modifican Moveable, Selecto, Paper, SnapshotAdapter, Generator ni pdf-lib.
```

---

# 12. Nota sobre los archivos de contexto

El archivo nombrado como backend continúa apuntando a la carpeta `prueba-plugin` y no contiene controladores, servicios o entidades C#. Este plan está basado en el frontend React/TypeScript, estilos y documentación de SISAD PDFME. Para analizar persistencia o contratos backend del Dynamic Builder se debe regenerar el paquete C# desde la carpeta correcta.
