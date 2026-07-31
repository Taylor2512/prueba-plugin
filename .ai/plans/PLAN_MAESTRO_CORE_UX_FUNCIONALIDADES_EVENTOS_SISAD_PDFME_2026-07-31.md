# Plan maestro — SISAD PDFME Core UX, funcionalidades, eventos y efectos

**Fecha:** 2026-07-31  
**Alcance de código:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/src/sisad-pdfme`

## Objetivo

Consolidar dentro de `src/sisad-pdfme` las funcionalidades, comportamientos,
eventos, efectos, configuración dinámica y patrones reutilizables que el
Designer, Form y Viewer requieren, sin devolver lógica al host ni recrear el
antiguo módulo de features.

## Estado de partida

El componente ya incluye:

```txt
ConfigService y configuración v2
FeatureRegistry, ActionConfigRegistry y ComponentRegistry
Designer/Form/Viewer públicos
RecipientRegistry
documents, comments, assignments y signatures
CommandBus, shortcuts y selection commands
selectionPolicy, interactionState e interaction reset
LeftSidebar, RightSidebar, DetailView, DocumentsRail y CommentsRail
snapshot, generator y converter
```

El trabajo nuevo no debe crear versiones paralelas de estas piezas.

## Hallazgos prioritarios

### Eventos

- El event hub público acepta `type: string`.
- La configuración expone callbacks `onReady`, `onChange`, `onSave`,
  `onError`, `onSelectionChange`, `onRecipientsChange`,
  `onActiveRecipientChange`, `onAssignmentChange`, `onDocumentChange` y
  `onSignatureRequest`.
- El resolver crea un hub vacío.
- El Designer construye un emisor, pero falta cobertura visible de emisiones.
- Preview/Form/Viewer sí emiten algunos eventos runtime.

Decisión: tipar eventos, crear dispatcher único y conservar un adaptador legacy.

### Acciones

Hay reglas de acción en más de una capa. Las superficies no deben decidir
independientemente visibilidad, enabled, reason ni handler.

Decisión: un action descriptor registry + un selector de estado contextual.

### Interacción y efectos

Existen estados y helpers, pero modal, focus, scroll, feedback, persistence y
event emission no están coordinados por una única arquitectura.

Decisión: state machine/reducer para estado; coordinator para efectos.

### Reasignación

La disponibilidad actual se basa en recipient count; el contrato funcional
requiere más de un recipient asignable, selección y permiso estructural.

### Responsive

LeftSidebar y RightSidebar resuelven densidad y colapso con implementaciones
diferentes. El diseño objetivo necesita rails simétricos y preservación del
viewport.

## Principios

```txt
UI expresa intención.
Policies deciden permiso/disponibilidad.
Commands mutan.
Events describen lo ocurrido.
Effects interactúan con DOM/host.
Snapshot persiste.
Config selecciona comportamientos.
```

## Oleadas

### W0 — Baseline

`COREUX-001..004`

No modificar funcionalidad. Congelar screenshots, capacidades, eventos y
fuentes de verdad.

### W1 — Contratos de eventos, interacción, acceso y acciones

`COREUX-005..012`

Cerrar la arquitectura antes de pulir UI.

### W2 — Toolbar y comandos

`COREUX-013..019`

Restaurar tooltips, page/view commands, save y export con estados y eventos.

### W3 — Workspace y sidebars

`COREUX-020..028`

Responsive, rails, ListView, reassignment, documents y comments.

### W4 — Inspector y schemas

`COREUX-029..041`

Contratos por familia, widgets, opciones, firma, owner chrome y defaults.

### W5 — Canvas, documentos y runtimes

`COREUX-042..051`

Selección, drag/drop, transform, clipboard, snapshot, controller, Form/Viewer,
validation, artifacts y persistence.

### W6 — Calidad y release

`COREUX-052..056`

Responsive/touch, performance, suites, visual regression, documentación y
release.

## Invariantes

- Solo `src/sisad-pdfme/**` recibe cambios productivos.
- Core nuevo en TypeScript/TSX.
- No importar `src/examples`, `src/features` ni `src/modules`.
- No tocar Moveable/Selecto/coordinateMath sin task específica.
- No usar setTimeout para lifecycle.
- No usar z-index arbitrario.
- No crear un segundo snapshot, event bus, action registry o recipient registry.
- `enabled`, `visible`, `permitted`, `available`, `active` y `executable` son distintos.
- Un control visible siempre tiene handler o reason.
- Un evento describe un hecho consumado; una intención entra por Command.
- El host no implementa comportamiento interno.

## Estado Scrum

El sprint actual ya tiene WIP 3:

```txt
UX-001 In review
CONFIG-001 In review
CONFIG-020 In progress
```

Por tanto todas las tarjetas `COREUX-*` nacen en Backlog. `COREUX-001` puede
pasar a Ready solo cuando se libere WIP y después de reconciliar el worktree.

## Métricas de cierre

```txt
0 eventos públicos string libre
0 acciones duplicadas por superficie
0 callbacks de host desde widgets internos
0 tooltips esenciales con title nativo
0 contradicciones access Canvas/List/Inspector
0 pérdida de selection/zoom/scroll al cambiar sidebars
0 remount en cambios presentacionales
100 % de events/effects críticos con tests
150 casos de uso trazados
```
