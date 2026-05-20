# Mapa de módulos y responsabilidades

> Documentación generada para consumo externo de `sisad-pdfme`.

## Entry points principales
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

## Responsabilidades
| Módulo | Responsabilidad | Riesgo al tocar |
| --- | --- | --- |
| `common` | Contratos, zod schemas, helpers, comentarios y colaboración compartida. | Romper compatibilidad entre UI y generator. |
| `schemas` | Plugins, familias, registry, defaults y propPanels. | Ver campo en UI pero no en PDF final. |
| `ui` | Runtimes, canvas, sidebars, overlays, engine y command bus. | Render loops, selección rota o API inestable. |
| `generator` | Generación final de PDF. | Diferencia entre preview y PDF generado. |
| `converter` | PDF a imagen/tamaño e imagen a PDF. | Previews lentos o geometría inestable. |
| `assignments` | Ruteo por recipient/file/page. | Campos en documento o usuario equivocado. |
| `comments` | Comentarios, anchors, replies y resolved. | Comentarios perdidos/desanclados. |
| `commands` | Acciones comunes para toolbar/context menu/shortcuts. | Funcionalidades duplicadas o colisiones. |
