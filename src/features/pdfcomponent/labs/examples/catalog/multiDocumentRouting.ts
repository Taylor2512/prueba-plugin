import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { text, select, checkbox, radioGroup, checkboxGroup } from '@sisad-pdfme/schemas'
import { optionGroupDesignerWidthMM, optionGroupDesignerHeightMM } from '@sisad-pdfme/schemas'
import {
  createSchema,
  createCommentAnchor,
  createAuditMetadata,
} from '@/features/pdfcomponent/labs/builders/schemaFactory'
import {
  createSchemaShowcasePages as createShowcasePagesCore,
  mergeSchemaPages,
} from '@/features/pdfcomponent/labs/builders/schemaShowcase'
import {
  createTemplate,
  appendTemplatePages,
  createUploadedDocument as createUploadedDocumentCore,
  createCollaboration,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate'
import { createLabExample } from '../createLabExample.ts'

const getTemplatePdfUrl = (fileName) => `/templates/${encodeURIComponent(fileName)}`

const LAB_PDFS = {
  routingPrimary: getTemplatePdfUrl('test.pdf'),
}

const SORTED_SCHEMA_DEFINITIONS = builtInSchemaDefinitions
  .slice()
  .sort((a, b) => `${a.category}-${a.label}`.localeCompare(`${b.category}-${b.label}`))

const EXCLUDED_SHOWCASE_SCHEMA_TYPES = new Set(['qrcode'])
const SHOWCASE_SCHEMA_DEFINITIONS = SORTED_SCHEMA_DEFINITIONS.filter((definition) => {
  const type = String(definition?.type || '').toLowerCase()
  return !EXCLUDED_SHOWCASE_SCHEMA_TYPES.has(type)
})

const resolvePosition = (basePosition, overrides = {}) => {
  const nextPosition = { ...(basePosition || {}) }
  const overridePosition = overrides.position && typeof overrides.position === 'object' ? overrides.position : null

  if (overridePosition) {
    if (overridePosition.x != null) nextPosition.x = overridePosition.x
    if (overridePosition.y != null) nextPosition.y = overridePosition.y
  }
  if (overrides.x != null) nextPosition.x = overrides.x
  if (overrides.y != null) nextPosition.y = overrides.y
  return nextPosition
}

const createSchemaFactory = (baseSchema, basePosition, defaults = {}) => (overrides = {}) => {
  const { position, x, y, ...rest } = overrides
  return createSchema(baseSchema, {
    ...defaults,
    ...rest,
    position: resolvePosition(basePosition, { position, x, y }),
  })
}

const createTextSchema = createSchemaFactory(text.propPanel.defaultSchema, { x: 18, y: 24 }, {
  width: 92,
  height: 12,
  fontSize: 12,
})

const createSelectSchema = createSchemaFactory(select.propPanel.defaultSchema, { x: 18, y: 46 }, {
  width: 92,
  height: 12,
})

const createCheckboxSchema = createSchemaFactory(checkbox.propPanel.defaultSchema, { x: 18, y: 66 }, {
  width: 8,
  height: 8,
})

const createOptionGroupFactory = (baseSchema, type, basePosition) => (overrides = {}) => {
  const { position, x, y, options, width, height, ...rest } = overrides
  const count = Array.isArray(options) ? options.length : 2
  return createSchema(baseSchema, {
    width: width ?? optionGroupDesignerWidthMM(type),
    height: height ?? optionGroupDesignerHeightMM(type, count),
    ...(options ? { options } : {}),
    ...rest,
    position: resolvePosition(basePosition, { position, x, y }),
  })
}

const createRadioGroupSchema = createOptionGroupFactory(radioGroup.propPanel.defaultSchema, 'radioGroup', { x: 18, y: 84 })
const createCheckboxGroupSchema = createOptionGroupFactory(checkboxGroup.propPanel.defaultSchema, 'checkboxGroup', { x: 18, y: 108 })

const createSchemaShowcasePages = (config) =>
  createShowcasePagesCore({ ...config, overridesByType: SCHEMA_EXAMPLE_OVERRIDES })

const createLabSchemaShowcasePages = ({
  scope,
  ownerRecipientId,
  fileId,
  fileTemplateId,
  startingPageNumber,
  auditOffset,
  definitions = SHOWCASE_SCHEMA_DEFINITIONS,
}) =>
  createSchemaShowcasePages({
    definitions,
    scope,
    ownerRecipientId,
    fileId,
    fileTemplateId,
    startingPageNumber,
    auditOffset,
  })

const createUploadedDocument = (args) =>
  createUploadedDocumentCore({ ...args, pdfResolver: getTemplatePdfUrl })

const SCHEMA_EXAMPLE_OVERRIDES = {
  text: {
    name: 'customer_full_name',
    content: 'Taylor Demo',
    width: 92,
    height: 12,
  },
  multiVariableText: {
    name: 'approval_summary',
    text: 'Cliente {customer_name} · Plan {plan}',
    content: '{customer_name}',
    width: 110,
    height: 14,
  },
  select: {
    name: 'contract_stage',
    content: 'Aprobado',
    options: ['Pendiente', 'Aprobado', 'Rechazado'],
    width: 92,
    height: 12,
  },
  checkbox: {
    name: 'accept_terms',
    content: 'true',
    width: 8,
    height: 8,
  },
  radioGroup: {
    name: 'notify_customer',
    groupId: 'delivery-notifications',
    group: 'delivery-notifications',
    groupName: 'Notificaciones de entrega',
    content: 'option_1',
    selectedOptionId: 'option_1',
    defaultSelectedOptionId: 'option_1',
    options: [
      { optionId: 'option_1', label: 'Sí' },
      { optionId: 'option_2', label: 'No' },
    ],
    width: 82,
    height: 18,
  },
  checkboxGroup: {
    name: 'preferences',
    options: [
      { optionId: 'opt_1', label: 'Opción A' },
      { optionId: 'opt_2', label: 'Opción B' },
      { optionId: 'opt_3', label: 'Opción C' },
    ],
    selectedOptionIds: ['opt_1'],
    width: 92,
    height: 12,
  },
  signature: {
    name: 'review_signature',
    width: 60,
    height: 24,
  },
  image: {
    name: 'company_logo',
    width: 42,
    height: 42,
  },
  svg: {
    name: 'process_icon',
    width: 42,
    height: 42,
  },
  line: {
    name: 'divider_line',
    width: 94,
    height: 0.75,
  },
  rectangle: {
    name: 'highlight_box',
    width: 94,
    height: 32,
  },
  ellipse: {
    name: 'approval_badge',
    width: 52,
    height: 28,
  },
  table: {
    name: 'line_items',
    width: 155,
    height: 28,
  },
  dateTime: {
    name: 'approval_timestamp',
    width: 68,
    height: 12,
  },
  date: {
    name: 'approval_date',
    width: 54,
    height: 12,
  },
  time: {
    name: 'approval_time',
    width: 36,
    height: 12,
  },
}

const MULTI_DOCUMENT_ROUTING_PAGE_COUNT = 5
const routingSchemaSplitIndex = Math.ceil(SHOWCASE_SCHEMA_DEFINITIONS.length / 2)
const routingPrimarySchemaDefinitions = SHOWCASE_SCHEMA_DEFINITIONS.slice(0, routingSchemaSplitIndex)
const routingSecondarySchemaDefinitions = SHOWCASE_SCHEMA_DEFINITIONS.slice(routingSchemaSplitIndex)

const multiDocumentPrimaryBaseSchemas = [
  [
    createTextSchema({
      schemaUid: 'multi-contract-name',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('recipient-1', 'recipient-1', 0),
      name: 'contract_name',
      content: 'Contrato principal',
    }),
    createTextSchema({
      schemaUid: 'multi-contract-date',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 45000),
      name: 'contract_date',
      content: '2026-05-01',
      y: 48,
    }),
    createSelectSchema({
      schemaUid: 'multi-contract-stage',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 90000),
      name: 'contract_stage',
      content: 'Pendiente',
      options: ['Pendiente', 'Aprobado', 'Rechazado'],
      y: 72,
    }),
    createRadioGroupSchema({
      schemaUid: 'multi-contract-approval-mode',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientIds: ['recipient-1'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 120000),
      name: 'approval_mode',
      groupId: 'multi-contract-approval-mode',
      group: 'multi-contract-approval-mode',
      groupName: 'Modo de aprobación',
      content: 'option_1',
      selectedOptionId: 'option_1',
      defaultSelectedOptionId: 'option_1',
      options: [
        { optionId: 'option_1', label: 'Firma' },
        { optionId: 'option_2', label: 'Revisión' },
      ],
      y: 96,
    }),
    createCheckboxGroupSchema({
      schemaUid: 'multi-contract-attachments',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientIds: ['recipient-1'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 150000),
      name: 'required_documents',
      groupId: 'multi-contract-attachments',
      group: 'multi-contract-attachments',
      groupName: 'Documentos requeridos',
      selectedOptionIds: ['opt_1', 'opt_3'],
      options: [
        { optionId: 'opt_1', label: 'Cédula' },
        { optionId: 'opt_2', label: 'RUC' },
        { optionId: 'opt_3', label: 'Contrato firmado' },
      ],
      y: 124,
    }),
  ],
  [],
]

const multiDocumentSecondaryBaseSchemas = [
  [],
  [
    createTextSchema({
      schemaUid: 'multi-annex-name',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 90000),
      name: 'annex_name',
      content: 'Anexo técnico',
    }),
    createTextSchema({
      schemaUid: 'multi-annex-sign',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 135000),
      name: 'annex_sign',
      content: 'Firmado',
      y: 48,
    }),
    createCheckboxSchema({
      schemaUid: 'multi-annex-check',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 160000),
      name: 'annex_confirm',
      content: 'true',
      y: 72,
    }),
    createSelectSchema({
      schemaUid: 'multi-annex-select',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 190000),
      name: 'annex_status',
      content: 'En revisión',
      options: ['En revisión', 'Aprobado', 'Observado'],
      y: 96,
    }),
  ],
]

const multiDocumentPrimaryShowcaseSchemas = createLabSchemaShowcasePages({
  definitions: routingPrimarySchemaDefinitions,
  scope: 'routing-primary-showcase',
  ownerRecipientId: 'recipient-1',
  fileId: 'file-contract-a',
  fileTemplateId: 'file-contract-a',
  startingPageNumber: 3,
  auditOffset: 180000,
})

const multiDocumentSecondaryShowcaseSchemas = createLabSchemaShowcasePages({
  definitions: routingSecondarySchemaDefinitions,
  scope: 'routing-secondary-showcase',
  ownerRecipientId: 'recipient-2',
  fileId: 'file-contract-b',
  fileTemplateId: 'file-contract-b',
  startingPageNumber: 3,
  auditOffset: 360000,
})

const multiDocumentPrimarySchemas = mergeSchemaPages(
  multiDocumentPrimaryBaseSchemas,
  multiDocumentPrimaryShowcaseSchemas,
  MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
)

const multiDocumentSecondarySchemas = mergeSchemaPages(
  multiDocumentSecondaryBaseSchemas,
  multiDocumentSecondaryShowcaseSchemas,
  MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
)

const multiDocumentRoutingTemplate = createTemplate(
  mergeSchemaPages(
    multiDocumentPrimarySchemas,
    multiDocumentSecondarySchemas,
    MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    160,
  ),
  {
    basePdf: LAB_PDFS.routingPrimary,
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
  },
)

const multiDocumentRoutingDocuments = [
  createUploadedDocument({
    id: 'file-contract-a',
    name: 'Declaración de datos',
    pdfFileName: 'test.pdf',
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    schemas: multiDocumentPrimarySchemas,
  }),
  createUploadedDocument({
    id: 'file-contract-b',
    name: 'Certificado académico',
    pdfFileName: 'test.pdf',
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    schemas: multiDocumentSecondarySchemas,
  }),
]

export const multiDocumentRoutingLabExample = createLabExample({
  id: 'multi-document-routing',
  path: '/lab/multi-document-routing',
  title: 'Multidocumento integral',
  description: 'Ruta integral para asignaciones por documento, página y destinatario con carga de múltiples PDFs, handoff entre archivos y showcase de todos los schemas integrados.',
  status: 'Listo para validar rutas multidocumento y cobertura completa de schemas en un solo flujo',
  defaultMode: 'designer',
  initialSchemaType: 'text',
  collaboration: createCollaboration('recipient-1', [
    { id: 'recipient-1', name: 'Cliente Principal', role: 'signer', color: '#2563EB' },
    { id: 'recipient-2', name: 'Avalista', role: 'signer', color: '#D946EF' },
    { id: 'routing-user-1', name: 'Mesa de entrega', role: 'coordinator', color: '#F97316' },
  ], { sessionId: 'multi-document-routing-session', actorId: 'routing-user-1' }),
  template: multiDocumentRoutingTemplate,
  runtimeOptions: {
    activeDocumentId: 'file-contract-a',
    rightSidebarViewMode: 'docs',
    uploadedDocuments: multiDocumentRoutingDocuments,
    visibility: {
      sidebars: {
        right: {
          panels: {
            documents: true,
          },
        },
      },
    },
  },
})
