# Domain — runtime

**Responsabilidad:** Lifecycle de instancias, eventos, artifacts y save.

Snapshot: **8 archivos / 1,416 líneas / 50.2 KB**.

## Hotspots

- `src/sisad-pdfme/runtime/usePdfmeRuntimeInstance.ts` — 316 líneas
- `src/sisad-pdfme/runtime/usePdfmeArtifacts.ts` — 285 líneas
- `src/sisad-pdfme/runtime/instanceEventDispatcher.ts` — 201 líneas
- `src/sisad-pdfme/runtime/runtimeEventBridge.ts` — 164 líneas
- `src/sisad-pdfme/runtime/saveLifecycle.ts` — 147 líneas
- `src/sisad-pdfme/runtime/options.ts` — 145 líneas
- `src/sisad-pdfme/runtime/artifactEvents.ts` — 90 líneas
- `src/sisad-pdfme/runtime/runtimeModes.ts` — 68 líneas

## Regla

No inferir comportamiento solo por nombre de archivo. La task activa debe abrir los símbolos
necesarios y tests/consumidores reales.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Runtime architecture](./ARCHITECTURE.md)
- [Files — runtime](./FILES.md)
<!-- project-tools:navigation:end -->
