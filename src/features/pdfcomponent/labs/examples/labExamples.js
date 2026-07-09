// Lab examples. Builders/exporters live beside this catalog under labs/.
// This file holds lab-specific data and wires it to the local lab builders.
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { text, select, checkbox, signature, radioGroup, checkboxGroup } from '@sisad-pdfme/schemas'
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
  createExample,
  cloneExample,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate'
import {
  buildExampleBundle,
  getExampleBundleFilename,
} from '@/features/pdfcomponent/labs/export/buildExampleBundle'
import { buildExampleHref } from '@/features/pdfcomponent/labs/export/downloadExampleBundle'

const BASE_COLLABORATION_TIMESTAMP = 1713570000000

const getTemplatePdfUrl = (fileName) => `/templates/${encodeURIComponent(fileName)}`

const LAB_PDFS = {
  basic: getTemplatePdfUrl('example_pdf_empy.pdf'),
  enterprise: getTemplatePdfUrl('example_pdf_empy.pdf'),
  routingPrimary: getTemplatePdfUrl('example_pdf_empy.pdf'),
  routingSecondary: getTemplatePdfUrl('example_pdf_empy.pdf'),
  multiuser: getTemplatePdfUrl('example_pdf_empy.pdf'),
  generator: getTemplatePdfUrl('example_pdf_empy.pdf'),
}

const SORTED_SCHEMA_DEFINITIONS = builtInSchemaDefinitions
  .slice()
  .sort((a, b) => `${a.category}-${a.label}`.localeCompare(`${b.category}-${b.label}`))

// Showcase should include every registered schema except QR, which is the only
// explicit exclusion in this lab catalog.
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

// Option groups are marker-only in the designer: their box must hug the stacked
// indicators and grow with the option count, not span a text-field width.
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

const createSignatureSchema = createSchemaFactory(signature.propPanel.defaultSchema, { x: 18, y: 88 }, {
  width: 60,
  height: 24,
})

// Per-type example content injected into the core showcase builder.
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

// Lab wrapper: inject the lab's example content into the core showcase builder.
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

// Lab wrapper: resolve uploaded-document PDFs from the lab /templates route.
const createUploadedDocument = (args) =>
  createUploadedDocumentCore({ ...args, pdfResolver: getTemplatePdfUrl })

const EXAMPLE_ACTIONS_BY_MODE = {
  designer: [
    'open-example',
    'download-template',
    'generate-pdf',
    'pdf2size',
    'pdf2img',
    'img2pdf',
    'add-page',
    'fit-page',
    'fit-width',
    'add-schema',
    'reset-template',
  ],
  form: [
    'open-example',
    'download-template',
    'generate-pdf',
    'pdf2size',
    'pdf2img',
    'img2pdf',
    'reset-template',
  ],
  viewer: ['open-example', 'download-template', 'reset-template'],
}

const createLabExample = (config) =>
  createExample({
    defaultMode: 'designer',
    initialSchemaType: 'text',
    ...config,
  })

const basicDesignerTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'basic-full-name',
      name: 'full_name',
      content: 'Ada Lovelace',
      ownerMode: 'single',
      ownerRecipientId: 'basic-user-1',
      ...createAuditMetadata('basic-user-1', 'basic-user-1', 0),
    }),
    createTextSchema({
      schemaUid: 'basic-role',
      name: 'role',
      content: 'Researcher',
      y: 40,
      fontSize: 10,
      ownerMode: 'single',
      ownerRecipientId: 'basic-user-2',
      ...createAuditMetadata('basic-user-1', 'basic-user-2', 45000),
    }),
    createSignatureSchema({
      schemaUid: 'basic-signature',
      name: 'signature',
      ownerMode: 'single',
      ownerRecipientId: 'basic-user-1',
      ...createAuditMetadata('basic-user-1', 'basic-user-1', 90000),
    }),
  ],
], { basePdf: LAB_PDFS.basic, pageCount: 3 })

const enterpriseCollaborationTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'enterprise-company-name',
      fileTemplateId: 'enterprise-contract',
      fileId: 'enterprise-contract',
      name: 'company_name',
      content: 'Taylor Holdings',
      ownerMode: 'multi',
      ownerRecipientId: 'sales-team',
      ownerRecipientIds: ['sales-team', 'legal-team'],
      ...createAuditMetadata('sales-user-1', 'legal-user-1', 5000),
      commentsCount: 1,
      comments: [
        {
          id: 'comment-enterprise-1',
          authorName: 'QA',
          timestamp: 1713571200000,
          text: 'Revisar el identificador fiscal antes de cerrar.',
        },
      ],
      commentAnchors: [
        createCommentAnchor({ schemaUid: 'enterprise-company-name', fileId: 'enterprise-contract', pageNumber: 1 }),
      ],
      commentsAnchors: [
        createCommentAnchor({ schemaUid: 'enterprise-company-name', fileId: 'enterprise-contract', pageNumber: 1 }),
      ],
    }),
    createTextSchema({
      schemaUid: 'enterprise-contract-status',
      fileTemplateId: 'enterprise-contract',
      fileId: 'enterprise-contract',
      name: 'contract_status',
      content: 'Pendiente',
      ownerMode: 'single',
      ownerRecipientId: 'ops-user-1',
      ...createAuditMetadata('ops-user-1', 'ops-user-1', 12000),
      state: 'locked',
      lock: {
        lockedBy: 'ops-user-1',
        lockedAt: 1713571260000,
        reason: 'Aprobacion final',
      },
      y: 42,
    }),
  ],
], { basePdf: LAB_PDFS.enterprise, pageCount: 2 })

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

const MULTI_DOCUMENT_ROUTING_PAGE_COUNT = 5
const routingSchemaSplitIndex = Math.ceil(SHOWCASE_SCHEMA_DEFINITIONS.length / 2)
const routingPrimarySchemaDefinitions = SHOWCASE_SCHEMA_DEFINITIONS.slice(0, routingSchemaSplitIndex)
const routingSecondarySchemaDefinitions = SHOWCASE_SCHEMA_DEFINITIONS.slice(routingSchemaSplitIndex)

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

// Merge primary and secondary schemas into a single template view for the routing example
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
    pdfFileName: 'example_pdf_empy.pdf',
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    schemas: multiDocumentPrimarySchemas,
  }),
  createUploadedDocument({
    id: 'file-contract-b',
    name: 'Certificado académico',
    pdfFileName: 'example_pdf_empy.pdf',
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    schemas: multiDocumentSecondarySchemas,
  }),
]

const multiuserShowcasePages = createLabSchemaShowcasePages({
  scope: 'multiuser-showcase',
  ownerRecipientId: 'sales-user-1',
  fileId: 'multiuser-contract',
  fileTemplateId: 'multiuser-contract',
  // base multiuser template has 2 pages; start showcase after those to avoid overlap
  startingPageNumber: 3,
  auditOffset: 120000,
})

const multiuserCollaborationTemplate = appendTemplatePages(
  createTemplate(
    [
      [
        createTextSchema({
          schemaUid: 'multiuser-owner-name',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'owner_name',
          content: 'Sales owner',
          ownerMode: 'single',
          ownerRecipientId: 'sales-user-1',
          ...createAuditMetadata('sales-user-1', 'sales-user-1', 0),
        }),
        createTextSchema({
          schemaUid: 'multiuser-team-note',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'team_note',
          content: 'Legal review in progress',
          ownerRecipientId: 'legal-user-1',
          ownerMode: 'multi',
          ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
          ...createAuditMetadata('sales-user-1', 'legal-user-1', 30000),
          commentAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-team-note', fileId: 'multiuser-contract', pageNumber: 1, x: 12, y: 40 }),
          ],
          commentsAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-team-note', fileId: 'multiuser-contract', pageNumber: 1, x: 12, y: 40 }),
          ],
          commentsCount: 1,
          comments: [
            {
              id: 'comment-multiuser-1',
              authorName: 'Legal',
              timestamp: 1713571600000,
              text: 'Alinear cláusula de confidencialidad con el borrador final.',
            },
          ],
          y: 40,
        }),
      ],
      [
        createTextSchema({
          schemaUid: 'multiuser-shared-summary',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'shared_summary',
          content: 'Visible to all collaborators',
          ownerMode: 'shared',
          ownerRecipientIds: ['sales-user-1', 'legal-user-1', 'ops-user-1'],
          ...createAuditMetadata('sales-user-1', 'ops-user-1', 60000),
          commentAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-shared-summary', fileId: 'multiuser-contract', pageNumber: 2, x: 12, y: 0 }),
          ],
          commentsAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-shared-summary', fileId: 'multiuser-contract', pageNumber: 2, x: 12, y: 0 }),
          ],
          commentsCount: 2,
          comments: [
            {
              id: 'comment-multiuser-2',
              authorName: 'Ops',
              timestamp: 1713571660000,
              text: 'Confirmar que el texto quede bloqueado tras aprobación.',
            },
            {
              id: 'comment-multiuser-3',
              authorName: 'Sales',
              timestamp: 1713571720000,
              text: 'Compartido con todos los usuarios activos del editor.',
            },
          ],
        }),
        createTextSchema({
          schemaUid: 'multiuser-locked-approval',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'approval_status',
          content: 'Locked for final approval',
          ownerMode: 'multi',
          ownerRecipientIds: ['legal-user-1', 'ops-user-1'],
          ...createAuditMetadata('legal-user-1', 'ops-user-1', 90000),
          state: 'locked',
          lock: {
            lockedBy: 'ops-user-1',
            lockedAt: BASE_COLLABORATION_TIMESTAMP + 135000,
            reason: 'Aprobacion final',
          },
          y: 40,
        }),
      ],
    ],
    { basePdf: LAB_PDFS.multiuser, pageCount: 2 },
  ),
  multiuserShowcasePages,
)

const generatorRuntimeTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'generator-customer-name',
      name: 'customer_name',
      content: 'Taylor Demo',
      ownerMode: 'single',
      ownerRecipientId: 'generator-user-1',
      ...createAuditMetadata('generator-user-1', 'generator-user-1', 0),
    }),
    createSelectSchema({
      schemaUid: 'generator-plan',
      name: 'plan',
      content: 'enterprise',
      options: ['basic', 'pro', 'enterprise'],
      ownerMode: 'multi',
      ownerRecipientIds: ['generator-user-1', 'generator-user-2'],
      ...createAuditMetadata('generator-user-1', 'generator-user-2', 45000),
      commentsCount: 1,
      comments: [
        {
          id: 'comment-generator-1',
          authorName: 'Conversión',
          timestamp: 1713572000000,
          text: 'Validar el plan antes de generar el PDF final.',
        },
      ],
      commentAnchors: [
        createCommentAnchor({ schemaUid: 'generator-plan', pageNumber: 1, x: 18, y: 46 }),
      ],
      commentsAnchors: [
        createCommentAnchor({ schemaUid: 'generator-plan', pageNumber: 1, x: 18, y: 46 }),
      ],
    }),
    createCheckboxSchema({
      schemaUid: 'generator-terms',
      name: 'accept_terms',
      content: 'true',
      y: 64,
      ownerMode: 'shared',
      ownerRecipientIds: ['generator-user-1', 'generator-user-2'],
      ...createAuditMetadata('generator-user-1', 'generator-user-2', 90000),
    }),
  ],
], { basePdf: LAB_PDFS.generator, pageCount: 3 })

const designerShowcasePages = createLabSchemaShowcasePages({
  scope: 'designer-showcase',
  ownerRecipientId: 'basic-user-1',
  // place designer showcase pages after the base designer template pages
  startingPageNumber: basicDesignerTemplate.schemas.length + 1,
  auditOffset: 120000,
})

const collaborationShowcasePages = createLabSchemaShowcasePages({
  scope: 'collaboration-showcase',
  ownerRecipientId: 'ops-user-1',
  fileId: 'enterprise-contract',
  fileTemplateId: 'enterprise-contract',
  startingPageNumber: 3,
  auditOffset: 240000,
})

const generatorShowcasePages = createLabSchemaShowcasePages({
  scope: 'generator-showcase',
  ownerRecipientId: 'generator-user-1',
  // append showcase after existing runtime template pages to avoid collisions
  startingPageNumber: generatorRuntimeTemplate.schemas.length + 1,
  auditOffset: 360000,
})

const basicDesignerShowcaseTemplate = appendTemplatePages(basicDesignerTemplate, designerShowcasePages)
const enterpriseCollaborationShowcaseTemplate = appendTemplatePages(
  appendTemplatePages(enterpriseCollaborationTemplate, collaborationShowcasePages),
  multiuserCollaborationTemplate.schemas,
)
const generatorRuntimeShowcaseTemplate = appendTemplatePages(generatorRuntimeTemplate, generatorShowcasePages)

const BASIC_SIGNATURE_PROVIDERS = [
  {
    key: 'provider.remoto.tenantA',
    label: 'Tenant A Sign',
    description: 'Proveedor remoto embebido para pruebas del lab.',
    capabilities: {
      supportsVisibleSignature: true,
      supportsWebhook: true,
      supportsPolling: false,
      supportsCertificateMetadata: false,
      supportsReason: true,
      supportsLocation: false,
      supportsOtp: true,
      supportsBiometric: false,
    },
    defaultConfig: {
      flow: 'embedded',
      visibleSignature: true,
      baseUrl: 'https://firma.tenant-a.example.com',
    },
    configFields: [
      { key: 'baseUrl', label: 'Base URL', type: 'text', required: true },
      {
        key: 'flow',
        label: 'Flow',
        type: 'select',
        required: true,
        options: [
          { label: 'Embedded', value: 'embedded' },
          { label: 'Redirect', value: 'redirect' },
        ],
      },
      { key: 'visibleSignature', label: 'Firma visible', type: 'switch' },
    ],
  },
]

const LAB_EXAMPLES = [
  createLabExample({
    id: 'basic-designer',
    path: '/lab/basic-designer',
    title: 'Editor integral',
    description: 'Ruta integral en modo designer con todos los schemas disponibles, alta de páginas, selección y edición sobre PDF real.',
    status: 'Listo para editar, agregar schemas y recorrer todos los casos de uso en una sola ruta',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('basic-user-1', [
      { id: 'basic-user-1', name: 'Diseño', role: 'owner', team: 'lab-team', color: '#2563EB' },
      { id: 'basic-user-2', name: 'QA', role: 'reviewer', team: 'lab-team', color: '#D946EF' },
    ], { sessionId: 'basic-designer-session', actorId: 'basic-user-1' }),
    template: basicDesignerShowcaseTemplate,
    runtimeOptions: {
      signatureProviders: BASIC_SIGNATURE_PROVIDERS,
    },
  }),
  createLabExample({
    id: 'enterprise-collaboration',
    path: '/lab/enterprise-collaboration',
    title: 'Colaboración integral',
    description: 'Ruta integral para ownership, comentarios, locks y revisión colaborativa, incluyendo showcase completo de schemas en contexto enterprise.',
    status: 'Preparado para validar colaboración, bloqueo y cobertura total de schemas sobre PDF real',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('ops-user-1', [
      { id: 'sales-user-1', name: 'Equipo de Ventas', role: 'editor', team: 'sales-team', color: '#2563EB' },
      { id: 'legal-user-1', name: 'Equipo Legal', role: 'reviewer', team: 'legal-team', color: '#D946EF' },
      { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops-team', color: '#F97316' },
    ], { sessionId: 'enterprise-collaboration-session', actorId: 'ops-user-1' }),
    template: enterpriseCollaborationShowcaseTemplate,
  }),
  createLabExample({
    id: 'multiuser-collaboration',
    path: '/lab/multiuser-collaboration',
    title: 'Colaboración multiusuario',
    description: 'Ruta integral para validar ownership, comentarios, bloqueo y vista activa por usuario sobre un PDF colaborativo real.',
    status: 'Preparado para validar la interacción multiusuario con ownership y comentarios en contexto compartido',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('sales-user-1', [
      { id: 'sales-user-1', name: 'Ventas Ejecutivas', role: 'editor', team: 'sales-team', color: '#2563EB' },
      { id: 'legal-user-1', name: 'Legal', role: 'reviewer', team: 'legal-team', color: '#D946EF' },
      { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops-team', color: '#F97316' },
    ], { sessionId: 'multiuser-collaboration-session', actorId: 'sales-user-1' }),
    template: multiuserCollaborationTemplate,
  }),
  createLabExample({
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
      uploadedDocuments: multiDocumentRoutingDocuments,
    },
  }),
  createLabExample({
    id: 'generator-runtime',
    path: '/lab/generator-runtime',
    title: 'Runtime integral',
    description: 'Ruta integral en modo form para probar captura, generación, conversión y revisión de todos los schemas disponibles.',
    status: 'Listo para generar PDF, convertir y validar todos los schemas desde un solo runtime',
    defaultMode: 'form',
    initialSchemaType: 'select',
    collaboration: createCollaboration('generator-user-1', [
      { id: 'generator-user-1', name: 'Formulario', role: 'owner', team: 'automation-team', color: '#2563EB' },
      { id: 'generator-user-2', name: 'Conversión', role: 'reviewer', team: 'automation-team', color: '#D946EF' },
    ], { sessionId: 'generator-runtime-session', actorId: 'generator-user-1' }),
    template: generatorRuntimeShowcaseTemplate,
  }),
]

export const getLabExampleDownloadFilename = (example) => getExampleBundleFilename(example)

export const getLabExampleActions = (example) => {
  const mode = String(example?.defaultMode || 'designer')
  return EXAMPLE_ACTIONS_BY_MODE[mode] || EXAMPLE_ACTIONS_BY_MODE.designer
}

export const buildLabExampleDownloadBundle = (example) =>
  buildExampleBundle(example, { source: 'sisad-pdfme-lab', version: 2, getActions: getLabExampleActions })

export const buildLabExampleDownloadHref = (example) =>
  buildExampleHref(example, { source: 'sisad-pdfme-lab', version: 2, getActions: getLabExampleActions })

export const getLabExamples = () => LAB_EXAMPLES.map(cloneExample)

export const getLabExampleById = (id) => {
  const example = LAB_EXAMPLES.find((entry) => entry.id === id)
  return example ? cloneExample(example) : undefined
}

export const getLabExampleByPath = (path) => {
  const example = LAB_EXAMPLES.find((entry) => entry.path === path)
  return example ? cloneExample(example) : undefined
}

export const LAB_EXAMPLES_COUNT = LAB_EXAMPLES.length
