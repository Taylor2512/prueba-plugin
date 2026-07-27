# Plan de continuidad — Configuración unificada de componentes y comportamientos de SISAD PDFME

**Proyecto base:** `prueba-plugin`
**Ámbito:** `src/sisad-pdfme` como componente portable y aislado
**Fecha de continuidad:** 2026-07-27
**Objetivo:** unificar la configuración de componentes, funcionalidades, comportamientos, permisos y visibilidad en una única fuente de verdad, sin acoplar el core a SISAD-WEB ni reimplementar lógica existente.

---

# 1. Decisión arquitectónica

La configuración raíz actual debe continuar siendo el contrato público:

``​`txt
src/sisad-pdfme/config/SisadPdfmeConfig.ts
src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts
src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts
src/sisad-pdfme/config/createSisadPdfmeConfig.ts
src/sisad-pdfme/config/index.ts
``​`

Sobre esa base se debe crear una fachada única:

``​`txt
src/sisad-pdfme/config/SisadPdfmeConfigService.ts
``​`

La regla es:

``​`txt
Un SisadPdfmeProvider
→ una instancia de SisadPdfmeConfigService
→ una configuración resuelta
→ un RecipientRegistry
→ un DesignerEngine
→ un EventHub
→ un conjunto de adapters
→ todos los componentes consumen selectores del mismo servicio
``​`

## Aclaración importante

“Servicio único” no significa un singleton global para toda la aplicación.

Debe existir **una instancia por árbol de `SisadPdfmeProvider` o por runtime montado**, para permitir dos diseñadores independientes en la misma página sin compartir estado, recipients, eventos, permisos ni feature flags.

---

# 2. Estado actual confirmado

El proyecto ya tiene una base aprovechable:

- `SisadPdfmeGlobalConfig`.
- `ResolvedSisadPdfmeConfig`.
- configuración por `runtime`, `theme`, `canvas`, `sidebars`, `schemas`, `recipients`, `collaboration`, `assignment`, `documents`, `signatures`, `persistence`, `events`, `debug`, `visibility` y `ui`;
- `defaultSisadPdfmeConfig`;
- merge profundo y normalización en `resolveSisadPdfmeConfig`;
- creación de `runtimeOptions`;
- creación de `DesignerEngine`;
- adapters de recipients, documentos, persistencia y firmas;
- `DesignerRuntimeEventHub`;
- `SisadPdfmeProvider`;
- `RecipientRegistry` compartido;
- wrappers públicos `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer`;
- mapa parcial `designerUiConfig` para visibilidad, acciones y permisos.

La continuidad no debe reemplazar esa arquitectura. Debe **cerrar el circuito** y eliminar las fuentes paralelas.

---

# 3. Problemas que deben resolverse antes de seguir agregando flags

## 3.1 Configuración duplicada

Actualmente existen rutas equivalentes o parcialmente equivalentes:

``​`txt
visibility
ui.visibility

sidebars.left.defaultOpen
ui.sidebars.left.defaultOpen

sidebars.left.catalogLayout
ui.sidebars.left.catalogLayout

sidebars.right.defaultPanel
ui.sidebars.right.defaultPanel

theme.density
ui.density
``​`

Esto obliga al resolver a decidir precedencia y permite que dos configuraciones distintas controlen el mismo resultado.

## 3.2 El resolver también crea recursos

`resolveSisadPdfmeConfig` no solo normaliza valores. También crea:

``​`txt
DesignerEngine
adapters
eventHub
runtimeOptions
``​`

Cada nueva resolución puede crear recursos distintos. Esto es peligroso cuando:

- el host crea el objeto de configuración inline en cada render;
- un wrapper llama `createSisadPdfmeConfig`;
- el Provider vuelve a resolver;
- otro hook resuelve fuera del Provider;
- una actualización visual termina reemplazando el EventHub o el engine.

## 3.3 La UI vuelve a interpretar opciones

`designerUiConfig.ts` y `visibilityConfig.ts` ya intentan centralizar reglas, pero todavía leen `OptionsContext` como `unknown` y reconstruyen estado efectivo dentro del Designer.

El flujo actual puede terminar así:

``​`txt
SisadPdfmeGlobalConfig
→ resolveSisadPdfmeConfig
→ runtimeOptions
→ OptionsContext
→ buildDesignerUiMap
→ nueva interpretación de visibility/assignment/collaboration
``​`

La UI debe recibir un estado efectivo ya resuelto o consultar selectores del servicio, no reconstruir reglas de dominio.

## 3.4 Visible, habilitado y permitido están mezclados

Ejemplo de reasignación:

``​`txt
assignment.enabled
assignment.allowSingle
assignment.allowBulk
visibility.actions.reassign
visibility.modals.assignment
collaboration.canEditStructure
selección actual
recipients disponibles
lock/readOnly del schema
``​`

Un booleano aislado no responde si la acción:

- existe;
- está habilitada;
- debe mostrarse;
- está permitida;
- está disponible en el contexto actual;
- puede ejecutarse;
- está activa.

## 3.5 El API público de `config/index.ts` presenta una regresión

El archivo consolidado actual muestra:

``​`ts
export { defaultSisadPdfmeConfig } from './defaultSisadPdfmeConfig.js';
export { createSisadPdfmeConfig } from './createSisadPdfmeConfig.js';
;
``​`

También desaparecieron exportaciones públicas que existían antes, entre ellas el resolver y varios contratos.

Esto debe corregirse antes de publicar el nuevo servicio.

## 3.6 Algunos tipos públicos se volvieron internos

En las diferencias recientes aparecen contratos como:

``​`txt
SisadPdfmeDocument
SisadPdfmeEventHandlers
``​`

convertidos de `export type` a tipos internos.

La configuración global no será portable si el host no puede tipar documentos, eventos, adapters y estado resuelto.

---

# 4. Semántica obligatoria para cada funcionalidad

Cada funcionalidad o componente debe resolverse con el mismo modelo:

``​`ts
export type SisadPdfmeFeatureState = {
  id: string;

  /** El core o un plugin registró esta capacidad. */
  registered: boolean;

  /** La superficie/runtime actual soporta la capacidad. */
  supported: boolean;

  /** El host decidió activar su lógica. */
  enabled: boolean;

  /** El host decidió mostrar su representación visual. */
  visible: boolean;

  /** Los permisos actuales permiten usarla. */
  permitted: boolean;

  /** El contexto actual permite ejecutarla. */
  available: boolean;

  /** La funcionalidad está activa en este momento. */
  active: boolean;

  /** Resultado final para ejecutar comportamiento. */
  executable: boolean;

  /** Explicación estable cuando no se puede usar. */
  reason?: string;

  /** Rutas de configuración que participaron en la decisión. */
  sources?: string[];
};
``​`

## Fórmula efectiva

``​`txt
executable =
  registered
  && supported
  && enabled
  && permitted
  && available
``​`

La visibilidad se evalúa aparte:

``​`txt
renderable =
  registered
  && supported
  && enabled
  && visible
``​`

Esto permite estados útiles:

``​`txt
visible=true + executable=false
→ mostrar botón deshabilitado con motivo

visible=false + executable=true
→ capacidad disponible solo por API/CommandBus

enabled=false
→ no montar lógica, listeners ni overlays

visible=false
→ ocultar UI sin necesariamente desactivar la capacidad
``​`

---

# 5. Contrato canónico de configuración

## 5.1 Mantener las secciones raíz actuales

Se conservan como fuente canónica:

``​`txt
app
runtime
theme
canvas
sidebars
schemas
recipients
collaboration
assignment
documents
signatures
persistence
events
debug
visibility
ui
``​`

## 5.2 Reducir `ui` a presentación

`ui` debe quedar solo para layout y estilos:

``​`ts
ui: {
  visualPreset;
  layoutPreset;
  gap;
  padding;
  baseWidth;
  baseHeight;
  classNames;
}
``​`

Deben considerarse legacy/deprecated:

``​`txt
ui.visibility
ui.density
ui.sidebars
``​`

## 5.3 Rutas canónicas

``​`txt
visibility                    → única configuración de visualización
theme.density                 → única densidad base
sidebars.*                    → único comportamiento y estado inicial de sidebars
ui.*                          → solo layout, medidas, preset y classNames públicos
recipients.activeRecipientId  → único destinatario activo
``​`

Debe quedar deprecated:

``​`txt
collaboration.activeRecipientId
``​`

Se conserva temporalmente solo como alias de compatibilidad.

## 5.4 Precedencia oficial

``​`txt
1. Defaults de librería
2. Preset visual/runtime
3. Config legacy migrada
4. Config canónica del host
5. Overrides temporales del runtime
6. Permisos y contexto efectivo
7. Estado local de interacción
``​`

La configuración canónica siempre gana sobre un alias legacy.

---

# 6. Arquitectura del servicio único

## 6.1 Estructura propuesta

``​`txt
src/sisad-pdfme/config/
├── SisadPdfmeConfig.ts
├── defaultSisadPdfmeConfig.ts
├── createSisadPdfmeConfig.ts
├── resolveSisadPdfmeConfig.ts
├── SisadPdfmeConfigService.ts
├── configMigration.ts
├── configValidation.ts
├── configSelectors.ts
├── configChangeImpact.ts
├── featureRegistry.ts
├── featureDependencies.ts
├── componentRegistry.ts
├── actionConfigRegistry.ts
└── index.ts
``​`

## 6.2 Responsabilidad de `SisadPdfmeConfigService`

La fachada debe:

``​`ts
export interface SisadPdfmeConfigService {
  getRawConfig(): SisadPdfmeGlobalConfig;
  getResolvedConfig(): ResolvedSisadPdfmeConfig;

  getFeatureState(
    featureId: SisadPdfmeFeatureId,
    context?: SisadPdfmeFeatureContext,
  ): SisadPdfmeFeatureState;

  getActionState(
    actionId: string,
    context?: SisadPdfmeActionContext,
  ): SisadPdfmeActionState;

  getComponentState(
    componentId: string,
    context?: SisadPdfmeComponentContext,
  ): SisadPdfmeComponentState;

  select<T>(selector: SisadPdfmeConfigSelector<T>): T;

  updateConfig(
    patch: DeepPartial<SisadPdfmeGlobalConfig>,
    options?: SisadPdfmeConfigUpdateOptions,
  ): SisadPdfmeConfigChangeResult;

  setRuntimeOverride(
    patch: DeepPartial<SisadPdfmeGlobalConfig>,
    source?: string,
  ): SisadPdfmeConfigChangeResult;

  clearRuntimeOverrides(source?: string): void;

  replaceConfig(config: SisadPdfmeGlobalConfig): void;
  reset(): void;

  subscribe(listener: SisadPdfmeConfigListener): () => void;

  transaction<T>(callback: () => T): T;

  explain(
    targetId: string,
    context?: Record<string, unknown>,
  ): SisadPdfmeConfigurationExplanation;
}
``​`

## 6.3 El servicio no debe ser un God Object

La fachada delega en módulos puros:

``​`txt
configMigration       → compatibilidad legacy
configValidation      → errores y warnings
resolveConfig         → normalización
featureRegistry       → descripción de capacidades
featureDependencies   → requisitos y conflictos
actionConfigRegistry  → acciones
componentRegistry     → componentes visuales
configSelectors       → lectura estable
configChangeImpact    → hot update/rebuild/remount
``​`

---

# 7. Recursos estables y recursos recalculables

## 7.1 Recursos estables por Provider

Deben crearse una sola vez:

``​`txt
SisadPdfmeConfigService
RecipientRegistry
DesignerRuntimeEventHub
adapters base
controller facade
``​`

## 7.2 Recursos reconstruibles con control

``​`txt
DesignerEngine
runtimeOptions
plugins resueltos
signature providers
``​`

No deben reconstruirse por un cambio como:

``​`txt
ocultar búsqueda
cerrar sidebar
cambiar panel visible
ocultar botón eliminar
mostrar sección avanzada
``​`

---

# 8. Clasificación de cambios de configuración

Crear:

``​`ts
export type SisadPdfmeConfigChangeImpact =
  | 'none'
  | 'ui-state'
  | 'runtime-options'
  | 'engine-rebuild'
  | 'runtime-remount';
``​`

## 8.1 Cambios calientes

No deben remontar el runtime:

``​`txt
visibility.*
sidebars.*.defaultOpen
sidebars.right.defaultPanel
theme.density
ui.gap
ui.padding
ui.classNames
debug.logEvents
acciones visibles/habilitadas
secciones y campos del inspector
``​`

## 8.2 Rebuild de engine

``​`txt
canvas.selecto
canvas.moveable
canvas.guides
canvas.snapLines
schemas.plugins
schemas.enabledTypes
signatures.providers
collaboration.enabled
``​`

Cuando sea posible, usar `updateOptions`; reconstruir solo si el engine no soporta actualización.

## 8.3 Remount de runtime

``​`txt
runtime.mode
cambio de constructor Designer/Form/Viewer
cambio incompatible del plugin registry
cambio de aislamiento del host que requiera nuevo DOM owner
``​`

## 8.4 Cambios prohibidos en caliente

Nunca cambiar en medio de una interacción activa:

``​`txt
Moveable mientras se redimensiona
Selecto mientras selecciona por región
document routing durante drag
schema plugins durante inline edit
runtime.mode con modal abierto
``​`

El servicio debe posponer o rechazar el cambio con motivo.

---

# 9. Registro de funcionalidades

Crear IDs estables, independientes de nombres de componentes React.

## 9.1 Runtime

``​`txt
runtime.designer
runtime.form
runtime.viewer
runtime.readonly
runtime.eventIsolation
``​`

## 9.2 Canvas e interacción

``​`txt
canvas.render
canvas.select
canvas.regionSelect
canvas.multiSelect
canvas.move
canvas.resize
canvas.rotate
canvas.guides
canvas.snapLines
canvas.grid
canvas.rulers
canvas.contextMenu
canvas.floatingToolbar
canvas.keyboardShortcuts
canvas.copyPaste
canvas.undoRedo
canvas.emptyClickClear
canvas.modalSuspension
``​`

## 9.3 LeftSidebar

``​`txt
sidebar.left
sidebar.left.collapse
sidebar.left.search
sidebar.left.tabs
sidebar.left.catalog
sidebar.left.layoutSwitcher
sidebar.left.customFields
sidebar.left.favorites
sidebar.left.recent
sidebar.left.recipients
``​`

## 9.4 RightSidebar

``​`txt
sidebar.right
sidebar.right.collapse
sidebar.right.tabs
sidebar.right.contextHeader
sidebar.right.fields
sidebar.right.detail
sidebar.right.comments
sidebar.right.documents
``​`

## 9.5 Inspector

``​`txt
inspector
inspector.identity
inspector.options
inspector.validation
inspector.behavior
inspector.box
inspector.appearance
inspector.help
inspector.dataBindings
inspector.collaboration
inspector.comments
inspector.advanced
inspector.technical
``​`

## 9.6 Schemas

``​`txt
schema.catalog.<type>
schema.canvas.<type>
schema.inspector.<type>
schema.runtime.<type>
schema.create.<type>
schema.edit.<type>
schema.delete.<type>
``​`

## 9.7 Acciones

``​`txt
action.reassign
action.rename
action.duplicate
action.delete
action.copy
action.paste
action.lock
action.unlock
action.hide
action.show
action.align
action.distribute
action.matchSize
``​`

## 9.8 Colaboración y asignación

``​`txt
recipients.registry
recipients.activeSelection
collaboration
collaboration.globalView
collaboration.ownerColor
assignment
assignment.single
assignment.bulk
assignment.modal
assignment.search
``​`

## 9.9 Documentos y comentarios

``​`txt
documents
documents.multi
documents.panel
documents.hostControlled
comments
comments.panel
comments.modal
comments.anchor
``​`

## 9.10 Firma, persistencia y diagnóstico

``​`txt
signatures
signatures.draw
signatures.image
signatures.p12
signatures.provider
persistence
persistence.local
persistence.host
persistence.autosave
snapshot.serialize
debug
debug.panel
debug.technicalInspector
debug.eventLog
``​`

---

# 10. Evaluación de comportamientos por dominio

## 10.1 Runtime

### Configuración actual

``​`txt
runtime.mode
runtime.readonly
runtime.isolateDomEvents
runtime.preserveSelectionOnModalClose
``​`

### Regla efectiva

- `designer`: habilita canvas editable, sidebars, inspector y comandos.
- `form`: deshabilita Moveable/Selecto/sidebars de diseño; habilita interacción de campos.
- `viewer`: deshabilita mutaciones y eventos de entrada.
- `readonly=true`: permite seleccionar e inspeccionar cuando la política lo autorice, pero no transformar ni mutar.

### Continuidad

Crear selectores:

``​`txt
selectRuntimeMode
selectIsReadonly
selectCanMutateTemplate
selectCanInspectSchemas
``​`

---

## 10.2 Canvas

### Configuración actual

``​`txt
canvas.enabled
canvas.selecto
canvas.moveable
canvas.snapLines
canvas.guides
canvas.emptyClickClearsSelection
canvas.multiSelect
canvas.platformSelection
canvas.suspendWhenModalOpen
canvas.resetInteractionOnModalClose
``​`

### Problema

`moveable` controla de forma demasiado gruesa mover, redimensionar y rotar.

### Continuidad

Agregar capacidades separadas sin romper legacy:

``​`ts
canvas: {
  transform?: {
    move?: boolean;
    resize?: boolean;
    rotate?: boolean;
  };
}
``​`

Compatibilidad:

``​`txt
canvas.moveable=false
→ move=false
→ resize=false
→ rotate=false
``​`

No tocar `Moveable.tsx` ni `Selecto.tsx` en la primera fase. La configuración se resuelve antes de llegar a ellos.

---

## 10.3 Sidebars

### LeftSidebar

``​`txt
sidebars.left.enabled
sidebars.left.defaultOpen
sidebars.left.catalogLayout
sidebars.left.allowCustomFields
visibility.sidebars.left.*
``​`

Reglas:

``​`txt
enabled=false
→ no montar catálogo ni listeners de drag

visible=false
→ no renderizar panel, pero puede conservar API programática

customFields efectivo =
  sidebar habilitado
  && allowCustomFields
  && visibility.customFields
``​`

### RightSidebar

``​`txt
sidebars.right.enabled
sidebars.right.defaultPanel
sidebars.right.panels
sidebars.right.density
sidebars.right.showCollapsedButton
visibility.sidebars.right.*
``​`

Reglas:

``​`txt
panel efectivo =
  incluido en sidebars.right.panels
  && visible en visibility.sidebars.right.panels
  && soportado por runtime
``​`

El botón de colapso efectivo:

``​`txt
sidebar habilitado
&& visibility.collapseButton
&& showCollapsedButton
``​`

Actualmente esos flags pueden contradecirse; el servicio debe resolverlos.

---

## 10.4 Schemas y plugins

### Configuración actual

``​`txt
schemas.enabledTypes
schemas.autoAttachIdentity
schemas.validateUniqueNames
schemas.defaultOwnerStrategy
schemas.plugins
visibility.schemas.catalog
visibility.schemas.canvas
visibility.schemas.inspector
visibility.schemas.runtime
``​`

### Semántica

``​`txt
enabledTypes
→ tipos permitidos funcionalmente

visibility.schemas.catalog
→ visibles en catálogo

visibility.schemas.canvas
→ visibles en Designer

visibility.schemas.inspector
→ configurables en DetailView

visibility.schemas.runtime
→ visibles en Form/Viewer
``​`

Ocultar del catálogo no debe eliminar un schema existente del canvas ni del snapshot.

### Continuidad

Crear:

``​`txt
SchemaCapabilityResolver
SchemaConfigurationProfile
SchemaVisibilitySelector
``​`

Cada schema debe consultar un único perfil efectivo.

---

## 10.5 Inspector

### Configuración actual

``​`txt
inspector.visible
showEmptySections
showAdvanced
showTechnical
showCollaboration
showComments
sections
fields
fieldsBySchemaType
``​`

### Orden de resolución

``​`txt
inspector.visible
→ sección visible
→ campo visible global
→ campo visible para schemaType
→ widget soportado
→ access state permite editar
``​`

La visibilidad no determina editabilidad.

El widget puede estar:

``​`txt
visible + editable
visible + readonly con razón
oculto
no soportado
``​`

---

## 10.6 Acciones y CommandBus

Cada acción debe pasar por:

``​`txt
ActionRegistry
→ ConfigService.getActionState
→ permisos
→ selección/contexto
→ schemaAccessState
→ CommandBus
``​`

Eliminar gradualmente lecturas directas como:

``​`txt
options.visibility.actions.delete
options.assignment.enabled
collaborationContext.canEditStructure
``​`

dentro de botones individuales.

El estado final debe incluir:

``​`ts
{
  visible,
  enabled,
  executable,
  reason,
  commandId,
}
``​`

---

## 10.7 Recipients, colaboración y asignación

### Fuente única

``​`txt
RecipientRegistry
``​`

El host registra recipients una sola vez.

### Destinatario activo canónico

``​`txt
recipients.activeRecipientId
``​`

`collaboration.activeRecipientId` queda como alias legacy.

### Reasignación efectiva

``​`txt
assignment.enabled
&& allowSingle/allowBulk según selección
&& visibility.actions.reassign
&& visibility.modals.assignment
&& collaboration.canEditStructure
&& recipients disponibles
&& schemas reasignables
``​`

La acción no debe reimplementar esa fórmula en `ListViewToolbar`, Canvas y DetailView.

---

## 10.8 Documentos

### Configuración actual

``​`txt
documents.mode
documents.preserveDocumentSchemaRouting
documents.activeDocumentStrategy
visibility.sidebars.right.panels.documents
``​`

### Reglas

- `mode=single`: panel Documentos puede ocultarse por falta de utilidad.
- `mode=multi`: `documentId`, `pageNumber` y routing son obligatorios.
- `activeDocumentStrategy=host`: el controller emite solicitud de cambio; no modifica silenciosamente el host.
- `activeDocumentStrategy=internal`: el core controla la navegación.

Cambiar visibilidad del panel nunca debe cambiar el routing.

---

## 10.9 Comentarios

Actualmente comentarios dependen principalmente de visibilidad.

Agregar contrato de comportamiento:

``​`ts
comments?: {
  enabled?: boolean;
  allowDocumentComments?: boolean;
  allowPageComments?: boolean;
  allowSchemaComments?: boolean;
  allowResolve?: boolean;
  allowReopen?: boolean;
}
``​`

Reglas:

``​`txt
comments.enabled=false
→ no registrar overlays, modal ni comandos

comments.enabled=true + panel visible=false
→ comentarios disponibles por API/CommandBus
``​`

---

## 10.10 Firmas

### Configuración actual

``​`txt
signatures.enabled
signatures.defaultMode
signatures.providers
``​`

### Reglas

- `enabled=false`: no registrar schemas signing-based configurables.
- `defaultMode=provider`: requiere al menos un provider válido.
- modos `draw`, `image`, `p12` y `provider` tienen capabilities distintas.
- el provider externo pertenece al adapter/host; no al schema base.
- Designer conserva placeholder compacto.
- Form ejecuta la interacción habilitada.
- Viewer solo representa.

El servicio debe explicar configuraciones inválidas, por ejemplo:

``​`txt
signature provider deshabilitado:
defaultMode=provider pero providers está vacío
``​`

---

## 10.11 Persistencia y snapshot

### Configuración actual

``​`txt
persistence.mode
persistence.autosave
persistence.serializeSnapshot
``​`

### Reglas

``​`txt
mode=none
→ sin load/save automático

mode=local
→ requiere adapter local

mode=host
→ requiere callbacks o adapter host

autosave=true
→ requiere persistence habilitada
``​`

El snapshot debe conservar:

``​`txt
documents
schemas
recipients
assignments
ownership
comments
signature config
metadata
version
``​`

La configuración visual temporal no debe contaminar el snapshot del documento.

---

## 10.12 Eventos

El `EventHub` debe ser estable por Provider.

Cada evento puede estar:

``​`txt
false
→ deshabilitado

'host'
→ se emite al bridge público

function
→ se ejecuta el handler configurado
``​`

Agregar política:

``​`txt
events no deben reconstruirse al cambiar un handler
handlers se almacenan en refs o registro mutable
``​`

---

## 10.13 Tema, densidad y responsive

Rutas canónicas:

``​`txt
theme.density
theme.tokens
ui.visualPreset
ui.layoutPreset
ui.classNames
``​`

La densidad responsiva derivada por ancho debe combinarse así:

``​`txt
densidad efectiva =
  límite configurado por host
  + ajuste responsivo interno
``​`

El resize no debe cambiar la preferencia de layout elegida por el usuario.

---

# 11. Selectores públicos obligatorios

Crear `configSelectors.ts`:

``​`txt
selectRuntimeConfig
selectCanvasConfig
selectLeftSidebarConfig
selectRightSidebarConfig
selectInspectorConfig
selectSchemaConfig(type)
selectRecipientConfig
selectAssignmentConfig
selectDocumentsConfig
selectSignatureConfig
selectPersistenceConfig
selectVisibility
selectFeatureState(id, context)
selectActionState(id, context)
selectComponentState(id, context)
``​`

Los componentes no deben recibir el objeto completo cuando solo necesitan un fragmento.

---

# 12. Integración React

## 12.1 Extender `SisadPdfmeProvider`

El Provider debe crear y conservar:

``​`txt
configService
recipientRegistry
``​`

Nuevo valor:

``​`ts
export type SisadPdfmeProviderValue = {
  configService: SisadPdfmeConfigService;
  config: ResolvedSisadPdfmeConfig;
  recipientRegistry: SisadPdfmeRecipientRegistry;
};
``​`

`config` se conserva temporalmente por compatibilidad.

## 12.2 Hooks

``​`txt
useSisadPdfmeConfigService()
useSisadPdfmeConfig(selector?)
useSisadPdfmeFeature(featureId, context?)
useSisadPdfmeAction(actionId, context?)
useSisadPdfmeComponent(componentId, context?)
``​`

## 12.3 External store

Usar una suscripción compatible con React:

``​`txt
useSyncExternalStore
``​`

Así se evitan rerenders de todo el diseñador cuando cambia un flag de una sola sección.

---

# 13. Migración del mapa `designerUiConfig`

`designerUiConfig.ts` no debe eliminarse de inmediato.

## Etapa puente

``​`txt
buildDesignerUiMap(options)
→ adapter legacy
→ usa selectores puros compartidos
``​`

## Estado final

``​`txt
useDesignerUiConfig()
→ consulta SisadPdfmeConfigService
→ no lee OptionsContext como unknown
→ no vuelve a inferir configuración
``​`

`OptionsContext` puede seguir recibiendo `runtimeOptions` para compatibilidad con internals legacy, pero no será la fuente primaria para nuevas funcionalidades.

---

# 14. Plan de implementación por fases

## Fase 0 — Baseline y congelamiento

Crear:

``​`txt
reports/configuration/
├── config-sources-audit.md
├── direct-config-readers.txt
├── duplicate-config-paths.md
├── current-public-api.md
├── behavior-matrix.md
└── visual-functional-baseline.md
``​`

Buscar:

``​`bash
rg "options\.(visibility|assignment|sidebars|canvas|schemas|collaboration)" src/sisad-pdfme
rg "visibility\?\.|visibility\." src/sisad-pdfme
rg "canEditStructure|assignment\.enabled|showCollapsedButton|defaultPanel" src/sisad-pdfme
rg "useContext\(OptionsContext\)" src/sisad-pdfme
rg "createSisadPdfmeConfig|resolveSisadPdfmeConfig" src/sisad-pdfme
``​`

Cierre:

``​`txt
Existe un mapa componente/acción → rutas de configuración actuales.
No se modifica comportamiento.
``​`

---

## Fase 1 — Reparar API pública

Modificar:

``​`txt
src/sisad-pdfme/config/index.ts
src/sisad-pdfme/config/SisadPdfmeConfig.ts
src/sisad-pdfme/integration/index.ts
src/sisad-pdfme/react/index.ts
``​`

Restaurar exportaciones:

``​`txt
resolveSisadPdfmeConfig
ResolvedSisadPdfmeConfig
SisadPdfmeVisibilityConfig
SisadPdfmeUiConfig
SisadPdfmeDocument
SisadPdfmeEventName
SisadPdfmeEventHandlers
SisadPdfmeRecipientsAdapter
SisadPdfmeDocumentsAdapter
SisadPdfmePersistenceAdapter
SisadPdfmeSignatureProviderAdapter
SisadPdfmeProviderProps
SisadPdfmeProviderValue
``​`

Eliminar el `;` aislado.

Cierre:

``​`txt
El host puede tipar toda la configuración pública sin imports profundos.
``​`

---

## Fase 2 — Config v2 y migración legacy

Crear:

``​`txt
configMigration.ts
configValidation.ts
``​`

Agregar:

``​`ts
configVersion?: 2;
``​`

Migrar:

``​`txt
ui.visibility → visibility
ui.density → theme.density
ui.sidebars.left.defaultOpen → sidebars.left.defaultOpen
ui.sidebars.left.catalogLayout → sidebars.left.catalogLayout
ui.sidebars.right.defaultOpen → nuevo sidebars.right.defaultOpen
ui.sidebars.right.defaultPanel → sidebars.right.defaultPanel
collaboration.activeRecipientId → recipients.activeRecipientId
``​`

La config canónica gana sobre el alias legacy.

Cierre:

``​`txt
La misma entrada siempre produce una única configuración canónica.
Warnings solo en debug/development.
``​`

---

## Fase 3 — Implementar `SisadPdfmeConfigService`

Crear:

``​`txt
SisadPdfmeConfigService.ts
configSelectors.ts
configChangeImpact.ts
``​`

Criterios:

``​`txt
No muta la entrada.
Mantiene snapshot estable.
Soporta subscribe/unsubscribe.
Agrupa cambios por transaction.
No recrea EventHub por cambio visual.
Clasifica el impacto de cada patch.
``​`

---

## Fase 4 — Registry de features, componentes y acciones

Crear:

``​`txt
featureRegistry.ts
featureDependencies.ts
componentRegistry.ts
actionConfigRegistry.ts
``​`

Registrar primero:

``​`txt
canvas
sidebars
right panels
assignment
acciones existentes
inspector
documents
comments
signatures
``​`

Cierre:

``​`txt
Toda feature devuelve estado efectivo y razón.
No hay if/else masivo dentro de componentes.
``​`

---

## Fase 5 — Integrar Provider y wrappers

Modificar:

``​`txt
SisadPdfmeProvider.tsx
useSisadPdfmeConfig.ts
useSisadPdfmeRecipientRuntime.ts
SisadPdfmeDesigner.tsx
SisadPdfmeForm.tsx
SisadPdfmeViewer.tsx
``​`

Cierre:

``​`txt
Una instancia de service por Provider.
Un RecipientRegistry por Provider.
Un EventHub por Provider.
Wrappers reutilizan los mismos recursos.
``​`

---

## Fase 6 — Migrar acciones y sidebars

Orden:

``​`txt
1. RightSidebar actions
2. ListViewToolbar
3. DetailView actions
4. Canvas contextual actions
5. LeftSidebar
6. RightSidebar panels
7. Sidebar collapse handles
``​`

Regla:

``​`txt
Los componentes consultan useSisadPdfmeAction/useSisadPdfmeComponent.
``​`

No tocar:

``​`txt
Moveable
Selecto
coordinateMath
paper geometry
snapshot
generator
``​`

---

## Fase 7 — Migrar Canvas e interacción

Integrar selectores para:

``​`txt
select
multiSelect
move
resize
rotate
guides
snapLines
contextMenu
floatingToolbar
keyboard shortcuts
modal suspension
``​`

Primero pasar flags resueltos a componentes existentes. No reescribir algoritmos.

---

## Fase 8 — Migrar schemas e inspector

Implementar:

``​`txt
SchemaConfigurationProfile
SchemaCapabilityResolver
InspectorConfigurationResolver
``​`

Cada familia consume el perfil compartido:

``​`txt
text-like
option-based
signing-based
action-based
media
barcodes
tables
shapes
custom
``​`

---

## Fase 9 — Colaboración, documentos, comentarios y firmas

Cerrar dependencias cruzadas:

``​`txt
recipients ↔ collaboration
collaboration ↔ permissions
assignment ↔ actions/modals
documents ↔ routing/panels
comments ↔ panel/modal/overlays
signatures ↔ schemas/providers/runtime mode
``​`

---

## Fase 10 — Configuración dinámica

Exponer en controller:

``​`ts
getConfig(): ResolvedSisadPdfmeConfig;
updateConfig(patch, options?): SisadPdfmeConfigChangeResult;
resetConfig(): void;
getFeatureState(id, context?): SisadPdfmeFeatureState;
explainConfiguration(id, context?): SisadPdfmeConfigurationExplanation;
``​`

Los cambios calientes se aplican sin perder:

``​`txt
selección
zoom
scroll
página
documento activo
panel activo cuando siga permitido
inline edit cuando no haya conflicto
``​`

---

## Fase 11 — Documentación y ejemplos

Actualizar:

``​`txt
docs/07-integraciones/05-global-config.md
docs/03-designer/02-props.md
docs/03-designer/11-action-contract.md
docs/04-schemas/09-inspector-contract.md
docs/13-ejemplos/04-dynamic-host-integration-examples.md
docs/10-testing-qa/02-regression-matrix.md
``​`

Crear ejemplos:

``​`txt
config/minimal-designer
config/full-designer
config/reviewer-readonly
config/form-recipient
config/multi-document
config/no-collaboration
config/provider-signature
config/dynamic-feature-toggle
``​`

---

# 15. Task-cards recomendadas

``​`txt
CONFIG-001 — Reparar exports públicos
CONFIG-002 — Auditar fuentes de configuración
CONFIG-003 — Canonicalizar Config v2
CONFIG-004 — Crear migrador legacy
CONFIG-005 — Crear validador de configuración
CONFIG-006 — Implementar ConfigService
CONFIG-007 — Implementar selectores
CONFIG-008 — Crear FeatureRegistry
CONFIG-009 — Crear ActionConfigRegistry
CONFIG-010 — Integrar SisadPdfmeProvider
CONFIG-011 — Migrar RightSidebar/ListView
CONFIG-012 — Migrar LeftSidebar
CONFIG-013 — Migrar Canvas flags
CONFIG-014 — Migrar Inspector
CONFIG-015 — Migrar Schema profiles
CONFIG-016 — Unificar assignment/collaboration
CONFIG-017 — Configurar documents/comments
CONFIG-018 — Configurar signatures
CONFIG-019 — Configuración dinámica y controller
CONFIG-020 — Matriz QA y documentación
``​`

Cada task-card debe limitarse a:

``​`txt
máximo 8 archivos leídos inicialmente
máximo 5 archivos modificados
máximo 2 rondas de búsqueda
un solo dominio por tarea
``​`

---

# 16. Pruebas obligatorias

## 16.1 Unitarias

``​`txt
defaults completos
merge profundo sin mutación
arrays reemplazados, no concatenados accidentalmente
precedencia canónica sobre legacy
migración de aliases
validación de combinaciones inválidas
feature dependencies
action state con razón
change impact
subscribe/unsubscribe
transaction emite una sola actualización
``​`

## 16.2 Contrato

``​`txt
createSisadPdfmeConfig() funcional sin argumentos
API pública no requiere imports internos
config serializable cuando no contiene handlers
tipos públicos accesibles
misma entrada produce misma config canónica
``​`

## 16.3 Integración React

``​`txt
un service por Provider
un RecipientRegistry por Provider
wrappers comparten recursos
cambio visual no recrea EventHub
cambio de recipients no crea registry paralelo
useSyncExternalStore actualiza solo consumidores relevantes
``​`

## 16.4 Playwright

Escenarios:

``​`txt
deshabilitar LeftSidebar
ocultar LeftSidebar sin desactivar comandos
deshabilitar RightSidebar
habilitar solo panel Fields
habilitar Fields + Detail
activar Comments y Documents
deshabilitar Moveable manteniendo selección
deshabilitar Selecto manteniendo click simple
readonly permite inspeccionar y bloquea mutación
ocultar Delete
mostrar Delete deshabilitado con razón
activar/desactivar Reassign
cambiar densidad sin perder selección
cambiar layout sin perder zoom
cambiar flags calientes sin remount
cambiar runtime.mode con remount controlado
``​`

---

# 17. Quality gates

``​`bash
npm run lint
npm run build
npx vitest run
npx playwright test tests/playwright/configuration
npm run quality:duplicate-functions
npm run quality:dead-code
``​`

Añadir un gate específico:

``​`txt
Ningún componente nuevo puede leer directamente:
options.visibility
options.assignment
options.sidebars
options.canvas
options.schemas
``​`

Debe usar el servicio o un selector autorizado.

---

# 18. Criterios de cierre generales

La continuidad queda completada cuando:

``​`txt
[ ] Existe una sola configuración canónica por Provider.
[ ] `ui.visibility`, `ui.sidebars` y `ui.density` ya no son fuentes activas.
[ ] Todos los recursos compartidos son estables.
[ ] Todos los componentes consultan selectores.
[ ] Todas las acciones tienen visible/enabled/executable/reason.
[ ] Habilitar y mostrar son conceptos separados.
[ ] Los permisos no se confunden con visibilidad.
[ ] Los schemas usan perfiles de configuración por familia.
[ ] Recipients se registran una sola vez.
[ ] El host no importa internals.
[ ] Configuración dinámica no pierde selección, zoom, scroll ni routing.
[ ] Legacy sigue funcionando durante la ventana de migración.
[ ] No se toca geometría de Canvas/Moveable/Selecto para implementar flags.
[ ] Existe documentación y matriz de pruebas por comportamiento.
``​`

---

# 19. Ejemplo objetivo de configuración

``​`ts
const config = createSisadPdfmeConfig({
  configVersion: 2,

  runtime: {
    mode: 'designer',
    readonly: false,
    isolateDomEvents: true,
    preserveSelectionOnModalClose: true,
  },

  theme: {
    density: 'compact',
    strategy: 'tailwind',
  },

  ui: {
    visualPreset: 'classic-designer',
    layoutPreset: 'three-panel',
    gap: '0.5rem',
    padding: '0.5rem',
  },

  canvas: {
    enabled: true,
    selecto: true,
    moveable: true,
    multiSelect: true,
    guides: true,
    snapLines: true,
    suspendWhenModalOpen: true,
    transform: {
      move: true,
      resize: true,
      rotate: true,
    },
  },

  sidebars: {
    left: {
      enabled: true,
      defaultOpen: true,
      catalogLayout: 'list',
      allowCustomFields: false,
    },
    right: {
      enabled: true,
      defaultOpen: true,
      defaultPanel: 'fields',
      panels: ['fields', 'detail', 'documents'],
      density: 'compact',
      showCollapsedButton: true,
    },
  },

  recipients: {
    enabled: true,
    activeRecipientId: null,
    allowUnassigned: true,
    colorStrategy: 'recipient',
  },

  collaboration: {
    enabled: true,
    canEditStructure: true,
    ownerColorStrategy: 'recipient',
  },

  assignment: {
    enabled: true,
    allowSingle: true,
    allowBulk: true,
    searchable: true,
    preserveLockState: true,
  },

  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'internal',
  },

  comments: {
    enabled: false,
  },

  signatures: {
    enabled: true,
    defaultMode: 'draw',
    providers: [],
  },

  persistence: {
    mode: 'host',
    autosave: false,
    serializeSnapshot: true,
  },

  visibility: {
    sidebars: {
      left: {
        visible: true,
        search: true,
        tabs: true,
        catalog: true,
        customFields: false,
      },
      right: {
        visible: true,
        panels: {
          fields: true,
          detail: true,
          comments: false,
          documents: true,
        },
      },
    },
    actions: {
      reassign: true,
      delete: true,
      duplicate: true,
      copy: true,
      paste: true,
      hide: false,
    },
    inspector: {
      visible: true,
      showAdvanced: false,
      showTechnical: false,
      showCollaboration: true,
      showComments: false,
    },
  },
});
``​`

---

# 20. Resultado esperado

Al finalizar, el host debe poder configurar SISAD PDFME sin conocer:

``​`txt
Canvas
Moveable
Selecto
RightSidebar
ListView
DetailView
SchemaAssignmentDialog
OptionsContext
designerUiConfig
visibilityConfig
schemaAssignmentService
DesignerEngineBuilder
``​`

El core será responsable de traducir la configuración raíz en:

``​`txt
componente montado o no montado
componente visible u oculto
acción habilitada o deshabilitada
permiso concedido o denegado
comportamiento disponible o no disponible
estado activo
motivo de bloqueo
actualización caliente, rebuild o remount
``​`

Esa es la continuidad correcta para convertir `src/sisad-pdfme` en un componente configurable, portable, predecible y reutilizable.
