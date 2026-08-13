# Runtime architecture

Componentes observados:

- `artifactEvents.ts`: contrato de artifacts.
- `instanceEventDispatcher.ts`: dispatch único de eventos y callbacks host.
- `options.ts`: construcción/normalización de options.
- `runtimeEventBridge.ts`: compatibilidad/event bridge.
- `runtimeModes.ts`: modos.
- `saveLifecycle.ts`: ciclo save/persistence.
- `usePdfmeArtifacts.ts`: artifacts en React/runtime.
- `usePdfmeRuntimeInstance.ts`: mount, sync, remount, destroy.

Riesgos actuales a caracterizar:

1. `setInputs` externo puede confundirse con evento de usuario.
2. destrucción diferida por timer puede ocultar carreras de render/cleanup.
3. firmas JSON grandes para template pueden ser costosas.
4. callbacks legacy y eventos canónicos pueden duplicarse si no hay origin/revision.
