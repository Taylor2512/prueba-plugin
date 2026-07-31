# Arquitectura de efectos

## Problema observado

Existen callbacks, event hub, CommandBus, hooks, modal reset y efectos React,
pero no hay un contrato único que distinga:

```txt
estado puro
comando
evento de dominio
efecto externo
feedback visual
callback legacy
```

## Pipeline propuesto

```txt
UI intent
→ Action/Access Policy
→ Command
→ Domain mutation
→ State revision
→ Domain event
→ Effect coordinator
→ focus / scroll / persistence / announcement / visual feedback
→ legacy handler adapter
```

## Efectos permitidos

| Efecto | Propietario |
|---|---|
| restaurar foco | DesignerEffectCoordinator |
| suspender/reactivar interacción | InteractionMachine |
| conservar viewport al abrir panel | ViewportAnchorService |
| desplazar a schema | CanvasNavigationService |
| guardar/autosave | PersistenceEffect |
| emitir live region | AccessibilityEffect |
| flash de drop/commit | DesignerFeedbackEffect |
| drag preview | DragFeedbackEffect |
| tooltip/popover | UI primitive controlada |
| revocar object URL | ResourceCleanupEffect |
| suscribir/desuscribir event hub | EventDispatcher lifecycle |
| ResizeObserver | viewport hook |
| clipboard browser | ClipboardAdapter |

## Efectos prohibidos

```txt
setTimeout para sincronizar selección/modal
window events como fuente de estado principal
body pointerEvents sin cleanup
scrollIntoView disperso en varias superficies
toasts emitidos directamente desde servicios de dominio
callbacks del host desde widgets individuales
z-index como reparación de lifecycle
```

## Estado de interacción objetivo

```txt
idle
hovering
selecting
region-selecting
selected-single
selected-multi
dragging
resizing
rotating
inline-editing
modal-open
commenting
saving
exporting
error-recoverable
```

Cada transición declara:

```txt
guard
command
state patch
event
effects
rollback
```
