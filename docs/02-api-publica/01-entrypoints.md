# Entry points y exports públicos

> Documentación generada para consumo externo de `sisad-pdfme`.

## Matriz de API pública
| Paquete | Archivo | Exports | Principales |
| --- | --- | --- | --- |
| @sisad-pdfme/ui | src/sisad-pdfme/ui/index.ts | 10 | Designer, DesignerEngineBuilder, Form, PdfEditor, PdfEditorEngineBuilder, PdfFormView, PdfViewer, Viewer, applyCollaborationEvent, useCollaborationSync |
| @sisad-pdfme/common | src/sisad-pdfme/common/index.ts | 55 | BLANK_A4_PDF, BLANK_PDF, CUSTOM_A4_PDF, DEFAULT_FONT_NAME, MM_TO_PT_RATIO, PDFME_VERSION, PT_TO_MM_RATIO, PT_TO_PX_RATIO, SHARED_ASSIGNMENTS_BUCKET, ZOOM, addAnchorToSchema, addCommentToSchema, addCommentWithAnchorToTemplate, b64toUint8Array, buildSchemaAssignments, buildUserRecipientAssignments, buildUserSchemaAssignments, checkDesignerProps, checkFont, checkGenerateProps, checkInputs, checkPreviewProps, checkTemplate, checkUIOptions… |
| @sisad-pdfme/schemas | src/sisad-pdfme/schemas/index.ts | 51 | addAlphaToHex, barcodes, builtInFields, builtInPlugins, builtInSchemaDefinitions, builtInSchemaDefinitionsByType, changeSchemas, checkbox, convertForPdfLayoutProps, createDefaultSchema, createLucideIcon, createSchemaBuilder, createSchemaInspectorConfig, createSchemaPlugin, createSvgStr, date, dateTime, ellipse, flatSchemaPlugins, flattenSchemaPlugins, generateUniqueSchemaName, getBuiltInFields, getDynamicHeightsForTable, getSchemaDefinition… |
| @sisad-pdfme/generator | src/sisad-pdfme/generator/index.ts | 5 | buildDynamicTemplate, generate, generatePdf, generatePdfBuffer, validateRequiredFields |
| @sisad-pdfme/converter | src/sisad-pdfme/converter/index.browser.ts | 3 | img2pdf, pdf2img, pdf2size |
| @sisad-pdfme/assignments | src/sisad-pdfme/assignments/index.ts | 12 | buildFileAssignments, buildPageAssignments, buildRecipientAssignments, buildSchemaAssignments, buildUserSchemaAssignments, getAssignmentsForFile, getAssignmentsForPage, getAssignmentsForRecipient, moveSchemaAssignment, reconcileAssignments, removeSchemaFromAssignments, validateAssignmentsConsistency |
| @sisad-pdfme/comments | src/sisad-pdfme/comments/index.ts | 18 | addAnchorToSchema, addCommentToSchema, addCommentWithAnchorToTemplate, attachCommentToField, createSchemaComment, createSchemaCommentAnchor, deleteCommentFromSchema, detachCommentFromField, filterCommentsByFileAndPage, findSchemaByUid, getCommentsForDocument, getCommentsForPage, getCommentsForSchema, moveCommentAnchor, reopenComment, resolveCommentInSchema, resolveTopLevelComment, updateCommentInSchema |
| @sisad-pdfme/commands | src/sisad-pdfme/commands/index.ts | 13 | CommandBus, buildTopLevelCommentEntry, commentCommands, createCommandBus, createCommentCommandEvent, createPageSnapshotCommand, createSelectionCommands, createTemplateSnapshotCommand, documentCommands, emitInlineEditRequest, registerDesignerCommands, schemaCommands, setInlineEditRequestHandler |

## Import mínimo
```ts
import { Designer, Form, Viewer, DesignerEngineBuilder } from '@sisad-pdfme/ui';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';
import { generate } from '@sisad-pdfme/generator';
import { pdf2img, pdf2size, img2pdf } from '@sisad-pdfme/converter';
```

## Aliases de dominio detectados
El entrypoint UI puede exponer aliases como:

```ts
PdfEditor              // Designer
PdfFormView            // Form
PdfViewer              // Viewer
PdfEditorEngineBuilder // DesignerEngineBuilder
```

## Regla
Todo lo que se espere consumir desde otro proyecto debe aparecer aquí. Si una funcionalidad solo existe dentro de `components/Designer/...`, debe exportarse mediante una API estable o quedarse como interna.
