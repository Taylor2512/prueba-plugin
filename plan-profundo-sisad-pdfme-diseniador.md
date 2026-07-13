# Plan profundo de estabilización y refactor del diseñador SISAD PDFME

**Fecha:** 2026-07-12  
**Proyecto:** `prueba-plugin / sisad-pdfme`  
**Ruta funcional de referencia:** `http://localhost:5174/lab/multi-document-routing`  
**Objetivo:** recuperar comportamiento funcional completo del diseñador, reducir duplicidad, compactar UI con Tailwind y dejar una arquitectura genérica, autoconfigurable y mantenible.

---

## 0. Resumen ejecutivo

El diseñador está en un punto donde las mejoras visuales ya no pueden tratarse como CSS aislado. Los problemas actuales —selección simple/múltiple rota, schemas que nacen bloqueados o readonly, estados desincronizados entre canvas e inspector, sidebars inconsistentes, propagación parcial de owner color, comportamiento desigual entre schemas, duplicidad en opciones, DetailView y comandos— indican una **fractura de contratos internos**.

La corrección debe ejecutarse en capas:

1. **Contrato de interacción:** selección, hit-testing, región, Moveable, Selecto, comandos y shortcuts.
2. **Contrato de acceso:** locked, readOnly, readonly, disabled, owner, permisos, estado colaborativo.
3. **Contrato de schema:** familias, capacidades, inspector, defaults, snapshot, Form/Viewer/Generator parity.
4. **Contrato visual:** field chrome, owner color, semantic color, density, sidebars, catalog layout, right sidebar list/detail.
5. **Contrato de ejecución para agentes:** task-cards, presupuesto de análisis, rutas permitidas, rutas prohibidas, validación y criterios de parada.

La prioridad no debe ser “hacer que se vea más bonito”, sino **hacer que cada acción tenga una única fuente de verdad**. Después de eso, la compactación visual con Tailwind será mucho más segura.

---

## 1. Investigación consolidada

### 1.1 Arquitectura real detectada

El proyecto ya está estructurado con capas fuertes:

```txt
sisad-pdfme/
├── ui/
│   ├── Designer
│   ├── Form
│   ├── Viewer
│   └── components
├── schemas/
│   ├── text-like
│   ├── option-based
│   ├── signing-based
│   ├── action-based
│   ├── media
│   └── shared
├── runtime/
├── generator/
├── shared/
├── commands/
└── styles/
```

Principio que debe respetarse:

```txt
Designer controla:
- canvas;
- sidebars;
- overlays;
- toolbar;
- selección;
- configuración.

Form/Viewer consumen el mismo modelo de schemas.
Generator usa el snapshot y los valores finales.
Host apps solo pasan datos, callbacks y adaptadores.
```

Esto implica que el host no debe reconstruir sidebars, inspector, toolbar ni renderer de schemas. El host puede elegir documento, destinatario y acciones de negocio, pero el runtime visual debe vivir dentro de `sisad-pdfme`.

---

### 1.2 Problemas funcionales confirmados por comportamiento observado

| Área | Problema | Causa probable | Impacto |
|---|---|---|---|
| Selección | No funciona bien selección simple/múltiple | Click, Selecto, Moveable y comandos resuelven selección por separado | Alto |
| Selección por SO | macOS y Windows no respetan combinaciones esperadas | No existe `selectionPolicy` por plataforma | Alto |
| Región | Selección de región no cubre todos los schemas | Hit-testing mezclado con overlays/options/toolbar | Alto |
| Lock/readonly | Schemas nacen bloqueados o aparecen bloqueados en inspector | Defaults y acceso resueltos desde múltiples capas | Crítico |
| Inspector | Dice bloqueado cuando canvas no lo refleja | `DetailView` infiere estado en vez de leer un view model único | Crítico |
| Owner color | Algunos schemas no heredan color de usuario | SVGs/estilos internos/resolvers duplicados | Medio/alto |
| LeftSidebar | Botón collapse se corta o se superpone | Handle vive dentro de área con overflow/posición desigual | Medio |
| RightSidebar | Collapse no es simétrico al izquierdo | Contrato distinto (`sidebarOpen` vs expanded/rail) | Medio/alto |
| Catálogo | Vistas rich/compact/mini confusas | Layout y densidad mezclados | Medio |
| DetailView | Demasiadas secciones genéricas | Falta matriz por familia de schema | Medio/alto |
| Custom fields | Controles visuales no persisten todas las propiedades | `CustomFieldDef` y schema creado no coinciden | Alto |
| CommandBus | Mutaciones se disparan desde varias rutas | No hay pipeline único de comandos mutables | Alto |
| Snapshot | Riesgo de perder metadata | Varios adapters/helpers pueden tocar estructura | Alto |
| CSS | Tailwind bridge + global + sidebar pisan selectores | Multiplicidad de CSS sobre mismo runtime | Medio/alto |

---

### 1.3 Investigación de modelo DocuSign-like aplicable

No se debe copiar UI, HTML, CSS ni branding. Debe tomarse como referencia funcional.

Mapping mínimo:

| DocuSign-like | SISAD PDFME |
|---|---|
| SignHere | `signature` |
| InitialHere | `initials` |
| DateSigned | `dateSigned` |
| Text | `text` |
| Number | `number` |
| Checkbox | `checkbox` |
| RadioGroup | `radioGroup` |
| List/Dropdown | `select` / `dropdown` |
| SignerAttachment | `attachment` |
| Note | `note` |
| Approve/Decline | `approve` / `decline` |
| Formula | `formula` futuro |
| Prefill | modo/propiedad de schema readonly/prefill |
| AutoPlace | anchor text + offsets + occurrence |

La conclusión funcional es que cada campo debe tener:

```ts
type SchemaCoreIdentity = {
  schemaUid: string;
  type: string;
  documentId?: string;
  fileId?: string;
  pageNumber: number;
  pageIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  ownerRecipientId?: string;
  ownerRecipientIds?: string[];
  ownerColor?: string;
  recipientColor?: string;
  userColor?: string;
  required?: boolean;
  readOnly?: boolean;
  readonly?: boolean;
  locked?: boolean;
  hidden?: boolean;
  dataLabel?: string;
  tooltip?: string;
  __designer?: Record<string, unknown>;
};
```

Regla crítica: **`schemaUid` identifica el campo; `dataLabel`/`fieldKey` conecta con negocio; `name`/`label` es visual.**

---

## 2. Principios de refactor

### 2.1 No corregir por síntoma

Proceso obligatorio:

```txt
Proceso afectado
→ componentes involucrados
→ fuente de verdad
→ estados válidos
→ datos preservados
→ validación mínima
→ implementación
```

Ejemplo:

```txt
Problema: checkboxGroup no se selecciona correctamente.
Mala solución: agregar stopPropagation en un componente.
Buena solución: resolver hit-testing root/option/toolbar desde interactionTargetResolver.
```

---

### 2.2 SOLID aplicado al diseñador

| Principio | Aplicación práctica |
|---|---|
| SRP | `Canvas.tsx` orquesta; `selectionPolicy.ts` decide intención; `schemaAccessResolver.ts` decide permisos; `interactionTargetResolver.ts` decide targets. |
| OCP | Un schema nuevo registra perfil/capacidades/secciones; no modifica `DetailView.tsx` ni `Canvas.tsx`. |
| LSP | Todos los schemas cumplen base serializable y no rompen Form/Viewer/Generator. |
| ISP | Props pequeñas por widget: `InspectorWidgetProps`, `SchemaListItemProps`, `CanvasInteractionContext`. |
| DIP | Componentes visuales dependen de view models y command interfaces, no de raw schema + lock manager directamente. |

---

### 2.3 Patrones recomendados

| Proceso | Patrón |
|---|---|
| Crear schema | Factory Method + Registry |
| Render schema | Template Method + Decorator |
| Editar propiedades | Strategy + Registry |
| Valores | Adapter + Strategy |
| Transformar | Command + State |
| Grupos | Composite + Command |
| Snapshot | Adapter + Memento |
| Host bridge | Facade |
| Inspector | Registry + Strategy |
| Access control | Policy/Resolver |
| Owner color | Facade + Token adapter |

---

## 3. Arquitectura objetivo

### 3.1 Nuevos módulos obligatorios

Crear o consolidar:

```txt
src/sisad-pdfme/ui/components/Designer/shared/selectionPolicy.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAccessModel.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAccessResolver.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetResolver.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaOwnerAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/selectedSchemaViewModel.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaCreationPolicy.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaProfileRegistry.ts
src/sisad-pdfme/ui/components/Designer/shared/sidebarPanelContract.ts
```

No crear estos módulos como wrappers decorativos. Deben reemplazar lógica repetida.

---

### 3.2 Mapa de dependencias objetivo

```txt
Canvas.tsx
  -> selectionPolicy
  -> interactionTargetResolver
  -> schemaAccessResolver
  -> selectedSchemaViewModel
  -> commandBus

Moveable.tsx
  -> schemaAccessResolver
  -> transformTargetGuards / interactionTargetResolver

Selecto.tsx
  -> selectionPolicy
  -> interactionTargetResolver

RightSidebar/ListView
  -> selectedSchemaViewModel
  -> schemaAccessResolver
  -> schemaOwnerAppearance
  -> commandBus

RightSidebar/DetailView
  -> selectedSchemaViewModel
  -> schemaProfileRegistry
  -> schemaAccessResolver
  -> commandBus

Schemas/*
  -> schemaProfileRegistry
  -> fieldChrome
  -> schemaOwnerAppearance
  -> value adapters

Snapshot
  -> schema metadata contracts
  -> migrations only when needed
```

---

## 4. Fase 0 — Auditoría profunda obligatoria

### 4.1 Objetivo

Antes de modificar, generar evidencia de duplicidad. No tocar archivos hasta completar reportes.

### 4.2 Comandos

```bash
mkdir -p reports/designer-deep-audit

rg "selectSchema|selectAll|deselectAll|activeElements|onEdit|onSelect|Selecto|Moveable|regionSelection|metaKey|ctrlKey|shiftKey|altKey" src/sisad-pdfme > reports/designer-deep-audit/selection-audit.txt

rg "locked|lock|readOnly|readonly|disabled|editable|canEdit|canMove|canResize|canDelete|restrictChanges|isOwner|ownerMode" src/sisad-pdfme > reports/designer-deep-audit/access-audit.txt

rg "ownerColor|recipientColor|userColor|schemaTone|resolve.*Color|--schema-owner-color|data-schema-owner-color" src/sisad-pdfme > reports/designer-deep-audit/owner-color-audit.txt

rg "pageNumber|pageIndex|documentId|fileId|activeDocumentId|paperRefs|pageCursor|pages\[0\]|pageNumber \|\| 1" src/sisad-pdfme > reports/designer-deep-audit/multipage-audit.txt

rg "options|optionGroup|selectedOption|selectedOptionIds|selectedOptionId|checkboxGroup|radioGroup|dropdown|select|OptionListWidget|data-option-id" src/sisad-pdfme > reports/designer-deep-audit/options-audit.txt

rg "DetailView|detailSchemas|detailSectionTaxonomy|inspectorContracts|SchemaCollaborationWidget|schemaCollaborationUtils|detailWidgetRegistry" src/sisad-pdfme/ui/components/Designer/RightSidebar > reports/designer-deep-audit/inspector-audit.txt

rg "CommandBus|commandBus|selectionCommands|designerCommands|undo|redo|keyboardShortcuts|useDesignerKeyboardShortcuts" src/sisad-pdfme > reports/designer-deep-audit/commandbus-audit.txt

rg "data-view-mode|rich|compact|mini|CatalogViewMode|sidebarDensity|data-left-sidebar-density|data-right-sidebar-density|sidebarExpanded|sidebarOpen" src/sisad-pdfme > reports/designer-deep-audit/sidebar-density-audit.txt

rg "any|as any|Record<string, any>|unknown as" src/sisad-pdfme/ui src/sisad-pdfme/schemas src/sisad-pdfme/shared > reports/designer-deep-audit/type-safety-audit.txt
```

### 4.3 Entregables de auditoría

```txt
reports/designer-deep-audit/
  selection-audit.txt
  access-audit.txt
  owner-color-audit.txt
  multipage-audit.txt
  options-audit.txt
  inspector-audit.txt
  commandbus-audit.txt
  sidebar-density-audit.txt
  type-safety-audit.txt
  duplication-map.md
  risk-map.md
```

### 4.4 Formato de `duplication-map.md`

```md
# Duplication map

## Selección
- Funciones equivalentes:
- Archivos:
- Fuente única propuesta:
- Qué se elimina:

## Access / lock / readonly
...
```

---

## 5. Fase 1 — Política única de selección

### 5.1 Problema

La selección simple, selección múltiple, selección por región, shortcuts, ListView y toolbar no pueden operar con reglas distintas.

### 5.2 Implementar `selectionPolicy.ts`

```ts
export type PlatformKind = 'mac' | 'windows' | 'linux' | 'unknown';

export type SelectionIntent =
  | 'replace'
  | 'toggle'
  | 'add'
  | 'region-replace'
  | 'region-add'
  | 'clear'
  | 'inspect-only';

export type SelectionPolicyInput = {
  platform: PlatformKind;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  targetKind?: 'schema-root' | 'option-internal' | 'interactive-control' | 'canvas-empty' | 'overlay' | 'moveable-control';
  pointerKind?: 'click' | 'double-click' | 'drag-region' | 'keyboard';
};

export function detectPlatform(): PlatformKind;
export function resolveSelectionIntent(input: SelectionPolicyInput): SelectionIntent;
export function isAdditiveSelectionIntent(intent: SelectionIntent): boolean;
```

### 5.3 Reglas por sistema operativo

| Acción | Windows/Linux | macOS | Resultado |
|---|---|---|---|
| Click normal en schema | sin modificador | sin modificador | reemplaza selección |
| Multi click principal | `Ctrl + Shift + click` | `Command + click` | toggle/add |
| Compatibilidad | `Ctrl + click` | `Command + Shift + click` | toggle/add |
| Región normal | drag en vacío | drag en vacío | reemplaza con región |
| Región acumulativa | `Ctrl` o `Shift` + región | `Command` o `Shift` + región | agrega región |
| Click vacío | sin modificador | sin modificador | limpia selección |
| Click schema bloqueado | cualquiera | cualquiera | selecciona para inspección, no transforma |

### 5.4 Archivos a modificar

```txt
src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts
src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts
src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts
```

### 5.5 Criterios de aceptación

- Click normal reemplaza selección.
- macOS `Command + click` alterna selección.
- Windows/Linux `Ctrl + Shift + click` alterna selección.
- Región selecciona roots `[data-schema-id]` únicamente.
- Región acumulativa no borra selección previa.
- Click en option interna no crea selección independiente.
- Click en toolbar/Moveable handles no dispara Selecto.

---

## 6. Fase 2 — Hit-testing y target resolver

### 6.1 Problema

Selecto, Moveable, opciones internas, botón `+`, inputs, toolbar contextual y comentarios compiten por eventos.

### 6.2 Implementar `interactionTargetResolver.ts`

```ts
export type InteractionTargetKind =
  | 'schema-root'
  | 'option-internal'
  | 'group-add-option'
  | 'interactive-control'
  | 'moveable-control'
  | 'selection-toolbar'
  | 'canvas-context-menu'
  | 'comment-anchor'
  | 'canvas-empty'
  | 'unknown';

export function resolveInteractionTarget(target: EventTarget | null): {
  kind: InteractionTargetKind;
  schemaRoot: HTMLElement | null;
  schemaUid?: string;
  optionId?: string;
};

export function shouldSelectTarget(result): boolean;
export function shouldTransformTarget(result): boolean;
export function shouldIgnoreForSelecto(result): boolean;
```

### 6.3 Reglas de target

| Target | Selección | Transformación | Edición valor |
|---|---:|---:|---:|
| `[data-schema-id]` root | sí | según permisos | no |
| `[data-option-id]` en designer | root only | no opción interna | doble click |
| `[data-role="group-add-option"]` | no | no | agrega opción |
| input/select/textarea | no | no | sí |
| toolbar contextual | no | no | acción |
| `.moveable-*` | no | sí | no |
| comment anchor | no o inspect | no | abre comentario |
| canvas vacío | limpia/region | no | no |

### 6.4 Archivos a revisar por duplicidad

```txt
src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts
src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*
```

---

## 7. Fase 3 — Access model único: locked, readonly, owner y permisos

### 7.1 Problema

El canvas, DetailView, ListView y menú contextual no muestran el mismo estado. A veces el inspector dice bloqueado cuando el schema no está realmente bloqueado.

### 7.2 Implementar `schemaAccessModel.ts`

```ts
export type SchemaLockState =
  | 'unlocked'
  | 'locked-by-me'
  | 'locked-by-other'
  | 'unknown';

export type SchemaReadonlyState =
  | 'editable'
  | 'readonly'
  | 'runtime-readonly'
  | 'disabled';

export type SchemaAccessState = {
  selectable: boolean;
  inspectable: boolean;
  editable: boolean;
  movable: boolean;
  resizable: boolean;
  rotatable: boolean;
  deletable: boolean;
  duplicable: boolean;
  canChangeOwner: boolean;
  canComment: boolean;
  lockState: SchemaLockState;
  readonlyState: SchemaReadonlyState;
  ownerState: 'mine' | 'other' | 'shared' | 'unassigned';
  reason?: string;
};
```

### 7.3 Implementar `schemaAccessResolver.ts`

```ts
export type ResolveSchemaAccessInput = {
  schema: SchemaForUI;
  activeUserId?: string | null;
  activeRecipientId?: string | null;
  runtimeMode: 'designer' | 'form' | 'viewer' | 'pdf';
  commandId?: string;
  lockSnapshot?: unknown;
  collaborationContext?: unknown;
};

export function resolveSchemaAccessState(input: ResolveSchemaAccessInput): SchemaAccessState;
export function canRunSchemaCommand(commandId: string, access: SchemaAccessState): boolean;
```

### 7.4 Reglas funcionales

| Estado | Selecciona | Mueve | Edita DetailView | Duplicar | Eliminar |
|---|---:|---:|---:|---:|---:|
| normal | sí | sí | sí | sí | sí |
| readonly | sí | no | no | depende política | no |
| locked-by-me | sí | sí | sí | sí | sí |
| locked-by-other | sí | no | no | no | no |
| hidden | no visible o tenue | no | solo si lista lo permite | no | no |
| other-owner | sí | depende permiso | depende permiso | depende permiso | depende permiso |

### 7.5 Acciones explícitamente permitidas aunque haya lock

```txt
selectSchema
selectAll
deselectAll
openProperties
zoom
navigatePage
viewDetails
copyTechnicalId
commentView
```

### 7.6 Archivos a modificar

```txt
src/sisad-pdfme/collaboration/lockManager.ts
src/sisad-pdfme/collaboration/schemaLockGuard.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/*
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/*
```

---

## 8. Fase 4 — Defaults de schemas al crear/arrastrar

### 8.1 Problema

Algunos schemas aparecen bloqueados o readonly al arrastrarlos al canvas.

### 8.2 Implementar `schemaCreationPolicy.ts`

```ts
export type SchemaCreationContext = {
  type: string;
  activeRecipientId?: string | null;
  activeRecipientColor?: string | null;
  activeUserId?: string | null;
  documentId?: string;
  pageNumber: number;
  x: number;
  y: number;
  source: 'drag-drop' | 'click-insert' | 'paste' | 'duplicate' | 'import';
};

export function normalizeNewSchemaState<T extends SchemaForUI>(schema: T, context: SchemaCreationContext): T;
```

### 8.3 Defaults esperados

```txt
readOnly: false por defecto
readonly: undefined salvo legacy
locked: false
hidden: false
disabled: false
ownerRecipientId: activeRecipientId
ownerColor: activeRecipientColor
__designer.createdByDrop: true si aplica
__designer.access.defaultEditable: true
```

### 8.4 Excepciones permitidas

- `dateSigned`: puede ser readonly en Form, pero no locked en Designer.
- `formula`: readonly por naturaleza, pero seleccionable e inspeccionable.
- `prefill`: readonly en runtime, editable por sender/designer.
- schemas importados legacy: respetar estado original si viene explícito.

### 8.5 Archivos a revisar

```txt
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts
src/sisad-pdfme/schemas/schemaBuilder.ts
src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts
src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts
src/sisad-pdfme/shared/schemaDesignerMeta.ts
```

---

## 9. Fase 5 — CommandBus como única vía de mutación

### 9.1 Problema

Canvas, DetailView, ListView, context menu y shortcuts pueden mutar schemas por rutas distintas.

### 9.2 Pipeline objetivo

```txt
UI event
  -> interactionTargetResolver
  -> selectionPolicy / schemaAccessResolver
  -> commandBus
  -> guard
  -> reducer/update
  -> snapshot dirty state
  -> view model refresh
```

### 9.3 Comandos mínimos a centralizar

```txt
selectSchema
toggleSchemaSelection
selectRegion
deselectAll
moveSchema
resizeSchema
rotateSchema
duplicateSchema
deleteSchema
lockSchema
unlockSchema
setReadonly
assignOwner
updateSchemaField
updateSchemaOptions
updateSchemaValidation
updateSchemaAppearance
updateSchemaGeometry
```

### 9.4 Archivos clave

```txt
src/sisad-pdfme/ui/commands/commandBus.ts
src/sisad-pdfme/ui/commands/designerCommands.ts
src/sisad-pdfme/commands/index.ts
src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx
```

### 9.5 Criterios

- Ningún widget de DetailView hace mutación directa sin pasar por comando.
- Undo/redo puede reconocer el cambio.
- Lock guard se aplica igual para toolbar, keyboard y inspector.
- Snapshot dirty state se actualiza una vez.

---

## 10. Fase 6 — Selected schema view model

### 10.1 Problema

DetailView, ListView y canvas calculan labels, owner, status y geometría por separado.

### 10.2 Implementar `selectedSchemaViewModel.ts`

```ts
export type SelectedSchemaViewModel = {
  schemaUid: string;
  schemaId?: string;
  type: string;
  family: string;
  label: string;
  technicalName: string;
  documentId?: string;
  pageNumber: number;
  owner: {
    recipientId: string | null;
    label: string;
    color: string;
    mode: 'single' | 'multi' | 'shared' | 'unassigned';
  };
  access: SchemaAccessState;
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  badges: Array<{ key: string; label: string; tone: 'neutral' | 'info' | 'warning' | 'danger' | 'success' }>;
};

export function buildSelectedSchemaViewModel(input): SelectedSchemaViewModel;
```

### 10.3 Consumidores

```txt
SelectionContextToolbar
CanvasContextMenu
DetailHeaderCard
DetailViewContent
SchemaCollaborationWidget
ListView Item
DocumentsRail field counters
CommentsRail field context
```

---

## 11. Fase 7 — Owner color y field chrome unificados

### 11.1 Problema

Algunos schemas heredan color y otros usan colores fijos internos.

### 11.2 Separar conceptos

```txt
Owner color:
- identifica destinatario/usuario dueño.
- debe aparecer en borde, foco, list item, inspector, drag preview.

Semantic color:
- representa significado del campo.
- approve = verde, decline = rojo, note = amarillo, etc.
```

### 11.3 Implementar `schemaOwnerAppearance.ts`

```ts
export type SchemaOwnerAppearance = {
  ownerRecipientId: string | null;
  ownerLabel: string;
  ownerColor: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  focusRingColor: string;
  cssVars: React.CSSProperties;
  dataAttributes: Record<string, string>;
};

export function resolveSchemaOwnerAppearance(input): SchemaOwnerAppearance;
```

### 11.4 Orden de resolución de color

```txt
1. schema.ownerColor
2. schema.userColor
3. schema.recipientColor
4. schema.__designer?.collaboration?.recipientColor
5. schema.__designer?.ownerColor
6. schema.__designer?.recipientColor
7. fallback activeRecipientColor
8. recipient.color
9. #2563EB
```

### 11.5 Schemas a validar uno por uno

```txt
src/sisad-pdfme/schemas/checkbox/index.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/schemas/select/index.ts
src/sisad-pdfme/schemas/text/uiRender.ts
src/sisad-pdfme/schemas/number/index.ts
src/sisad-pdfme/schemas/signature/index.ts
src/sisad-pdfme/schemas/signature/initials.ts
src/sisad-pdfme/schemas/signature/dateSigned.ts
src/sisad-pdfme/schemas/actions/approve.ts
src/sisad-pdfme/schemas/actions/decline.ts
src/sisad-pdfme/schemas/actions/attachment.ts
src/sisad-pdfme/schemas/actions/note.ts
src/sisad-pdfme/schemas/graphics/image.ts
src/sisad-pdfme/schemas/graphics/svg.ts
src/sisad-pdfme/schemas/barcodes/*
src/sisad-pdfme/schemas/tables/*
src/sisad-pdfme/schemas/shapes/*
```

### 11.6 Reglas visuales

- El wrapper debe exponer `--schema-owner-color`.
- El root debe tener `data-schema-owner-color` si aplica.
- SVGs del catálogo deben preferir `currentColor`.
- Semantic color no debe borrar owner accent.
- `approve`/`decline` mantienen verde/rojo en contenido, pero borde/focus/list/detail usan owner color.

---

## 12. Fase 8 — Schemas por familia y perfiles autoconfigurables

### 12.1 Problema

Cada schema tiende a inventar qué aparece en DetailView, qué capacidades tiene y cómo se renderiza.

### 12.2 Implementar `schemaProfileRegistry.ts`

```ts
export type SchemaFamily =
  | 'text-like'
  | 'option-based'
  | 'boolean'
  | 'signing'
  | 'action'
  | 'media'
  | 'layout'
  | 'table'
  | 'custom';

export type SchemaCapability =
  | 'selectable'
  | 'movable'
  | 'resizable'
  | 'rotatable'
  | 'editable-content'
  | 'editable-options'
  | 'required'
  | 'readonly'
  | 'validation'
  | 'appearance'
  | 'autoplace'
  | 'comments'
  | 'collaboration';

export type SchemaProfile = {
  type: string;
  family: SchemaFamily;
  displayName: string;
  capabilities: Partial<Record<SchemaCapability, boolean>>;
  inspectorSections: string[];
  defaultSize: { width: number; height: number };
  creationPolicy?: string;
  runtimeModes: Array<'designer' | 'form' | 'viewer' | 'pdf'>;
};
```

### 12.3 Perfiles mínimos

| Familia | Schemas | Secciones |
|---|---|---|
| text-like | text, number, date, time, emailAddress, fullname, company, title | basics, content, validation, appearance, dataLabel, help, location, collaboration, advanced |
| signing | signature, initials, dateSigned | basics, signing, appearance, dataLabel, help, location, collaboration, advanced |
| option-based | select, radioGroup, checkboxGroup | basics, options, validation, appearance, dataLabel, help, location, collaboration, advanced |
| boolean | checkbox | basics, value, validation, appearance, dataLabel, help, location, collaboration, advanced |
| action | approve, decline, attachment, note | basics, action/content/file, appearance, dataLabel, help, location, collaboration, advanced |
| media | image, svg, barcode, qr | basics, source, appearance, dataLabel, location, advanced |
| layout | line, rect, ellipse | basics, appearance, location, advanced |
| table | table, cell | basics, structure, appearance, data, location, advanced |

---

## 13. Fase 9 — DetailView / Inspector por contrato

### 13.1 Problema

El inspector debe cambiar por familia y tipo, no por parches dispersos.

### 13.2 Archivos a modificar

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
```

### 13.3 Taxonomía de secciones

```txt
identity
content
options
behavior
validation
appearance
dataBindings
help
location
autoPlace
collaboration
comments
advanced
```

### 13.4 Reglas de UI

- No mostrar secciones vacías.
- No duplicar `Renombrar` si ya existe input de nombre.
- `Guardar` del inspector debe llamarse `Aplicar cambios` o ser eliminado si cambios son live.
- `locked/readOnly` debe venir de `SchemaAccessState`.
- `owner` debe venir de `selectedSchemaViewModel.owner`.
- Ubicación debe adaptarse a ancho: 1 o 2 columnas, nunca 3 si el panel es estrecho.
- Las acciones destructivas deben estar en footer contextual o menú, no mezcladas con metadata técnica.

### 13.5 Orden recomendado de secciones

1. Identidad y estado.
2. Configuración principal del tipo.
3. Valor/opciones/acción/firma.
4. Validación/comportamiento.
5. Apariencia.
6. Asignación y acceso.
7. Ubicación y tamaño.
8. Datos conectados.
9. Comentarios.
10. Técnico.

---

## 14. Fase 10 — Option groups, checkbox y radio

### 14.1 Problema

Checkbox, checkboxGroup y radioGroup deben compartir indicador visual, comportamiento de selección y value adapters.

### 14.2 Rutas

```txt
src/sisad-pdfme/schemas/options/optionIndicator.ts
src/sisad-pdfme/schemas/options/optionGroupFactory.ts
src/sisad-pdfme/schemas/options/optionGroupRenderer.ts
src/sisad-pdfme/schemas/options/optionGroupLayout.ts
src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts
src/sisad-pdfme/schemas/options/optionValueAdapter.ts
src/sisad-pdfme/schemas/checkbox/index.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/schemas/groupSchemaRender.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx
```

### 14.3 Contrato de comportamiento

| Modo | Click simple | Doble click | Notas |
|---|---|---|---|
| Designer checkbox | selecciona schema | toggle checked | no ejecutar en click simple |
| Designer checkboxGroup | selecciona grupo | alterna opción | opción interna no es schema |
| Designer radioGroup | selecciona grupo | selecciona opción | deselecciona otras |
| Form checkbox | toggle | igual o sin extra | formulario real |
| Form radioGroup | selecciona opción | igual o sin extra | formulario real |
| Viewer/PDF | no interactúa | no interactúa | solo visual |

### 14.4 Reglas DOM

```txt
Root del grupo: data-schema-id
Opción interna: data-option-id
Botón agregar: data-role="group-add-option"
```

No poner `data-schema-id` en opciones internas.

### 14.5 Indicador común

`optionIndicator.ts` debe soportar:

```ts
type OptionIndicatorProps = {
  shape: 'square' | 'circle';
  checked: boolean;
  ownerColor?: string;
  semanticColor?: string;
  mode: 'designer' | 'form' | 'viewer' | 'pdf';
  disabled?: boolean;
  readOnly?: boolean;
  size?: number;
};
```

---

## 15. Fase 11 — LeftSidebar y RightSidebar simétricos

### 15.1 Problema

El LeftSidebar tiene colapso propio; el RightSidebar usa otra lógica. El botón del izquierdo se corta y el derecho no conserva rail simétrico.

### 15.2 Crear contrato compartido

```txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/shared/sidebarPanelContract.ts
```

```ts
type SidebarSide = 'left' | 'right';
type SidebarPresentation = 'docked' | 'overlay';
type SidebarDensity = 'comfortable' | 'compact' | 'narrow' | 'mini';

type SidebarCollapseHandleProps = {
  side: SidebarSide;
  expanded: boolean;
  presentation: SidebarPresentation;
  density?: SidebarDensity;
  labelExpanded: string;
  labelCollapsed: string;
  onToggle: () => void;
};
```

### 15.3 Reglas

- Mismo tamaño, borde, sombra, hover, focus y tooltip en ambos lados.
- No debe quedar recortado por `overflow-hidden`.
- `aria-expanded` obligatorio.
- `data-side` y `data-expanded` obligatorios.
- Rail colapsado de 40–44 px.
- Panel izquierdo abierto 272–304 px.
- Panel derecho abierto 336–368 px.
- Preservar scroll, zoom y selección al abrir/cerrar.

### 15.4 Archivos

```txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/styles/sisad-tailwind-bridge.css
```

---

## 16. Fase 12 — Catálogo izquierdo compacto y autoconfigurable

### 16.1 Problema

`rich`, `compact`, `mini` mezclan layout y densidad. El usuario ve modos confusos; la densidad cambia la semántica del layout.

### 16.2 Renombrar conceptos

```ts
type CatalogLayout = 'list' | 'tiles' | 'icons';
type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
```

Mapeo:

| Actual | Apariencia | Nuevo nombre |
|---|---|---|
| rich | fila horizontal con icono y texto | list |
| compact | tarjeta vertical | tiles |
| mini | solo iconos | icons |

### 16.3 Reglas

- `CatalogLayout` es decisión del usuario.
- `SidebarDensity` depende del ancho.
- La densidad no cambia `list` a `tiles` ni `tiles` a `icons`.
- El resize no debe reemplazar la preferencia del usuario.

### 16.4 Diseño objetivo

#### List

```txt
Altura: 36–40 px
Icono: 20–22 px
Texto: 11.5–12 px
Sin sombra permanente
Borde solo en hover/focus
```

#### Tiles

```txt
Altura: 52–58 px
Dos columnas si hay espacio
Icono: 22–24 px
Label: 1 línea
Sin card dentro de card
```

#### Icons

```txt
Botón: 38–42 px
Icono: 18–22 px
Grid: repeat(auto-fill, minmax(38px, 1fr))
Tooltip controlado
```

### 16.5 Corregir eventos

El catálogo no debe tener `onClick` y `onDoubleClick` haciendo la misma inserción. Contrato recomendado:

```txt
Click simple: insertar una vez con autoplace.
Drag: colocar con precisión.
Doble click: sin acción adicional o abre ayuda; no duplica inserción.
```

---

## 17. Fase 13 — RightSidebar ListView compacto

### 17.1 Problema

Todos los elementos parecen seleccionados por la barra azul. La información secundaria es inconsistente.

### 17.2 Fila estándar

```txt
[drag] [icono] Nombre visible                 [estado]
               Tipo · Destinatario · Pág. N
```

### 17.3 Estados visuales

| Estado | UI |
|---|---|
| normal | fondo neutro, sin barra azul |
| hover | fondo suave |
| seleccionado | barra owner color + fondo sutil |
| locked | candado/chip, no toda la tarjeta roja |
| readonly | chip compacto |
| hidden | opacidad o badge |

### 17.4 Funciones

- Click fila selecciona schema.
- Cambia a documento/página correcta.
- Scroll al campo.
- Pulso visual corto.
- Abre propiedades si está configurado.
- Soporta búsqueda, filtro y agrupación.

### 17.5 Agrupación futura

```txt
por documento
por página
por destinatario
por tipo
por estado
```

---

## 18. Fase 14 — CSS/Tailwind sin romper geometría

### 18.1 Regla fundamental

No tocar con CSS:

```txt
.moveable-*
.selecto-*
transform
left/top calculados
width/height de schema runtime
zoom geometry
paper position
scroll position
```

### 18.2 Tailwind permitido

- Clases en JSX para componentes nuevos.
- `sisad-tailwind-bridge.css` para compatibilidad de classNames existentes.
- Tokens CSS para colores, radios, sombras, density.
- No crear hojas nuevas dispersas.

### 18.3 Riesgos detectados

- `src/styles/tailwind.css` es fuente de Tailwind.
- `src/style.css` fue neutralizado para evitar doble emisión.
- Existen `sisad-pdfme-global.css`, `sisad-pdfme-sidebar.css`, `canvas-interactions.css`, `sisad-tailwind-bridge.css` con solapamientos.

### 18.4 Plan de decommission CSS

1. Inventariar selectores duplicados.
2. Clasificar:
   - geometry protected;
   - visual-only;
   - legacy removable;
   - host-only;
   - runtime required.
3. Migrar visual-only a Tailwind JSX o bridge.
4. Mantener geometry protected intacto.
5. Crear reporte:

```txt
reports/tailwind-migration/ui-styles-decommission-audit-v2.md
```

---

## 19. Fase 15 — Custom fields modal

### 19.1 Problema

El modal muestra propiedades que no siempre se guardan en el schema creado.

### 19.2 Regla P0

No mostrar un control si no persiste.

### 19.3 Contrato de definición

```ts
type CustomFieldDef = {
  id: string;
  type: string;
  label: string;
  description?: string;
  defaultSchema: Partial<SchemaForUI>;
  inspectorProfile?: string;
  capabilities?: SchemaCapability[];
};
```

### 19.4 Propiedades que deben persistir si se muestran

```txt
fontName
fontSize
fontColor
bold
italic
underline
fixedWidth
maskAsterisks
maxLength
validation
helpText
collaborationEnabled
ownerMode
options[]
defaultValue
required
readOnly
```

### 19.5 UI por tipo

- Text-like: valor, formato, validación, ayuda.
- Checkbox: default checked, requerido, ayuda.
- Select/radio: options editor.
- Line/shape: color, grosor, estilo.
- Attachment: mime types, max files, preview, replace.

---

## 20. Fase 16 — Snapshot y metadata

### 20.1 Datos que nunca deben perderse

```txt
schemaUid
type
documentId
fileId
pageNumber
pageIndex
x
y
width
height
rotation
ownerRecipientId
ownerRecipientIds
recipientId
ownerColor
recipientColor
userColor
required
readOnly
readonly
locked
hidden
groupId
optionId
selectedOptionIds
selectedOptionId
selectedValue
defaultValue
options
__designer
dataLabel
tooltip
comments
commentAnchors
```

### 20.2 Tests de roundtrip

- Guardar/importar mantiene documentos.
- Guardar/importar mantiene páginas.
- Duplicar conserva offset pero nuevo schemaUid.
- Paste conserva orden y offset.
- Option groups conservan options y selected values.
- Owner color no se recalcula erróneamente al cambiar usuario activo.

---

## 21. Fase 17 — Tests obligatorios

### 21.1 Unit tests

```bash
npx vitest run \
  tests/unit/selectionPolicy.test.ts \
  tests/unit/interactionTargetResolver.test.ts \
  tests/unit/schemaAccessResolver.test.ts \
  tests/unit/schemaCreationPolicy.test.ts \
  tests/unit/schemaOwnerAppearance.test.ts \
  tests/unit/schemaProfileRegistry.test.ts \
  tests/unit/detailView.schemaMatrix.test.ts \
  tests/unit/optionSelectionBehavior.test.ts \
  tests/unit/optionValueAdapter.test.ts \
  tests/unit/snapshotAdapter.test.ts
```

### 21.2 Playwright

```bash
npx playwright test tests/e2e/designer-selection-modifiers.spec.ts --project=chromium
npx playwright test tests/e2e/designer-selection-region.spec.ts --project=chromium
npx playwright test tests/e2e/designer-lock-readonly-sync.spec.ts --project=chromium
npx playwright test tests/e2e/designer-drag-drop-default-state.spec.ts --project=chromium
npx playwright test tests/e2e/designer-sidebar-canvas-sync.spec.ts --project=chromium
npx playwright test tests/e2e/designer-option-groups-selection.spec.ts --project=chromium
npx playwright test tests/e2e/designer-owner-color-sync.spec.ts --project=chromium
npx playwright test tests/e2e/designer-snapshot-roundtrip.spec.ts --project=chromium
npx playwright test tests/e2e/designer-catalog-layout-density.spec.ts --project=chromium
npx playwright test tests/e2e/designer-right-sidebar-listview.spec.ts --project=chromium
```

### 21.3 Manual QA

```txt
[ ] Drag text al canvas nace editable.
[ ] Drag attachment al canvas no nace locked.
[ ] Drag note al canvas no nace readonly salvo configuración explícita.
[ ] macOS Command+click selecciona múltiples.
[ ] Windows Ctrl+Shift+click selecciona múltiples.
[ ] Región selecciona varios schemas.
[ ] Región no selecciona botón + ni toolbar.
[ ] Locked-by-other se selecciona pero no se mueve.
[ ] Inspector muestra el mismo locked/readonly que canvas.
[ ] ListView y canvas usan mismo owner color.
[ ] LeftSidebar y RightSidebar colapsan con mismo patrón.
[ ] No hay scroll reset al colapsar paneles.
[ ] Option group root se selecciona con click.
[ ] Doble click en opción cambia valor solo en designer.
[ ] Form usa click simple para cambiar valores.
[ ] Viewer/PDF no interactúa.
[ ] Snapshot roundtrip conserva pageNumber/documentId/ownerColor.
```

---

## 22. Orden de implementación recomendado

### Sprint 0 — Congelar y auditar

```txt
1. git status --short
2. crear branch limpio
3. ejecutar auditorías rg
4. crear duplication-map.md
5. no modificar UI todavía
```

### Sprint 1 — Selección e interacción

```txt
1. selectionPolicy.ts
2. interactionTargetResolver.ts
3. integrar Selecto/Canvas
4. tests unitarios de policy
5. Playwright selección simple/múltiple/región
```

### Sprint 2 — Access y creación de schemas

```txt
1. schemaAccessModel.ts
2. schemaAccessResolver.ts
3. schemaCreationPolicy.ts
4. corregir defaults al drag/drop
5. sincronizar inspector/canvas/list
```

### Sprint 3 — CommandBus y view models

```txt
1. comandos mutables centralizados
2. selectedSchemaViewModel.ts
3. DetailHeaderCard/ListView consumen view model
4. toolbar contextual usa access state
```

### Sprint 4 — Owner color y schema profiles

```txt
1. schemaOwnerAppearance.ts
2. fieldChrome consume variables unificadas
3. PluginIcon currentColor
4. schemaProfileRegistry.ts
5. matriz por familia
```

### Sprint 5 — DetailView y sidebars compactos

```txt
1. inspector por contrato
2. layout de campos adaptativo
3. SidebarCollapseHandle compartido
4. CatalogLayout list/tiles/icons
5. RightSidebar ListView compacto
```

### Sprint 6 — Option groups y custom fields

```txt
1. optionIndicator único
2. optionSelectionBehavior central
3. doble click designer/click form
4. custom fields: no mostrar propiedades no persistidas
```

### Sprint 7 — Snapshot y regresión final

```txt
1. snapshot roundtrip
2. tests E2E completos
3. visual baseline
4. build/lint
5. reporte final
```

---

## 23. Task-cards recomendadas

### TASK-SEL-001 — SelectionPolicy y selección múltiple por plataforma

**Archivos permitidos:**

```txt
Canvas.tsx
Selecto.tsx
selectionCommands.ts
selectionIdentityResolver.ts
useDesignerKeyboardShortcuts.ts
selectionPolicy.ts
interactionTargetResolver.ts
```

**No tocar:** schemas, DetailView, SnapshotAdapter, CSS global.

**Criterio de cierre:** tests unitarios + Playwright selección modifiers.

---

### TASK-ACC-001 — AccessResolver lock/readonly sync

**Archivos permitidos:**

```txt
schemaAccessModel.ts
schemaAccessResolver.ts
schemaLockGuard.ts
lockManager.ts
SelectionContextToolbar.tsx
CanvasContextMenu.tsx
DetailHeaderCard.tsx
ListView/Item.tsx
```

**No tocar:** Moveable salvo consumo de access state.

**Criterio de cierre:** inspector y canvas muestran el mismo estado.

---

### TASK-DROP-001 — SchemaCreationPolicy defaults

**Archivos permitidos:**

```txt
schemaCreationPolicy.ts
canvasDropPipeline.ts
schemaAutoPlace.ts
schemaBuilder.ts
actionSchemaFactory.ts
signingSchemaFactory.ts
```

**Criterio de cierre:** ningún schema nuevo nace locked/readonly accidental.

---

### TASK-UI-001 — SidebarCollapseHandle simétrico

**Archivos permitidos:**

```txt
SidebarCollapseHandle.tsx
sidebarPanelContract.ts
LeftSidebar.tsx
RightSidebar.tsx
RightSidebar/layout.tsx
sisad-tailwind-bridge.css
```

**Criterio de cierre:** mismo patrón visual/funcional en ambos sidebars.

---

### TASK-SCHEMA-001 — SchemaProfileRegistry e inspector matrix

**Archivos permitidos:**

```txt
schemaProfileRegistry.ts
detailSchemas.ts
inspectorContracts.ts
detailSectionTaxonomy.ts
detailWidgetRegistry.tsx
schemaFamilies.ts
```

**Criterio de cierre:** cada schema declara familia, capacidades y secciones.

---

### TASK-OPTION-001 — Option groups y checkbox/radio unified

**Archivos permitidos:**

```txt
optionIndicator.ts
optionGroupFactory.ts
optionGroupRenderer.ts
optionSelectionBehavior.ts
optionValueAdapter.ts
checkbox/index.ts
checkboxGroup/index.ts
radioGroup/index.ts
GroupOptionFloatingAction.tsx
```

**Criterio de cierre:** click selecciona grupo; doble click cambia valor en designer.

---

### TASK-CSS-001 — CatalogLayout + density sin duplicidad

**Archivos permitidos:**

```txt
LeftSidebar.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
useLeftSidebarCatalogState.ts
sisad-tailwind-bridge.css
sisad-pdfme-sidebar.css
```

**Criterio de cierre:** list/tiles/icons no cambian por density.

---

## 24. Prompt maestro para Codex

```txt
Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind, pdfme, Moveable, Selecto, CommandBus, SOLID, schemas plugin-based e inspectores tipo DocuSign-like.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Ruta de validación:
http://localhost:5174/lab/multi-document-routing

Problema:
El diseñador SISAD PDFME tiene regresiones funcionales en selección, canvas, schemas, lock/readonly, sidebars, owner color y DetailView. No hagas parches visuales. Primero estabiliza contratos.

Inicio obligatorio:
1. git status --short
2. Leer:
   - ai/start/START.md
   - ai/router/ROUTER.md
   - ai/router/CONTEXT_BUDGET.md
   - ai/memory/project-memory.md
3. Elegir una sola task-card.
4. Máximo 2 búsquedas rg generales.
5. Máximo 8 archivos abiertos.
6. Máximo 5 archivos modificados por pasada.
7. Si requiere más, detenerse y crear nueva task-card.

Reglas:
- No tocar StepOne, StepTwo host, ContentCustomForm negocio, Uanataca, liveness, APIs SISAD, externalForms negocio.
- No tocar Generator/pdf-lib salvo contrato explícito.
- No tocar SnapshotAdapter salvo task específica.
- No modificar Moveable/Selecto por z-index; resolver con policies/guards.
- No usar setTimeout para geometría, selección ni render.
- No crear CSS disperso.
- No usar as any nuevo.
- No duplicar inspector, sidebars, canvas ni renderer de schemas.
- Cada componente nuevo debe ser genérico y autoconfigurable.

Datos que nunca deben perderse:
schemaUid, type, documentId, fileId, pageNumber, pageIndex, x, y, width, height, rotation, ownerRecipientId, ownerRecipientIds, ownerColor, recipientColor, userColor, required, readOnly, readonly, locked, hidden, groupId, optionId, selectedOptionIds, selectedOptionId, selectedValue, defaultValue, options, __designer, dataLabel, tooltip.

Objetivo de esta pasada:
Selecciona solo una de estas tareas:
- SelectionPolicy + interactionTargetResolver.
- SchemaAccessResolver + lock/readonly sync.
- SchemaCreationPolicy para defaults de drag/drop.
- SidebarCollapseHandle simétrico.
- SchemaProfileRegistry + inspector matrix.
- Option groups unified behavior.
- CatalogLayout + density.

Entrega final:
# Resultado
## Task-card ejecutada
## Router decision
## Archivos revisados
## Diagnóstico
## Causa raíz
## Cambios realizados
## Archivos modificados
## Tests ejecutados
## Riesgos pendientes
## Siguiente task-card recomendada
```

---

## 25. Criterios finales de aceptación global

El plan se considera completo cuando:

```txt
[ ] selección simple funciona en todos los schemas;
[ ] selección múltiple funciona en macOS y Windows/Linux;
[ ] selección por región funciona sin capturar overlays;
[ ] locked/readonly se sincroniza entre canvas, list y inspector;
[ ] schemas nuevos no nacen bloqueados accidentalmente;
[ ] owner color se propaga igual en wrapper, catálogo, list, detail y preview;
[ ] LeftSidebar y RightSidebar tienen colapso simétrico;
[ ] catálogo usa list/tiles/icons + density separada;
[ ] DetailView renderiza por perfil de schema;
[ ] checkbox/radio/groups comparten optionIndicator;
[ ] custom fields no muestran controles no persistidos;
[ ] CommandBus es la vía única de mutación;
[ ] snapshot roundtrip conserva metadata crítica;
[ ] no hay hacks de z-index ni setTimeout;
[ ] no se crea CSS disperso fuera del bridge/runtime;
[ ] build, lint, unit tests y E2E críticos pasan.
```

---

## 26. Riesgos y decisiones pendientes

| Riesgo | Decisión recomendada |
|---|---|
| Cambios previos de Codex mezclados | Crear branch limpio y separar commits. |
| CSS global pisa Tailwind bridge | Crear auditoría de selectores y decommission por fases. |
| SnapshotAdapter muy sensible | No tocar hasta tener tests de roundtrip. |
| Moveable/Selecto frágiles | Resolver con interactionTargetResolver antes de editar componentes. |
| Inspector muy genérico | Crear matriz por familia antes de tocar widgets. |
| `any` acumulado | Task específica después de estabilizar comportamiento. |
| Option groups complejos | Mantener root como schema; options internas nunca schemas. |
| Host SISAD puede contaminar estilos | Aislar runtime y evitar selectores host sobre clases internas. |

---

## 27. Conclusión

La solución no debe ser una nueva capa visual sobre un comportamiento inestable. El diseñador necesita primero una base contractual:

```txt
SelectionPolicy
+ InteractionTargetResolver
+ SchemaAccessResolver
+ SchemaCreationPolicy
+ SelectedSchemaViewModel
+ SchemaOwnerAppearance
+ SchemaProfileRegistry
+ CommandBus mutation pipeline
```

Después de eso, la mejora UX/UI con Tailwind será estable y reutilizable. Si se empieza por compactar sidebars o cambiar estilos sin resolver esos contratos, los bugs de selección, bloqueo y sincronización volverán a aparecer.

