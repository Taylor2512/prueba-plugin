# Contexto del proyecto `sisad-pdfme`

## Resumen

`sisad-pdfme` es un fork de edición PDF orientado a construir un runtime documental aislado, configurable y reusable. Su núcleo se encuentra en `src/sisad-pdfme`.

## Módulos detectados

- `assignments`
- `canvas`
- `collaboration`
- `commands`
- `comments`
- `common`
- `context`
- `contracts`
- `converter`
- `documents`
- `editor`
- `externalForms`
- `generator`
- `pdf-lib`
- `schemas`
- `shared`
- `ui`

## Rutas relevantes

### Código principal

- `src/sisad-pdfme/assignments/index.ts`
- `src/sisad-pdfme/canvas/canvasRenderState.ts`
- `src/sisad-pdfme/canvas/overlayManager.ts`
- `src/sisad-pdfme/canvas/useCanvasRenderState.ts`
- `src/sisad-pdfme/collaboration/index.ts`
- `src/sisad-pdfme/collaboration/lockManager.ts`
- `src/sisad-pdfme/collaboration/schemaLockGuard.ts`
- `src/sisad-pdfme/commands/index.ts`
- `src/sisad-pdfme/comments/index.ts`
- `src/sisad-pdfme/common/collaboration.ts`
- `src/sisad-pdfme/common/comments.ts`
- `src/sisad-pdfme/common/constants.ts`
- `src/sisad-pdfme/common/dynamicTemplate.ts`
- `src/sisad-pdfme/common/expression.ts`
- `src/sisad-pdfme/common/helper.ts`
- `src/sisad-pdfme/common/index.ts`
- `src/sisad-pdfme/common/pluginRegistry.ts`
- `src/sisad-pdfme/common/schema.ts`
- `src/sisad-pdfme/common/types.ts`
- `src/sisad-pdfme/common/version.ts`
- `src/sisad-pdfme/context/RecipientContext.ts`
- `src/sisad-pdfme/contracts/assignments.ts`
- `src/sisad-pdfme/contracts/commands.ts`
- `src/sisad-pdfme/contracts/comments.ts`
- `src/sisad-pdfme/contracts/index.ts`
- `src/sisad-pdfme/contracts/plugins.ts`
- `src/sisad-pdfme/contracts/schema.ts`
- `src/sisad-pdfme/converter/img2pdf.ts`
- `src/sisad-pdfme/converter/index.browser.ts`
- `src/sisad-pdfme/converter/index.node.ts`
- `src/sisad-pdfme/converter/index.ts`
- `src/sisad-pdfme/converter/modules.d.ts`
- `src/sisad-pdfme/converter/pdf2img.ts`
- `src/sisad-pdfme/converter/pdf2size.ts`
- `src/sisad-pdfme/converter/types.d.ts`
- `src/sisad-pdfme/documents/index.ts`
- `src/sisad-pdfme/editor/index.ts`
- `src/sisad-pdfme/externalForms/externalFormRunner.ts`
- `src/sisad-pdfme/generator/constants.ts`
- `src/sisad-pdfme/generator/generate.ts`
- `src/sisad-pdfme/generator/helper.ts`
- `src/sisad-pdfme/generator/index.ts`
- `src/sisad-pdfme/generator/types.ts`
- `src/sisad-pdfme/pdf-lib/index.ts`
- `src/sisad-pdfme/schemas/constants.ts`
- `src/sisad-pdfme/schemas/index.ts`
- `src/sisad-pdfme/schemas/modules.d.ts`
- `src/sisad-pdfme/schemas/schemaBuilder.ts`
- `src/sisad-pdfme/schemas/schemaFamilies.ts`
- `src/sisad-pdfme/schemas/utils.ts`
- `src/sisad-pdfme/shared/commandTypes.ts`
- `src/sisad-pdfme/shared/index.ts`
- `src/sisad-pdfme/shared/interactionGuards.ts`
- `src/sisad-pdfme/shared/keyboardShortcuts.ts`
- `src/sisad-pdfme/shared/localFormStorage.ts`
- `src/sisad-pdfme/shared/localMode.ts`
- `src/sisad-pdfme/shared/localSnapshotStore.ts`
- `src/sisad-pdfme/shared/schemaDesignerMeta.ts`
- `src/sisad-pdfme/shared/schemaMigration.ts`
- `src/sisad-pdfme/shared/signatureRegistry.ts`
- `src/sisad-pdfme/shared/snapshot.ts`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/shared/templateValidator.ts`
- `src/sisad-pdfme/ui/class.ts`
- `src/sisad-pdfme/ui/collaboration.ts`
- `src/sisad-pdfme/ui/collaborationContext.ts`
- `src/sisad-pdfme/ui/constants.ts`
- `src/sisad-pdfme/ui/contexts.ts`
- `src/sisad-pdfme/ui/Designer.tsx`
- `src/sisad-pdfme/ui/designerEngine.ts`
- `src/sisad-pdfme/ui/Form.tsx`
- `src/sisad-pdfme/ui/helper.ts`
- `src/sisad-pdfme/ui/hooks.ts`
- `src/sisad-pdfme/ui/i18n.ts`
- `src/sisad-pdfme/ui/index.ts`
- `src/sisad-pdfme/ui/theme.ts`
- `src/sisad-pdfme/ui/types.ts`
- `src/sisad-pdfme/ui/Viewer.tsx`
- `src/sisad-pdfme/pdf-lib/api/colors.ts`
- `src/sisad-pdfme/pdf-lib/api/Embeddable.ts`

### Tests detectados

- `tests/playwright/canvas-interactions.spec.ts`
- `tests/playwright/multiuser-collaboration.spec.ts`
- `tests/playwright/pdfme-editor.spec.ts`
- `tests/playwright/runtime-guard.ts`
- `tests/playwright/shortcuts.spec.ts`
- `tests/unit/actionRegistry.test.ts`
- `tests/unit/appRoutes.test.tsx`
- `tests/unit/changeSchemas.test.ts`
- `tests/unit/checkboxSchema.test.ts`
- `tests/unit/collaboration.test.ts`
- `tests/unit/collaborationAllFunctions.test.ts`
- `tests/unit/collaborationAssignmentsAndComments.test.ts`
- `tests/unit/collaborationContext.test.ts`
- `tests/unit/collaborationContextAllFunctions.test.ts`
- `tests/unit/collaborationRuntimeAllFunctions.test.ts`
- `tests/unit/collaborationSync.test.ts`
- `tests/unit/commandBus.test.ts`
- `tests/unit/commandsIndex.test.ts`
- `tests/unit/commentModel.test.ts`
- `tests/unit/commentsRail.test.tsx`
- `tests/unit/compactConfigPanel.test.tsx`
- `tests/unit/designerCoordinateService.test.ts`
- `tests/unit/designerEngine.test.ts`
- `tests/unit/designerEngineBuilderAllMethods.test.ts`
- `tests/unit/designerEngineContracts.test.ts`
- `tests/unit/detailHeaderCard.test.tsx`
- `tests/unit/detailSchemas.test.ts`
- `tests/unit/detailSectionCard.test.tsx`
- `tests/unit/detailSectionTaxonomy.test.ts`
- `tests/unit/detailWidgets.test.tsx`
- `tests/unit/dynamicTemplate.test.ts`
- `tests/unit/externalFormRunner.test.ts`
- `tests/unit/fieldCommentsSection.test.ts`
- `tests/unit/generatorHelper.test.ts`
- `tests/unit/inlineEditOverlay.test.tsx`
- `tests/unit/interactionGuards.test.ts`
- `tests/unit/labExamples.test.ts`
- `tests/unit/labShellComponents.test.tsx`
- `tests/unit/labState.test.ts`
- `tests/unit/labTemplate.test.ts`
- `tests/unit/overlayManager.test.ts`
- `tests/unit/radioGroupSchema.test.ts`
- `tests/unit/rightSidebarContextHeader.test.tsx`
- `tests/unit/schemaCollaborationWidget.test.tsx`
- `tests/unit/schemaConnectionsValidation.test.ts`
- `tests/unit/schemaConnectionsWidget.test.tsx`
- `tests/unit/schemaDropSetupModal.test.tsx`
- `tests/unit/schemaFamilies.test.ts`
- `tests/unit/schemaFamiliesAllFunctions.test.ts`
- `tests/unit/schemaIdentity.test.ts`
- `tests/unit/schemaLockEvents.test.ts`
- `tests/unit/schemaRegistryAllFunctions.test.ts`
- `tests/unit/schemaVariableName.test.ts`
- `tests/unit/selectionCommands.test.ts`
- `tests/unit/setupTests.ts`
- `tests/unit/signatureSchema.test.ts`
- `tests/unit/sisad-canvasRenderState.test.ts`
- `tests/unit/sisad-commandBusGuards.test.ts`
- `tests/unit/sisad-commandTypes.test.ts`
- `tests/unit/sisad-guards.test.ts`

## Superficies principales

- `Designer`: edición de plantillas.
- `Form`: llenado interactivo.
- `Viewer`: visualización de solo lectura.
- `Generator`: generación de PDF.
- `Converter`: conversión PDF/imagen/tamaño.
- `Schemas`: plugins y renderers.
- `Canvas`: interacciones, overlays, coordenadas.
- `Snapshot`: persistencia y migración.
- `Commands`: command bus.
- `Comments`: comentarios anclados.
- `Assignments`: ownership y asignación.
