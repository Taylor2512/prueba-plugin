diff --git a/.ai/scrum/SPRINT-CURRENT.md b/.ai/scrum/SPRINT-CURRENT.md
index a2ebd97..b0fca1f 100644
--- a/.ai/scrum/SPRINT-CURRENT.md
+++ b/.ai/scrum/SPRINT-CURRENT.md
@@ -22,5 +22,6 @@ Objetivo: adoptar la arquitectura IA sin interrumpir el desarrollo de SISAD PDFM
 | [QUALITY-001](task-cards/QUALITY-001-jscpd-profiles.md) | Done | coordinator | Sol medium | actual | 3 perfiles reproducibles |
 | [DEDUP-011](task-cards/DEDUP-011-strict-owned-residuals.md) | Done | coordinator | Sol high | actual | owned 4→1; strict 65→62 |
 | [UX-001](task-cards/UX-001-right-sidebar-listview-compactness-and-dnd.md) | In review | claude-opus | Opus 4.8 max | actual | contador único, filtro accesible, delete seguro, overlay alineado; lint/build/unit verdes (36 tests) |
+| [CONFIG-001](task-cards/CONFIG-001-repair-public-config-api.md) | In review | claude-opus | Opus 4.8 max | actual | Fase 1: barrel público restaurado; ~13 errores tsc resueltos, 0 nuevos; lint/build verdes; +3 tests contrato |
 
 WIP máximo: 3; cuentan `In progress` e `In review`. `SPRINT-CURRENT.md` es el único propietario del estado.
diff --git a/src/sisad-pdfme/config/SisadPdfmeConfig.ts b/src/sisad-pdfme/config/SisadPdfmeConfig.ts
index 36b7224..c96bcb9 100644
--- a/src/sisad-pdfme/config/SisadPdfmeConfig.ts
+++ b/src/sisad-pdfme/config/SisadPdfmeConfig.ts
@@ -7,9 +7,7 @@ import type {
   SisadPdfmeRecipientsConfig,
 } from '../recipients/recipientTypes.js';
 
-;
-
-type SisadPdfmeDocument = {
+export type SisadPdfmeDocument = {
   id: string;
   label: string;
   /** Alias del label para consumidores legacy (UploadedPdfDocument.name). */
@@ -92,7 +90,7 @@ export type SisadPdfmeEventName =
   | 'onDocumentChange'
   | 'onSignatureRequest';
 
-type SisadPdfmeEventHandlers = Partial<
+export type SisadPdfmeEventHandlers = Partial<
   Record<
     SisadPdfmeEventName,
     | 'host'
diff --git a/src/sisad-pdfme/config/index.ts b/src/sisad-pdfme/config/index.ts
index 611950d..9c61fc1 100644
--- a/src/sisad-pdfme/config/index.ts
+++ b/src/sisad-pdfme/config/index.ts
@@ -1,21 +1,35 @@
+/**
+ * Barrel público de configuración de SISAD PDFME.
+ *
+ * Expone el contrato de configuración —valores y tipos— para que el host pueda
+ * crear, resolver y tipar la configuración sin imports profundos a archivos
+ * internos.
+ *
+ * Restaurado tras la regresión que vació estos re-exports (CONFIG-001 / Fase 1):
+ * `resolveSisadPdfmeConfig` y la mayoría de los tipos públicos habían dejado de
+ * exportarse, lo que rompía el barrel público `integration/index.ts`.
+ */
 export { defaultSisadPdfmeConfig } from './defaultSisadPdfmeConfig.js';
 export { createSisadPdfmeConfig } from './createSisadPdfmeConfig.js';
-;
+export { resolveSisadPdfmeConfig } from './resolveSisadPdfmeConfig.js';
+
 export type {
-  
   SisadPdfmeController,
-  
-  
-  
-  
-  SisadPdfmeGlobalConfig,
-  
-  
-  
-  
-  
-  
-  
+  SisadPdfmeDocument,
+  SisadPdfmeRecipientsAdapter,
+  SisadPdfmeDocumentsAdapter,
+  SisadPdfmePersistenceAdapter,
   SisadPdfmeSignatureProvider,
-  
+  SisadPdfmeSignatureProviderAdapter,
+  SisadPdfmeEventName,
+  SisadPdfmeEventHandlers,
+  SisadPdfmeVisibilityConfig,
+  SisadPdfmeUiClassNamesConfig,
+  SisadPdfmeUiConfig,
+  SisadPdfmeGlobalConfig,
+  ResolvedSisadPdfmeConfig,
+  SisadPdfmeProviderValue,
+  SisadPdfmeProviderProps,
 } from './SisadPdfmeConfig.js';
+
+export type { SisadPdfmeRecipient } from '../recipients/recipientTypes.js';
diff --git a/src/sisad-pdfme/integration/index.ts b/src/sisad-pdfme/integration/index.ts
index 4ce2d9c..fae6e0c 100644
--- a/src/sisad-pdfme/integration/index.ts
+++ b/src/sisad-pdfme/integration/index.ts
@@ -42,10 +42,15 @@ export type {
   SisadPdfmeEventName,
   SisadPdfmeGlobalConfig,
   SisadPdfmePersistenceAdapter,
+  SisadPdfmeProviderProps,
+  SisadPdfmeProviderValue,
   SisadPdfmeRecipient,
   SisadPdfmeRecipientsAdapter,
   SisadPdfmeSignatureProvider,
   SisadPdfmeSignatureProviderAdapter,
+  SisadPdfmeUiClassNamesConfig,
+  SisadPdfmeUiConfig,
+  SisadPdfmeVisibilityConfig,
 } from '../config/index.js';
 export {
   createRecipientRegistry,
