/**
 * @file index.ts
 *
 * Barrel público de @sisad-pdfme/common.
 *
 * Este archivo define qué APIs salen del paquete common hacia Designer, Form, Viewer,
 * Generator, integrations y módulos de alto nivel.
 *
 * Regla:
 * Mantener exports explícitos. Evitar export * masivo para no exponer APIs internas por accidente.
 */

export { PDFME_VERSION } from './version.js';
/** Reexporta contratos públicos usados por command bus, assignments y comentarios top-level. */
export type {
  Command,
  CommandExecutionContext,
  CommandObserverEvent,
  CommandObserverPayload,
  SchemaAssignments as ContractSchemaAssignments,
  SchemaIdentity,
  TopLevelPdfCommentEntry,
} from '../contracts/index.js';
/** Constantes de unidades, PDF base y fuente por defecto. */
export {
  MM_TO_PT_RATIO,
  PT_TO_MM_RATIO,
  PT_TO_PX_RATIO,
  BLANK_PDF,
  BLANK_A4_PDF,
  CUSTOM_A4_PDF,
  ZOOM,
  DEFAULT_FONT_NAME,
} from './constants.js';
/** Helpers generales de validación, conversión, fuentes y templates. */
export {
  cloneDeep,
  getFallbackFontName,
  getDefaultFont,
  getB64BasePdf,
  b64toUint8Array,
  checkFont,
  checkInputs,
  checkUIOptions,
  checkTemplate,
  checkUIProps,
  checkPreviewProps,
  checkDesignerProps,
  checkGenerateProps,
  mm2pt,
  pt2mm,
  pt2px,
  px2mm,
  isHexValid,
  getInputFromTemplate,
  isBlankPdf,
} from './helper.js';
/** Helpers de colaboración, comments y assignments. */
export {
  buildSchemaAssignments,
  buildUserRecipientAssignments,
  buildUserSchemaAssignments,
  createSchemaComment,
  createSchemaCommentAnchor,
  filterSchemasByAuthorView,
  normalizeRecipientIds,
  removeById,
  resolveSchemaAuthorId,
  schemaMatchesAuthorView,
  SHARED_ASSIGNMENTS_BUCKET,
  upsertById,
  validateCollaborativeSchemas,
} from './collaboration.js';
/** Helpers de comentarios embebidos y top-level. */
export {
  findSchemaByUid,
  addAnchorToSchema,
  addCommentToSchema,
  addCommentWithAnchorToTemplate,
  upsertTopLevelComment,
  removeTopLevelComment,
  updateCommentInSchema,
  deleteCommentFromSchema,
  resolveCommentInSchema,
  filterCommentsByFileAndPage,
} from './comments.js';
/** Tipos de assignments colaborativos. */
export type {
  SchemaAssignments,
  UserRecipientSchemaAssignments,
  UserRecipientAssignmentOptions,
} from './collaboration.js';
/** Motor de template dinámico para contenido con reflujo/paginación. */
export { getDynamicTemplate } from './dynamicTemplate.js';
/** Motor de placeholders/expresiones seguras. */
export { replacePlaceholders } from './expression.js';
/** Registry utilitario para plugins. */
export { pluginRegistry } from './pluginRegistry.js';
/** Tipos principales públicos de @sisad-pdfme/common. */
export type {
  ChangeSchemaItem,
  ChangeSchemas,
  SchemaPageArray,
  SchemaComment,
  SchemaCommentReply,
  CommentScope,
  PdfComment,
  PdfCommentReply,
  CommentAnchor,
  PropPanel,
  PropPanelInspectorConfig,
  PropPanelInspectorSectionKey,
  PropPanelSchema,
  PropPanelWidgetProps,
  PDFRenderProps,
  Mode,
  UIRenderProps,
  Plugin,
  Lang,
  Dict,
  Size,
  Schema,
  SchemaForUI,
  GlobalToken,
  Font,
  ColorType,
  BasePdf,
  BlankPdf,
  CustomPdf,
  Template,
  CommonOptions,
  GeneratorOptions,
  Plugins,
  PluginRegistry,
  PluginActionDefinition,
  PluginFamilyDefinition,
  PluginStrategyDefinition,
  GenerateProps,
  UIOptions,
  UIProps,
  PreviewProps,
  DesignerProps,
} from './types.js';
