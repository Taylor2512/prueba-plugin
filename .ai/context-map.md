# Context Map — PDF Designer only

## Runtime

| Área | Archivos orientativos |
|---|---|
| Designer | `src/sisad-pdfme/ui/Designer.tsx` |
| Canvas | `ui/components/Designer/Canvas/*` |
| Paper/Renderer | `ui/components/Paper.tsx`, `Renderer.tsx`, `StaticSchema.tsx` |
| Schemas | `src/sisad-pdfme/schemas/*` |
| DetailView | `ui/components/Designer/RightSidebar/DetailView/*` |
| ListView | `ui/components/Designer/RightSidebar/ListView/*` |
| LeftSidebar | `ui/components/Designer/LeftSidebar*` |
| Overlays | `ui/components/Designer/Canvas/overlays/*` |
| Commands | `ui/commands/*`, `selectionCommands.ts` |
| Snapshot | `shared/snapshotAdapter.ts`, `schemaDesignerMeta.ts` |
| CSS | `ui/styles/*` |

## Límites

El diseñador no implementa negocio SISAD.

Form/Viewer/Generator solo son contrato de compatibilidad.

externalForms no es foco de implementación en esta arquitectura.
