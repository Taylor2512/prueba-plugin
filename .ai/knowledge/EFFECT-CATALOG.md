# Catálogo de efectos

| ID | Efecto | Owner | Propósito |
|---|---|---|---|
| FX-001 | `focus.restore` | DesignerEffectCoordinator | Restaurar foco tras modal/panel/acción |
| FX-002 | `interaction.suspend` | InteractionMachine | Suspender Moveable/Selecto/shortcuts |
| FX-003 | `interaction.resume` | InteractionMachine | Reactivar interacción sin perder selección |
| FX-004 | `viewport.preserve` | ViewportAnchorService | Preservar página/zoom/scroll al cambiar layout |
| FX-005 | `canvas.navigate` | CanvasNavigationService | Localizar y enfocar schema |
| FX-006 | `persistence.save` | PersistenceEffect | Guardar revisión mediante adapter |
| FX-007 | `persistence.autosave` | PersistenceEffect | Autosave cancelable/debounced |
| FX-008 | `accessibility.announce` | AccessibilityEffect | Emitir live-region |
| FX-009 | `feedback.drop` | DesignerFeedbackEffect | Flash de drop/commit |
| FX-010 | `feedback.drag-preview` | DragFeedbackEffect | Preview visual de drag |
| FX-011 | `overlay.tooltip` | TooltipPrimitive | Tooltip accesible/collision-aware |
| FX-012 | `resource.object-url-revoke` | ResourceCleanupEffect | Revocar URL temporal |
| FX-013 | `event.subscribe` | EventDispatcherLifecycle | Registrar listener |
| FX-014 | `event.unsubscribe` | EventDispatcherLifecycle | Limpiar listener |
| FX-015 | `viewport.observe` | ViewportEffect | ResizeObserver y densidad |
| FX-016 | `clipboard.read` | ClipboardAdapter | Leer clipboard browser |
| FX-017 | `clipboard.write` | ClipboardAdapter | Escribir clipboard browser |
| FX-018 | `artifact.generate` | ArtifactsEffect | Generar PDF con preflight |
| FX-019 | `artifact.convert` | ArtifactsEffect | PDF/images conversion |
| FX-020 | `diagnostic.capture` | DiagnosticsEffect | Guardar evidencia resumida |
