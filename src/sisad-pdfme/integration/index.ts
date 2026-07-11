export {
  Designer,
  Form,
  Viewer,
  PdfEditor,
  PdfEditorEngineBuilder,
  PdfFormView,
  PdfViewer,
  createDesignerRuntimeEventHub,
} from '../ui/index.js';
export {
  generatePdf as generateTemplatePdf,
  generatePdf,
  generatePdfBuffer,
  generatePdfWithPreflight,
  buildDynamicTemplate,
} from '../generator/index.js';
export {
  img2pdf as convertImagesToPdf,
  pdf2img as getPdfPageImages,
  pdf2size as getPdfPageSizes,
} from '@sisad-pdfme/converter';
export {
  buildRuntimeOptions,
  buildDesignerRuntimeOptions,
  buildRuntimeFormOptions,
  buildRuntimeViewerOptions,
  DEFAULT_RUNTIME_THEME_TOKEN,
} from '../runtime/options.js';
export {
  normalizeTemplatePagesForDocument,
  normalizeDocuments,
  resolveActiveDocument,
  pdfToImages,
  pdfToPageSizes,
  imagesToPdf,
  getPdfPageSizes as getDocumentPdfPageSizes,
  filterSchemasByFileAndPage,
  reconcileTemplateDocuments,
  mergeDesignerDocumentIntoFile,
} from '../documents/index.js';
export {
  CommandBus,
  createCommandBus,
  designerCommands,
  schemaCommands,
  commentCommands,
  documentCommands,
  registerDesignerCommands,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
  createCommentCommandEvent,
  buildTopLevelCommentEntry,
  createSelectionCommands,
  emitInlineEditRequest,
  setInlineEditRequestHandler,
} from '../commands/index.js';
export {
  parsePdfmeSnapshot,
  extractDocumentsFromSnapshot,
  resolveDocumentSnapshot,
  resolveDocumentTemplate,
  extractOriginalFormFromSnapshot,
  extractAssignmentsFromSnapshot,
  serializeSnapshotForTxt,
  snapshotAdapter,
} from '../shared/snapshotAdapter.js';
export {
  makeEmptySnapshot,
  SNAPSHOT_VERSION,
} from '../contracts/index.js';
export {
  getSchemaPluginByType,
  getBuiltInFields,
  getSchemaDefinition,
  getSchemaFamily,
  registerFieldPlugin,
  registerPlugins,
  validateSchemaNameUniqueness,
  generateUniqueSchemaName,
} from '../schemas/index.js';
export { createSchemaController } from './schemaController.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.js?url';
import { getBuiltInFields as getBuiltInFieldsLocal } from '../schemas/index.js';

/**
 * Configura PDF.js para el worker legacy usado por SISAD.
 *
 * Se mantiene en la capa de integración para que los consumidores del host
 * no dependan de detalles internos del converter.
 */
export const configurePdfjsLegacyWorker = async () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorkerUrl as string;

  return { pdfjsLib };
};

export const getSchemaCatalog = () =>
  getBuiltInFieldsLocal().map((field, index) => ({
    id: `schema-${String(index + 1).padStart(2, '0')}-${String(field.type || '').trim()}`,
    key: String(field.label || field.type || '').trim(),
    type: String(field.type || '').trim(),
    label: String(field.label || field.type || '').trim(),
    category: String(field.category || 'General').trim() || 'General',
  }));
export const normalizeTemplateForRuntime = (templateValue: unknown) => {
  if (!templateValue || typeof templateValue !== 'object') return null;
  const template = templateValue as Record<string, unknown>;
  const basePdf = String(template.basePdf || '').trim();
  if (!basePdf) return null;
  return {
    ...template,
    basePdf,
    schemas: Array.isArray(template.schemas) ? template.schemas : [[]],
  };
};
