/**
 * @file schema.ts
 *
 * Contratos Zod runtime para @sisad-pdfme/common.
 *
 * Responsabilidades:
 * - validar idiomas, diccionario, modo de render, tamaños y colores;
 * - validar comments/anchors;
 * - validar Schema, Template, Options y Props públicas;
 * - permitir passthrough donde el runtime necesita extensiones declaradas.
 *
 * Nota:
 * Este archivo es fuente de verdad runtime. Mantenerlo alineado con types.ts.
 */

import { z } from 'zod';

/** Idiomas soportados por el runtime de i18n. */
const langs = ['en', 'zh', 'ja', 'ko', 'ar', 'th', 'pl', 'it', 'de', 'es', 'fr'] as const;

/** Validador Zod para idioma activo. */
export const Lang = z.enum(langs);
/** Scope permitido para comentarios: documento, página o schema. */
export const CommentScope = z.enum(['document', 'page', 'schema']);
/** Diccionario mínimo requerido para labels de UI y schemas. */
export const Dict = z.object({
  // -----------------used in ui-----------------
  cancel: z.string(),
  close: z.string(),
  set: z.string(),
  clear: z.string(),
  field: z.string(),
  fieldName: z.string(),
  align: z.string(),
  width: z.string(),
  opacity: z.string(),
  height: z.string(),
  rotate: z.string(),
  edit: z.string(),
  required: z.string(),
  editable: z.string(),
  plsInputName: z.string(),
  fieldMustUniq: z.string(),
  notUniq: z.string(),
  noKeyName: z.string(),
  fieldsList: z.string(),
  editField: z.string(),
  type: z.string(),
  errorOccurred: z.string(),
  errorBulkUpdateFieldName: z.string(),
  commitBulkUpdateFieldName: z.string(),
  bulkUpdateFieldName: z.string(),
  addPageAfter: z.string(),
  removePage: z.string(),
  removePageConfirm: z.string(),
  // --------------------validation-------------------
  'validation.uniqueName': z.string(),
  'validation.hexColor': z.string(),
  'validation.dateTimeFormat': z.string(),
  'validation.outOfBounds': z.string(),

  // -----------------used in schemas-----------------
  'schemas.color': z.string(),
  'schemas.borderWidth': z.string(),
  'schemas.borderColor': z.string(),
  'schemas.backgroundColor': z.string(),
  'schemas.textColor': z.string(),
  'schemas.bgColor': z.string(),
  'schemas.horizontal': z.string(),
  'schemas.vertical': z.string(),
  'schemas.left': z.string(),
  'schemas.center': z.string(),
  'schemas.right': z.string(),
  'schemas.top': z.string(),
  'schemas.middle': z.string(),
  'schemas.bottom': z.string(),
  'schemas.padding': z.string(),

  'schemas.text.fontName': z.string(),
  'schemas.text.size': z.string(),
  'schemas.text.spacing': z.string(),
  'schemas.text.textAlign': z.string(),
  'schemas.text.verticalAlign': z.string(),
  'schemas.text.lineHeight': z.string(),
  'schemas.text.min': z.string(),
  'schemas.text.max': z.string(),
  'schemas.text.fit': z.string(),
  'schemas.text.dynamicFontSize': z.string(),
  'schemas.text.format': z.string(),
  'schemas.radius': z.string(),

  'schemas.mvt.typingInstructions': z.string(),
  'schemas.mvt.sampleField': z.string(),
  'schemas.mvt.variablesSampleData': z.string(),
  'schemas.mvt.placeholderDynamicVar': z.string(),

  'schemas.barcodes.barColor': z.string(),
  'schemas.barcodes.includetext': z.string(),

  'schemas.table.alternateBackgroundColor': z.string(),
  'schemas.table.tableStyle': z.string(),
  'schemas.table.showHead': z.string(),
  'schemas.table.repeatHead': z.string(),
  'schemas.table.headStyle': z.string(),
  'schemas.table.bodyStyle': z.string(),
  'schemas.table.columnStyle': z.string(),

  'schemas.date.format': z.string(),
  'schemas.date.locale': z.string(),

  'schemas.select.options': z.string(),
  'schemas.select.optionPlaceholder': z.string(),

  'schemas.radioGroup.groupName': z.string(),

  // -----------------schema catalog presentation-----------------
  // IDENTITY != PRESENTATION.
  // `schema.type` y la category key son contratos técnicos estables; estas keys
  // sólo resuelven la etiqueta visible del catálogo/inspector para el idioma activo.
  // Añadir una key aquí obliga a cubrirla en TODOS los diccionarios de `ui/i18n.ts`.
  'schemaTypes.text': z.string(),
  'schemaTypes.multiVariableText': z.string(),
  'schemaTypes.image': z.string(),
  'schemaTypes.svg': z.string(),
  'schemaTypes.signature': z.string(),
  'schemaTypes.initials': z.string(),
  'schemaTypes.dateSigned': z.string(),
  'schemaTypes.fullName': z.string(),
  'schemaTypes.emailAddress': z.string(),
  'schemaTypes.company': z.string(),
  'schemaTypes.title': z.string(),
  'schemaTypes.table': z.string(),
  'schemaTypes.line': z.string(),
  'schemaTypes.rectangle': z.string(),
  'schemaTypes.ellipse': z.string(),
  'schemaTypes.dateTime': z.string(),
  'schemaTypes.date': z.string(),
  'schemaTypes.time': z.string(),
  'schemaTypes.number': z.string(),
  'schemaTypes.select': z.string(),
  'schemaTypes.radioGroup': z.string(),
  'schemaTypes.checkbox': z.string(),
  'schemaTypes.checkboxGroup': z.string(),
  'schemaTypes.attachment': z.string(),
  'schemaTypes.note': z.string(),
  'schemaTypes.approve': z.string(),
  'schemaTypes.decline': z.string(),

  // Nombres de estándares de código de barras: son nombres propios y no se traducen,
  // pero siguen necesitando una etiqueta de presentación distinta del identificador.
  'schemaTypes.qrcode': z.string(),
  'schemaTypes.japanpost': z.string(),
  'schemaTypes.ean13': z.string(),
  'schemaTypes.ean8': z.string(),
  'schemaTypes.code39': z.string(),
  'schemaTypes.code128': z.string(),
  'schemaTypes.nw7': z.string(),
  'schemaTypes.itf14': z.string(),
  'schemaTypes.upca': z.string(),
  'schemaTypes.upce': z.string(),
  'schemaTypes.gs1datamatrix': z.string(),
  'schemaTypes.pdf417': z.string(),

  // Categorías del catálogo. La category key sigue siendo el identificador de
  // agrupación/orden; sólo su etiqueta visible es localizable.
  'schemaCategories.General': z.string(),
  'schemaCategories.Texto': z.string(),
  'schemaCategories.Firmas': z.string(),
  'schemaCategories.Imagen y medios': z.string(),
  'schemaCategories.Selecciones': z.string(),
  'schemaCategories.Fecha y Hora': z.string(),
  'schemaCategories.QR y Códigos': z.string(),
  'schemaCategories.Estructura': z.string(),
  'schemaCategories.Destinatario': z.string(),
  'schemaCategories.Acciones': z.string(),

  // Etiquetas de presentación resueltas por `shared/designerLabels`.
  'catalog.defaultFieldLabel': z.string(),
  'schemaStates.pending': z.string(),
  'schemaStates.draft': z.string(),
  'schemaStates.ready': z.string(),
  'schemaStates.completed': z.string(),
  'schemaStates.merged': z.string(),
  'schemaStates.locked': z.string(),
  'schemaStates.review': z.string(),
  'schemaStates.rejected': z.string(),
  'schemaStates.error': z.string(),
  'signatureModes.image': z.string(),
  'signatureModes.drawn': z.string(),
  'signatureModes.p12': z.string(),
  'signatureModes.provider': z.string(),
  'signature.providerView': z.string(),
  'recipientRoles.owner': z.string(),
  'recipientRoles.recipient': z.string(),
  'listView.shared': z.string(),
  // Prefijo compuesto con el nombre del propietario: `${assignedTo} ${nombre}`.
  'listView.assignedTo': z.string(),
  'listView.pageAbbrev': z.string(),
  'listView.allTypes': z.string(),
  'catalog.recentGroup': z.string(),
  // Prefijo del accessible name del toggle: `${toggleCategory} ${categoría}`.
  'catalog.toggleCategory': z.string(),
  'catalog.noResults': z.string(),
  'catalog.noResultsDescription': z.string(),
  'catalog.tabsAriaLabel': z.string(),
  'catalog.tabs.standard': z.string(),
  'catalog.tabs.custom': z.string(),
  'catalog.tabs.prefill': z.string(),
  // Variantes cortas para el rail/densidad reducida, donde la etiqueta completa
  // no cabe y se truncaba.
  'catalog.tabsShort.standard': z.string(),
  'catalog.tabsShort.custom': z.string(),
  'catalog.tabsShort.prefill': z.string(),
  // Prefijo del accessible name del rail: `${openTab} ${etiqueta}`.
  'catalog.openTab': z.string(),

  // Contenido inicial localizado para multiVariableText.
  // Se materializa UNA VEZ al crear el schema y luego es dato del documento:
  // cambiar el idioma de la UI nunca debe reescribirlo.
  'schemas.mvt.defaultContent': z.string(),
});
/** Modo de render UI: viewer, form o designer. */
export const Mode = z.enum(['viewer', 'form', 'designer']);

/** Tipo de color usado por render PDF cuando aplica. */
export const ColorType = z.enum(['rgb', 'cmyk']).optional();

/** Tamaño rectangular genérico. */
export const Size = z.object({ height: z.number(), width: z.number() });

const commentMessageShape = {
  authorId: z.string().optional(),
  authorName: z.string().optional(),
  authorColor: z.string().optional(),
  timestamp: z.number().optional(),
  createdAt: z.number().optional(),
  text: z.string(),
  resolved: z.boolean().optional(),
};

/** Contrato runtime para replies de comentarios. */
export const SchemaCommentReply = z
  .object({
    id: z.string(),
    ...commentMessageShape,
  })
  .passthrough();

export const SchemaComment = z
  .object({
    id: z.string(),
    scope: CommentScope.optional(),
    fileId: z.string().optional(),
    pageNumber: z.number().int().positive().optional(),
    fieldId: z.string().optional(),
    schemaUid: z.string().optional(),
    ...commentMessageShape,
    anchor: z.lazy(() => CommentAnchor).optional(),
    replies: z.array(SchemaCommentReply).optional(),
  })
  .passthrough();

/** Contrato runtime para anclas visuales de comentarios. */
export const CommentAnchor = z
  .object({
    id: z.string().optional(),
    scope: CommentScope.optional(),
    schemaUid: z.string().optional(),
    fileId: z.string().optional(),
    pageNumber: z.number().int().positive().optional(),
    fieldId: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    resolved: z.boolean().optional(),
    authorId: z.string().optional(),
    authorName: z.string().optional(),
    authorColor: z.string().optional(),
  })
  .passthrough();

export const Schema = z
  .object({
    schemaUid: z.string().optional(),
    fileId: z.string().optional(),
    fileTemplateId: z.string().optional(),
    pageNumber: z.number().int().positive().optional(),
    ownerMode: z.enum(['single', 'multi', 'shared']).optional(),
    ownerRecipientId: z.string().optional(),
    ownerRecipientIds: z.array(z.string()).optional(),
    ownerRecipientName: z.string().optional(),
    ownerColor: z.string().optional(),
    userColor: z.string().optional(),
    createdBy: z.string().optional(),
    lastModifiedBy: z.string().optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
    lastModifiedAt: z.number().optional(),
    commentsCount: z.number().int().nonnegative().optional(),
    state: z.enum(['draft', 'locked', 'merged']).optional(),
    lock: z
      .object({
        lockedBy: z.string().optional(),
        lockedAt: z.number().optional(),
        reason: z.string().optional(),
        sessionId: z.string().optional(),
      })
      .optional(),
    comments: z.array(SchemaComment).optional(),
    commentAnchors: z.array(CommentAnchor).optional(),
    commentsAnchors: z.array(CommentAnchor).optional(),
    collaboration: z.any().optional(),
    saveValue: z.boolean().optional(),
    name: z.string(),
    type: z.string(),
    content: z.string().optional(),
    position: z.object({ x: z.number(), y: z.number() }),
    width: z.number(),
    height: z.number(),
    rotate: z.number().optional(),
    opacity: z.number().optional(),
    readOnly: z.boolean().optional(),
    required: z.boolean().optional(),
    __bodyRange: z.object({ start: z.number(), end: z.number().optional() }).optional(),
    __isSplit: z.boolean().optional(),
  })
  .passthrough();

const SchemaForUIAdditionalInfo = z.object({ id: z.string() });
/** Schema extendido usado por Designer/Form/Viewer. */
export const SchemaForUI = Schema.merge(SchemaForUIAdditionalInfo);

const ArrayBufferSchema: z.ZodSchema<ArrayBuffer> = z.any().refine((v) => v instanceof ArrayBuffer);
const Uint8ArraySchema: z.ZodSchema<Uint8Array<ArrayBuffer>> = z
  .any()
  .refine((v) => v instanceof Uint8Array && v.buffer instanceof ArrayBuffer);

export const BlankPdf = z.object({
  width: z.number(),
  height: z.number(),
  padding: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  staticSchema: z.array(Schema).optional(),
});

export const CustomPdf = z.union([z.string(), ArrayBufferSchema, Uint8ArraySchema]);

/** Contrato de PDF base, custom o blank. */
export const BasePdf = z.union([CustomPdf, BlankPdf]);

export const SchemaPageArray = z.array(z.array(Schema));

/** Contrato runtime del template completo. */
export const Template = z
  .object({
    schemas: SchemaPageArray,
    basePdf: BasePdf,
    pdfmeVersion: z.string().optional(),
  })
  .passthrough();

export const Inputs = z.array(z.record(z.string(), z.any())).min(1);

/** Contrato de fuentes registradas en generator/runtime. */
export const Font = z.record(
  z.string(),
  z.object({
    data: z.union([z.string(), ArrayBufferSchema, Uint8ArraySchema]),
    fallback: z.boolean().optional(),
    subset: z.boolean().optional(),
  }),
);

export const Plugin = z
  .object({
    ui: z.any(),
    pdf: z.any(),
    propPanel: z.object({
      schema: z.unknown(),
      widgets: z.record(z.string(), z.any()).optional(),
      defaultSchema: Schema,
    }),
    icon: z.string().optional(),
  })
  .passthrough();

/** Opciones comunes compartidas por runtime/generator. */
export const CommonOptions = z.object({ font: Font.optional() }).passthrough();

const CommonProps = z.object({
  template: Template,
  options: CommonOptions.optional(),
  plugins: z.record(z.string(), Plugin).optional(),
});

// -------------------generate-------------------

export const GeneratorOptions = CommonOptions.extend({
  colorType: ColorType,
  author: z.string().optional(),
  creationDate: z.date().optional(),
  creator: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  lang: Lang.optional(),
  modificationDate: z.date().optional(),
  producer: z.string().optional(),
  subject: z.string().optional(),
  title: z.string().optional(),
});

/** Props validadas para generación PDF. */
export const GenerateProps = CommonProps.extend({
  inputs: Inputs,
  options: GeneratorOptions.optional(),
}).strict();

// ---------------------ui------------------------

/** Opciones UI compartidas por Designer/Form/Viewer. */
export const UIOptions = CommonOptions.extend({
  lang: Lang.optional(),
  labels: z.record(z.string(), z.string()).optional(),
  theme: z.record(z.string(), z.unknown()).optional(),
  icons: z.record(z.string(), z.string()).optional(),
  requiredByDefault: z.boolean().optional(),
  maxZoom: z.number().optional(),
  sidebarOpen: z.boolean().optional(),
  zoomLevel: z.number().optional(),
});

const HTMLElementSchema: z.ZodSchema<HTMLElement> = z.any().refine((v) => v instanceof HTMLElement);

export const UIProps = CommonProps.extend({
  domContainer: HTMLElementSchema,
  options: UIOptions.optional(),
});

export const PreviewProps = UIProps.extend({
  inputs: Inputs,
  // Form exposes an export action through the shared PreviewProps contract.
  // Keep it in the runtime schema as well as in `common/types.ts`; otherwise
  // the strict validator rejects the callback before the preview can mount.
  onExport: z.custom<(...args: unknown[]) => unknown>((value) => typeof value === 'function').optional(),
}).strict();

/** Props públicas del Designer. */
export const DesignerProps = UIProps.extend({}).strict();
