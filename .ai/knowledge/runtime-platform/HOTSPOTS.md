# Runtime architecture hotspots

## Configuration

- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts`
- `src/sisad-pdfme/config/SisadPdfmeConfigService.ts`
- `src/sisad-pdfme/config/featureRegistry.ts`
- `src/sisad-pdfme/config/featureDependencies.ts`
- `src/sisad-pdfme/config/actionConfigRegistry.ts`
- `src/sisad-pdfme/config/componentRegistry.ts`
- `src/sisad-pdfme/config/configChangeImpact.ts`
- `src/sisad-pdfme/config/configSelectors.ts`
- `src/sisad-pdfme/config/schemaCapabilityResolver.ts`

## Designer

- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/snapEngine.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/visibilityConfig.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerActionState.ts`

## Runtime

- `src/sisad-pdfme/ui/Form.tsx`
- `src/sisad-pdfme/react/SisadPdfmePreviewRuntime.tsx`
- `src/sisad-pdfme/runtime/usePdfmeRuntimeInstance.ts`
- `src/sisad-pdfme/runtime/schemaManifest.ts`
- `src/sisad-pdfme/runtime/schemaInteractionState.ts`
- `src/sisad-pdfme/runtime/completionProjection.ts`
- `src/sisad-pdfme/runtime/executionScopeStore.ts`
- `src/sisad-pdfme/runtime/canonicalMerge.ts`
- `src/sisad-pdfme/runtime/executionResult.ts`
- `src/sisad-pdfme/runtime/pdfComposition.ts`

## Schemas

Registry/plugin metadata, codecs, value semantics, Form renderer, Viewer/PDF parity y lifecycle.
