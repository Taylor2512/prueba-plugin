# Plan integral de mejoras — SISAD PDFME Designer DetailView, Canvas, Sidebars y UX tipo Wix

**Fecha:** 2026-07-13  
**Ruta de validación:** `http://localhost:5174/lab/multi-document-routing`  
**Archivos base analizados:**

- `codigo-frontend-sisad—pdmfe(14).md`
- `documentacion-sisad—pdmfe-web(4).md`
- `styles-sisad—pdmfe(14).md`
- capturas del diseñador, RightSidebar ListView, DetailView, secciones `Opciones`, `Reglas de llenado`, `Formato`, `Asignación y bloqueo`, `Ubicación y tamaño`

---

## 1. Diagnóstico ejecutivo

El diseñador ya tiene una base fuerte: catálogo izquierdo, canvas con selección, panel derecho con lista/detalle/documentos/comentarios, perfiles por schema, widgets de inspector, owner color, collapse handle compartido y una arquitectura de task-cards. El problema actual está en la **conexión completa entre lo visual y lo funcional**.

La prioridad no debe ser “decorar” el RightSidebar, sino asegurar que cada control visible tenga un contrato real:

```txt
Control visible
→ propiedad real del schema
→ widget correcto
→ onChange conectado
→ CommandBus / update centralizado
→ access state respetado
→ snapshot roundtrip
→ Form/Viewer/PDF compatible si aplica
→ test unitario/E2E
```

Problemas principales detectados en las capturas:

1. **RightSidebar ListView:** visualmente todos los campos parecen seleccionados por la barra azul. Debe reservarse la barra/accent azul para selección real o estado activo.
2. **DetailHeader:** el chip “Bloqueado para edición” aparece demasiado agresivo y puede no coincidir con el estado real del canvas/lista.
3. **Información del campo:** existe input `Nombre del campo` y botón `Renombrar campo`, duplicando intención.
4. **Opciones:** la sección ya es útil, pero necesita reordenamiento más claro, drag handle y validación de opción vacía/duplicada.
5. **Reglas de llenado:** el `Select` de validación aparece sin ancho/placeholder útil; debe ocupar todo el ancho y mostrar opciones proporcionales al schema.
6. **Formato:** los inputs de opacidad, fuente, tamaño, espaciado, altura de línea, colores y botones de formato están desbalanceados. Algunos controles no tienen ancho suficiente o están en una grilla incompatible con un sidebar estrecho.
7. **Ubicación y tamaño:** `X`, `Y`, `Ancho`, `Alto`, `Rotación` se cortan por columnas pequeñas. La grilla no debe usar 3 columnas fijas en un panel estrecho.
8. **Asignación y bloqueo:** repite título, estado y chips; debe mostrar un resumen colaborativo compacto y conectar acciones reales de lock/unlock/assign.
9. **Resultados:** sigue flotando cerca del zoom/canvas; debe moverse a barra inferior o drawer.
10. **Wix-like UX:** falta una estrategia de inspector progresivo: primero controles frecuentes, luego avanzado, con paneles que responden al contexto y no todo abierto como formulario pesado.

---

## 2. Principios obligatorios para la siguiente pasada

### 2.1. No tocar en esta pasada

```txt
src/sisad-pdfme/pdf-lib/**
src/sisad-pdfme/generator/**
src/sisad-pdfme/shared/snapshotAdapter.ts
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
StepOne / StepTwo host / ContentCustomForm negocio / Uanataca
```

Solo se toca Canvas si una función visible del inspector depende de selección o focus y no hay otra vía. La geometría visual se corrige desde widgets, layout y command/update, no con hacks de z-index.

### 2.2. No más CSS disperso

Toda corrección visual debe ir en:

```txt
src/styles/sisad-tailwind-bridge.css
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/sisad-pdfme/ui/styles/tokens.css
```

o directamente en `className` Tailwind del componente, si el cambio pertenece al componente y no a reglas legacy.

### 2.3. Cada componente visual debe tener funcionamiento real

No mostrar controles que no persisten. Ejemplo:

```txt
Si Formato muestra fontName → debe leer/escribir schema.fontName.
Si Formato muestra opacity → debe leer/escribir schema.opacity y renderizarlo.
Si Reglas muestra validation → debe persistir schema.validation.
Si Ubicación muestra x/y/width/height → debe actualizar schema con CommandBus/update central.
Si Bloqueo muestra Gestionar → debe abrir modal o ejecutar action real.
```

---

## 3. Investigación Wix aplicada al diseñador SISAD PDFME

Wix Studio usa un inspector contextual para editar propiedades de elementos, secciones y páginas, incluyendo resizing por breakpoint, diseño, interacciones y contenido/CMS. Para SISAD PDFME, esto se traduce en un `DetailView` por perfiles: cada schema muestra solo propiedades aplicables y un modo avanzado colapsado.

Ideas Wix que sí conviene adoptar:

1. **Inspector progresivo:** mostrar primero diseño, contenido, layout y comportamiento frecuente; ocultar técnico.
2. **Breakpoints / responsive mental model:** aunque PDF no sea responsive como web, sí se puede usar la idea de “contexto activo”: documento, página, destinatario y modo runtime.
3. **Layers panel:** RightSidebar ListView debe funcionar como panel de capas: jerarquía, selección difícil en canvas, localizar elemento, ordenar, bloquear.
4. **Align/distribute/match size:** debe funcionar solo con selección múltiple y comunicar cuándo está deshabilitado.
5. **CMS/dynamic pages:** para SISAD, esto inspira `dataBindings`: fieldKey, dataLabel, JSON path, datos conectados y repetición de campos por plantilla.
6. **Responsive AI / auto layout:** no copiar IA, pero sí crear sugerencias automáticas: “ajustar ancho”, “alinear al campo anterior”, “distribuir campos seleccionados”, “normalizar tamaños”.
7. **Stacks / spacing directo:** para grupos de opciones, permitir editar spacing/orientation desde inspector y con + en canvas.

---

## 4. Plan por fases

## Fase 0 — Auditoría focalizada antes de modificar

Crear reporte:

```bash
mkdir -p reports/detailview-functional-audit

rg "InspectorNumberInput|InspectorColorInput|InspectorSelect|InspectorSwitch|InspectorField|DetailSectionCard|DetailFormSection|AlignWidget|ButtonGroupWidget|detailWidgetRegistry|detailSchemas|schemaDetailProfiles|WidgetRenderer" src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView > reports/detailview-functional-audit/inspector-widgets.txt

rg "opacity|fontName|fontSize|characterSpacing|lineHeight|textColor|backgroundColor|bgColor|x:|y:|width|height|rotation|rotate|readOnly|readonly|locked|required|validation|dataLabel|tooltip" src/sisad-pdfme > reports/detailview-functional-audit/schema-properties.txt

rg "onChange|updateSchema|setSchema|commandBus|executeCommand|selectionCommands|bulk|patch|fieldName|commit" src/sisad-pdfme/ui/components/Designer/RightSidebar src/sisad-pdfme/ui/commands src/sisad-pdfme/ui/components/Designer/shared > reports/detailview-functional-audit/update-paths.txt

rg "Resultados|Colapsado|bottom: 12|z-index: 70|lab-results|results" src reports tests > reports/detailview-functional-audit/results-panel.txt
```

Criterio de cierre:

```txt
[ ] Listar controles visibles del DetailView.
[ ] Mapear cada control a propiedad real.
[ ] Mapear cada propiedad a update path.
[ ] Marcar controles visibles sin persistencia.
[ ] Marcar funciones existentes no usadas.
```

---

## Fase 1 — Crear contrato `InspectorWidgetContract`

### Objetivo

Conectar visual + funcionalidad + persistencia en una sola definición.

### Archivos

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx
```

### Contrato recomendado

```ts
export type InspectorWidgetContract = {
  id: string;
  section: InspectorSectionKey;
  label: string;
  description?: string;
  propertyPath: string;
  widget: 'text' | 'number' | 'select' | 'switch' | 'color' | 'buttonGroup' | 'align' | 'optionEditor' | 'definitionList' | 'custom';
  read: (schema: SchemaForUI, context: InspectorContext) => unknown;
  write: (value: unknown, schema: SchemaForUI, context: InspectorContext) => SchemaPatch | DesignerCommand;
  visibleWhen?: (schema: SchemaForUI, context: InspectorContext) => boolean;
  disabledWhen?: (schema: SchemaForUI, context: InspectorContext) => boolean;
  validate?: (value: unknown, schema: SchemaForUI, context: InspectorContext) => string | null;
  layout?: {
    colSpan?: 1 | 2 | 3 | 'full';
    minWidth?: number;
    compact?: boolean;
  };
};
```

### Reglas

- No usar widgets que solo pintan UI sin `write`.
- No mutar schema directo dentro del widget.
- No meter lógica de tipo de schema en el JSX final; usar `visibleWhen` y perfil.

---

## Fase 2 — Layout adaptativo para `Ubicación y tamaño`

### Problema visual

En las capturas, `Ancho`, `Alto` y `Rotación` quedan cortados. El layout actual intenta meter demasiadas columnas en un panel estrecho.

### Cambio requerido

Crear componente:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/GeometryFields.tsx
```

### Diseño objetivo

Para panel `< 360px`:

```txt
Alineación
[8 botones en 4x2]

Posición
[X mm] [Y mm]

Tamaño
[Ancho mm] [Alto mm]

Rotación
[Rotación °]  ancho completo
```

Para panel `>= 360px`:

```txt
X | Y
Ancho | Alto
Rotación full
```

### Implementación Tailwind

```tsx
<div className="grid grid-cols-2 gap-2" data-inspector-grid="geometry">
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="X mm" />
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="Y mm" />
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="Ancho mm" />
  <InspectorNumberInput className="min-w-0" inputClassName="w-full min-w-[96px]" label="Alto mm" />
  <InspectorNumberInput className="col-span-2 min-w-0" inputClassName="w-full" label="Rotación" />
</div>
```

### Cambiar `InspectorNumberInput`

El componente debe aceptar:

```ts
inputClassName?: string;
suffix?: string;
precision?: number;
controls?: boolean;
fullWidth?: boolean;
```

Y renderizar:

```tsx
<label className={mergeClassNames('flex min-w-0 flex-col gap-1 text-[11px] text-slate-600', className)}>
  <span className="truncate font-semibold">{label}</span>
  <InputNumber
    className={mergeClassNames('w-full min-w-0', inputClassName)}
    controls={controls ?? false}
    suffix={suffix}
  />
</label>
```

### Tests

```txt
[ ] X/Y/Ancho/Alto/Rotación no se cortan en panel 320px.
[ ] Rotación ocupa ancho completo.
[ ] Cambiar X/Y actualiza canvas.
[ ] Cambiar width/height actualiza canvas.
[ ] Campos readonly se ven deshabilitados.
```

---

## Fase 3 — Layout adaptativo para `Formato`

### Problema visual

La sección `Formato` mezcla entradas numéricas, select de fuente, botones de formato, color pickers e inputs HEX en una grilla que no cabe bien.

### Nuevo componente

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/AppearanceFields.tsx
```

### Distribución objetivo

```txt
Opacidad            Fuente
[ 100% slider/input ][Roboto ▼]

Tamaño              Espaciado
[13]                [0]

Formato
[B] [I] [U] [Alineación horizontal]
[Alineación vertical]

Color del texto
[swatch] [#000000] [pipeta/restablecer]

Color del fondo
[swatch] [Heredar / #FFFFFF] [reset]
```

### Cambios funcionales

1. `opacity` debe mostrarse como porcentaje, no `1.0`.
2. `fontName` debe ocupar ancho completo si el panel es estrecho.
3. `fontSize`, `spacing`, `lineHeight` deben usar números compactos, pero no menores a `80px`.
4. `dynamicFontSize` debe ser un switch claro, no checkbox pequeño perdido.
5. Colores deben usar componente único `ColorField`.
6. No mostrar `Formato` en schemas que no soportan propiedades visuales.

### Crear `ColorField`

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/ColorField.tsx
```

Props:

```ts
type ColorFieldProps = {
  label: string;
  value?: string;
  inheritedValue?: string;
  inheritLabel?: string;
  allowInherit?: boolean;
  onChange: (value: string | null, mode?: 'custom' | 'inherit') => void;
  disabled?: boolean;
};
```

Estados:

```txt
- Heredar color del destinatario.
- Usar color personalizado.
- Restablecer.
- Validar HEX.
```

---

## Fase 4 — Conectar AlignWidget y ButtonGroupWidget a comandos reales

### Problema

Los botones de alineación se ven, pero deben comunicar cuándo están deshabilitados y ejecutar comandos reales.

### Archivos

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/commands/designerCommands.ts
src/sisad-pdfme/ui/commands/commandBus.ts
```

### Contrato

```ts
type InspectorAction = {
  id: string;
  label: string;
  icon: ReactNode;
  requiresSelection?: 'single' | 'multi';
  disabledReason?: string;
  execute: (context: InspectorContext) => void;
};
```

### Reglas

- Alinear izquierda/centro/derecha puede funcionar con 1 o N campos.
- Distribuir horizontal/vertical requiere N >= 3.
- Igualar ancho/alto requiere N >= 2.
- Si hay campos bloqueados o readonly, excluirlos o deshabilitar con tooltip.

---

## Fase 5 — Unificar estado real de bloqueo/readonly

### Problema observado

En la captura `contract_stage` aparece “Bloqueado para edición”. Ese estado debe coincidir con canvas, ListView, toolbar flotante y acciones.

### Archivos

```txt
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx
```

### Crear/fortalecer resolver

```ts
export type SchemaAccessViewModel = {
  selectable: boolean;
  inspectable: boolean;
  editable: boolean;
  movable: boolean;
  resizable: boolean;
  deletable: boolean;
  duplicable: boolean;
  lockState: 'unlocked' | 'locked-by-me' | 'locked-by-other';
  readonlyState: 'editable' | 'readonly' | 'runtime-readonly';
  label: string;
  reason?: string;
};
```

### Resultado esperado

```txt
Si DetailView dice bloqueado:
- Canvas no permite drag/resize.
- Toolbar no permite eliminar/duplicar si política lo bloquea.
- ListView muestra el mismo candado.
- Inputs se deshabilitan.
```

---

## Fase 6 — Inspector por perfil de schema

### Usar secciones oficiales

```txt
identity        Información del campo
content         Contenido
options         Opciones
validation      Reglas de llenado
fileRules       Reglas del archivo
signature       Firma
action          Acción
behavior        Interacción
box             Ubicación y tamaño
appearance      Formato
dataBindings    Datos y conexiones
comments        Comentarios
collaboration   Asignación y acceso
advanced        Técnico
```

### Matriz por tipo

| Schema | Secciones visibles |
|---|---|
| text | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced |
| number | identity, content, validation, numberFormat, behavior, box, appearance, dataBindings, collaboration, advanced |
| select | identity, options, validation, behavior, box, appearance, dataBindings, collaboration, advanced |
| checkbox | identity, validation, behavior, box, appearance, collaboration, advanced |
| checkboxGroup | identity, options, validation, behavior, box, appearance, collaboration, advanced |
| radioGroup | identity, options, validation, behavior, box, appearance, collaboration, advanced |
| signature | identity, signature, behavior, box, collaboration, advanced |
| dateSigned | identity, signature, box, appearance, collaboration, advanced |
| attachment | identity, fileRules, validation, behavior, box, appearance, collaboration, advanced |
| approve/decline | identity, action, validation, behavior, box, appearance, collaboration, advanced |
| note | identity, content, behavior, box, appearance, collaboration, advanced |
| image/svg/barcode | identity, content/source, box, appearance, dataBindings, advanced |
| line/rect/ellipse/table | identity, structure, box, appearance, advanced |

### Regla

No renderizar sección sin widgets visibles. No mostrar `Opciones` en `approve`, `decline`, `attachment`, `signature`, `image`. No mostrar `Formato` si el schema no consume esas propiedades.

---

## Fase 7 — Conectar funciones existentes no utilizadas

### Candidatos ya existentes a integrar

```txt
selectionPolicy.ts
interactionTargetResolver.ts
schemaInteractionState.ts
schemaInteractionCapabilities.ts
actionRegistry.ts
commandBus.ts
designerCommands.ts
schemaTone.ts
recipientColor.ts
SchemaOptionsEditor.tsx
InspectorOptionEditor.tsx
SidebarCollapseHandle.tsx
SidebarRail.tsx
CatalogLayoutToggle.tsx
```

### Integración esperada

1. `detailWidgetRegistry` debe renderizar widgets desde contratos, no desde `switch` disperso.
2. `SchemaOptionsEditor` debe ser el editor único para `select`, `radioGroup`, `checkboxGroup`.
3. `InspectorOptionEditor.tsx` no debe ser solo re-export si se requieren props normalizadas; debe actuar como adapter mínimo.
4. `actionRegistry` debe alimentar `AlignWidget`, toolbar contextual y menús de lista/canvas.
5. `schemaInteractionState` debe alimentar DetailHeader, inputs disabled y ListView.
6. `schemaTone` debe alimentar DetailHeader, ListView, field chrome y PluginIcon.

---

## Fase 8 — Mejorar RightSidebar ListView como panel de capas

### Problema

La barra azul izquierda aparece en todas las tarjetas, por lo que deja de indicar selección.

### Cambios

- Estado normal: sin barra azul; borde gris suave.
- Hover: fondo suave.
- Seleccionado: barra azul + fondo azul claro.
- Locked: candado y chip; no barra roja.
- Owner color: punto o borde sutil, no confundirlo con selección.

### Fila recomendada

```txt
[drag] [icono] Nombre visible               [estado]
              Tipo · Destinatario · Pág. N
```

Acciones por fila:

```txt
Localizar en documento
Abrir propiedades
Renombrar
Duplicar
Cambiar destinatario
Bloquear/desbloquear
Eliminar
```

---

## Fase 9 — Reubicar `Resultados`

### Problema

La píldora `Resultados · Vacío` queda cerca del zoom y canvas.

### Cambio recomendado

En lab:

```txt
Barra inferior: Resultados 0 · Sin errores · Última validación OK
```

En producción:

```txt
Drawer inferior solo si hay warning/error.
```

Archivos:

```txt
src/features/pdfcomponent/ResultsPanel.jsx
src/features/pdfcomponent/PdfmeLabPage.jsx
src/features/pdfcomponent/labRoutes.css
src/styles/sisad-tailwind-bridge.css
```

---

## Fase 10 — Tests obligatorios

```txt
tests/e2e/inspector-geometry-layout.spec.ts
tests/e2e/inspector-format-layout.spec.ts
tests/e2e/inspector-widget-persistence.spec.ts
tests/e2e/inspector-access-sync.spec.ts
tests/e2e/listview-layer-panel.spec.ts
tests/e2e/results-panel-placement.spec.ts
tests/e2e/wix-like-inspector-progressive.spec.ts
```

Casos mínimos:

```txt
[ ] X/Y/Ancho/Alto/Rotación no se cortan.
[ ] Cambiar X actualiza canvas.
[ ] Cambiar ancho actualiza canvas.
[ ] Opacity 80% persiste como 0.8.
[ ] Color text/background persiste y renderiza.
[ ] Select options agregar/eliminar/reordenar persiste.
[ ] Sección Opciones no aparece en approve/decline.
[ ] Campos bloqueados deshabilitan inputs.
[ ] ListView selecciona y localiza schema.
[ ] Resultados no tapa zoom ni sidebar.
```

---

## 5. Prompt listo para Codex

```txt
Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind, pdfme, editores tipo Wix/Figma/DocuSign, inspectors schema-driven, CommandBus, SOLID y Playwright.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Ruta de validación:
http://localhost:5174/lab/multi-document-routing

Objetivo de esta pasada:
Mejorar el RightSidebar DetailView y conectar cada control visible con funcionamiento real. En especial corregir las secciones Formato y Ubicación y tamaño, cuyos inputs se cortan o no tienen ancho suficiente, y asegurar que cada widget visible persista su valor en el schema por la vía correcta.

No tocar:
- pdf-lib
- generator
- SnapshotAdapter
- Moveable
- Selecto
- StepOne / StepTwo host / ContentCustomForm negocio / Uanataca
- geometría global del canvas salvo consumo de comandos existentes

Primero audita:
1. widgets del DetailView;
2. propiedades visibles vs propiedades persistidas;
3. funciones existentes no conectadas;
4. estilos que cortan inputs;
5. tests existentes.

Archivos candidatos:
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorNumberInput.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorColorInput.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSelect.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSwitch.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx
- src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
- src/sisad-pdfme/ui/commands/commandBus.ts
- src/sisad-pdfme/ui/commands/designerCommands.ts
- src/styles/sisad-tailwind-bridge.css
- src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css

Implementa:
1. InspectorNumberInput con inputClassName, suffix, precision, controls=false, min-width seguro.
2. GeometryFields para Ubicación y tamaño con layout 2 columnas + rotación full width.
3. AppearanceFields para Formato con layout progresivo.
4. ColorField único para color texto/fondo con herencia de owner color.
5. AlignWidget conectado a actionRegistry/CommandBus, con disabledReason.
6. shouldRenderDetailSection para ocultar secciones vacías.
7. access state unificado para bloquear inputs si schema está locked/readonly.
8. ListView como layer panel: barra azul solo en selected.
9. ResultsPanel reubicado fuera de canvas/zoom.

No uses setTimeout, z-index arbitrario ni !important nuevo.
No muestres controles sin persistencia.
No agregues `as any` nuevo.

Entrega:
- diagnóstico corto;
- archivos modificados;
- funciones conectadas;
- funciones eliminadas/no usadas;
- tests ejecutados;
- riesgos pendientes.
```

---

## 6. Criterios de aceptación global

```txt
[ ] Cada control visible tiene propiedad real.
[ ] Cada propiedad visible persiste en schema.
[ ] Cada update pasa por vía centralizada.
[ ] Formato no corta inputs ni colores.
[ ] Ubicación y tamaño no corta X/Y/Ancho/Alto/Rotación.
[ ] Align/distribute funciona o muestra disabled reason.
[ ] Estado locked/readonly coincide en canvas, ListView y DetailView.
[ ] ListView funciona como panel de capas.
[ ] Resultados no tapa canvas/zoom/sidebars.
[ ] Secciones por schema son proporcionales.
[ ] Build, lint y E2E críticos pasan.
```
