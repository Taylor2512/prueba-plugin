import { cloneDeep, getB64BasePdf, getInputFromTemplate } from '@sisad-pdfme/common'
import { checkbox, select, text, signature, builtInSchemaDefinitions, flatSchemaPlugins } from '@sisad-pdfme/schemas'
import { createInitialPdfmeTemplate } from '../template.js'
import { decorateCollaborationUsers, decorateTemplateWithCollaboration } from '../domain/collaborationAppearance.js'

const BASE_COLLABORATION_TIMESTAMP = 1713570000000

const getTemplatePdfUrl = (fileName) => `/templates/${encodeURIComponent(fileName)}`

const LAB_PDFS = {
  basic: getTemplatePdfUrl('sample-a4.pdf'),
  enterprise: getTemplatePdfUrl('CONVENIO DE CRÉDITO.pdf'),
  routingPrimary: getTemplatePdfUrl('Declaración de tratamiento de datos personales.pdf'),
  routingSecondary: getTemplatePdfUrl(
    'CERTIFICADO DE CULMINACIÓN DE MALLA CURRICULAR-MONTENEGRO ARELLANO JHONN TAYLOR-Malla.pdf',
  ),
  multiuser: getTemplatePdfUrl('Jhonn_Taylor_Montenegro_CV_ES.pdf'),
  generator: getTemplatePdfUrl('sample-multilingual-text.pdf'),
}

const SORTED_SCHEMA_DEFINITIONS = builtInSchemaDefinitions
  .slice()
  .sort((a, b) => `${a.category}-${a.label}`.localeCompare(`${b.category}-${b.label}`))

const SHOWCASE_GRID_POSITIONS = [
  { x: 18, y: 24 },
  { x: 112, y: 24 },
  { x: 18, y: 58 },
  { x: 112, y: 58 },
  { x: 18, y: 92 },
  { x: 112, y: 92 },
  { x: 18, y: 126 },
  { x: 112, y: 126 },
  { x: 18, y: 160 },
  { x: 112, y: 160 },
  { x: 18, y: 194 },
  { x: 112, y: 194 },
  { x: 18, y: 228 },
  { x: 112, y: 228 },
]

const sanitizeIdentifier = (value) =>
  String(value || 'lab-example')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lab-example'

const createSchema = (baseSchema, overrides = {}) => ({
  ...cloneDeep(baseSchema),
  ...cloneDeep(overrides),
})

const createTextSchema = (overrides = {}) =>
  createSchema(text.propPanel.defaultSchema, {
    position: { x: 18, y: 24 },
    width: 92,
    height: 12,
    fontSize: 12,
    ...overrides,
  })

const createSelectSchema = (overrides = {}) =>
  createSchema(select.propPanel.defaultSchema, {
    position: { x: 18, y: 46 },
    width: 92,
    height: 12,
    ...overrides,
  })

const createCheckboxSchema = (overrides = {}) =>
  createSchema(checkbox.propPanel.defaultSchema, {
    position: { x: 18, y: 66 },
    width: 8,
    height: 8,
    ...overrides,
  })

const createSignatureSchema = (overrides = {}) =>
  createSchema(signature.propPanel.defaultSchema, {
    position: { x: 18, y: 88 },
    width: 60,
    height: 24,
    ...overrides,
  })

const chunkItems = (items, size) => {
  const chunks = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

const createSchemaByType = (type, overrides = {}) => {
  const plugin = flatSchemaPlugins[type]
  if (!plugin?.propPanel?.defaultSchema) {
    throw new Error(`Schema type not registered for lab example generation: ${type}`)
  }

  return createSchema(plugin.propPanel.defaultSchema, {
    position: { x: 18, y: 24 },
    name: `${sanitizeIdentifier(type)}_field`,
    schemaUid: `schema-${sanitizeIdentifier(type)}`,
    ...overrides,
  })
}

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

const createSchemaShowcasePages = ({
  definitions = SORTED_SCHEMA_DEFINITIONS,
  scope,
  ownerRecipientId,
  fileId = `${sanitizeIdentifier(scope)}-showcase`,
  fileTemplateId = fileId,
  startingPageNumber = 1,
  auditOffset = 0,
}) =>
  chunkItems(definitions, SHOWCASE_GRID_POSITIONS.length).map((pageDefinitions, pageIndex) =>
    pageDefinitions.map((definition, itemIndex) => {
      const slug = sanitizeIdentifier(definition.type)
      return createSchemaByType(definition.type, {
        ...SCHEMA_EXAMPLE_OVERRIDES[definition.type],
        position: cloneDeep(SHOWCASE_GRID_POSITIONS[itemIndex]),
        name: `${sanitizeIdentifier(scope)}_${slug}`,
        schemaUid: `${sanitizeIdentifier(scope)}-${slug}`,
        fileId,
        fileTemplateId,
        pageNumber: startingPageNumber + pageIndex,
        ownerMode: 'single',
        ownerRecipientId,
        ...createAuditMetadata(ownerRecipientId, ownerRecipientId, auditOffset + pageIndex * 10000 + itemIndex * 1000),
      })
    }),
  )

const appendTemplatePages = (template, extraPages) => ({
  ...template,
  schemas: [...(template.schemas || []), ...cloneDeep(extraPages)],
})

const createTemplate = (schemas, options = {}) => {
  const initialTemplate = createInitialPdfmeTemplate()
  const nextSchemas = cloneDeep(Array.isArray(schemas) && schemas.length > 0 ? schemas : [[]])
  const safePageCount = Math.max(1, Number(options.pageCount || nextSchemas.length) || nextSchemas.length || 1)

  while (nextSchemas.length < safePageCount) {
    nextSchemas.push([])
  }

  return {
    ...initialTemplate,
    basePdf: options.basePdf || initialTemplate.basePdf,
    schemas: nextSchemas,
  }
}

const createUploadedDocument = ({ id, name, pdfFileName, pageCount, schemas }) => ({
  id,
  name,
  pageCount,
  template: createTemplate(schemas, {
    basePdf: getTemplatePdfUrl(pdfFileName),
    pageCount,
  }),
})

const createCommentAnchor = ({ schemaUid, fileId, pageNumber, x = 0, y = 0 }) => ({
  id: `${schemaUid}-anchor-${pageNumber || 1}`,
  schemaUid,
  fileId,
  pageNumber,
  x,
  y,
  resolved: false,
})

const createAuditMetadata = (createdBy, lastModifiedBy = createdBy, offset = 0) => ({
  createdBy,
  lastModifiedBy,
  createdAt: BASE_COLLABORATION_TIMESTAMP + offset,
  updatedAt: BASE_COLLABORATION_TIMESTAMP + offset + 60000,
})

const createCollaboration = (activeUserId, users, metadata = {}) => ({
  activeUserId,
  actorId: metadata.actorId || activeUserId,
  sessionId: metadata.sessionId || `lab-${activeUserId}`,
  enabled: metadata.enabled ?? true,
  users: decorateCollaborationUsers(users),
})

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

const createExample = ({
  id,
  path,
  title,
  description,
  status,
  defaultMode = 'designer',
  initialSchemaType = 'text',
  collaboration = null,
  template,
  runtimeOptions = null,
}) => {
  const safeCollaboration = collaboration ? cloneDeep(collaboration) : null
  const safeTemplate = decorateTemplateWithCollaboration(template, safeCollaboration?.users || [])
  const safeRuntimeOptions = runtimeOptions
    ? cloneDeep({
        ...runtimeOptions,
        uploadedDocuments: (runtimeOptions.uploadedDocuments || []).map((document) => ({
          ...document,
          template: decorateTemplateWithCollaboration(document.template, safeCollaboration?.users || []),
        })),
      })
    : null

  return {
    id,
    path,
    title,
    description,
    status,
    defaultMode,
    initialSchemaType,
    collaboration: safeCollaboration,
    template: safeTemplate,
    inputs: getInputFromTemplate(safeTemplate),
    runtimeOptions: safeRuntimeOptions,
  }
}

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

const multiDocumentPrimarySchemas = [
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
      y: 24,
    }),
  ],
  [],
]

const multiDocumentSecondarySchemas = [
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
      y: 24,
    }),
  ],
]

// Merge primary and secondary schemas into a single template view for the routing example
const multiDocumentRoutingTemplate = createTemplate(
  multiDocumentPrimarySchemas.map((page, idx) => page.concat(multiDocumentSecondarySchemas[idx] || [])),
  {
    basePdf: LAB_PDFS.routingPrimary,
    pageCount: 2,
  },
)

const multiDocumentRoutingDocuments = [
  createUploadedDocument({
    id: 'file-contract-a',
    name: 'Declaración de datos',
    pdfFileName: 'Declaración de tratamiento de datos personales.pdf',
    pageCount: 2,
    schemas: multiDocumentPrimarySchemas,
  }),
  createUploadedDocument({
    id: 'file-contract-b',
    name: 'Certificado académico',
    pdfFileName:
      'CERTIFICADO DE CULMINACIÓN DE MALLA CURRICULAR-MONTENEGRO ARELLANO JHONN TAYLOR-Malla.pdf',
    pageCount: 2,
    schemas: multiDocumentSecondarySchemas,
  }),
]

const multiuserCollaborationTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'multiuser-owner-name',
      fileTemplateId: 'multiuser-contract',
      fileId: 'multiuser-contract',
      name: 'owner_name',
      content: 'Sales owner',
      ownerMode: 'single',
      ownerRecipientId: 'sales-user-1',
      createdBy: 'sales-user-1',
      lastModifiedBy: 'sales-user-1',
      createdAt: BASE_COLLABORATION_TIMESTAMP,
      updatedAt: BASE_COLLABORATION_TIMESTAMP + 60000,
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
        lockedAt: 1713571800000,
        reason: 'Approval handoff',
      },
      y: 40,
    }),
  ],
], { basePdf: LAB_PDFS.multiuser, pageCount: 2 })

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

const designerShowcasePages = createSchemaShowcasePages({
  scope: 'designer-showcase',
  ownerRecipientId: 'basic-user-1',
  auditOffset: 120000,
})

const collaborationShowcasePages = createSchemaShowcasePages({
  scope: 'collaboration-showcase',
  ownerRecipientId: 'ops-user-1',
  fileId: 'enterprise-contract',
  fileTemplateId: 'enterprise-contract',
  startingPageNumber: 3,
  auditOffset: 240000,
})

const generatorShowcasePages = createSchemaShowcasePages({
  scope: 'generator-showcase',
  ownerRecipientId: 'generator-user-1',
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
  createExample({
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
  createExample({
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
  createExample({
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
  createExample({
    id: 'multi-document-routing',
    path: '/lab/multi-document-routing',
    title: 'Multidocumento integral',
    description: 'Ruta integral para asignaciones por documento, página y destinatario con carga de múltiples PDFs y handoff entre archivos.',
    status: 'Listo para validar rutas de documentos, destinatarios y descarga/exportación en un solo flujo',
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
  createExample({
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

const cloneExample = (example) => ({
  ...example,
  template: cloneDeep(example.template),
  inputs: cloneDeep(example.inputs),
  runtimeOptions: cloneDeep(example.runtimeOptions),
})

const sanitizeDownloadName = sanitizeIdentifier

export const getLabExampleDownloadFilename = (example) => {
  const exampleId = sanitizeDownloadName(example?.id)
  return `${exampleId}.json`
}

export const getLabExampleActions = (example) => {
  const mode = String(example?.defaultMode || 'designer')
  return EXAMPLE_ACTIONS_BY_MODE[mode] || EXAMPLE_ACTIONS_BY_MODE.designer
}

const inlineTemplateBasePdf = async (template) => {
  if (!template) return template

  const nextTemplate = cloneDeep(template)
  nextTemplate.basePdf = await getB64BasePdf(nextTemplate.basePdf)
  return nextTemplate
}

const inlineRuntimeOptionsBasePdfs = async (runtimeOptions) => {
  if (!runtimeOptions) return null

  const nextRuntimeOptions = cloneDeep(runtimeOptions)
  if (!Array.isArray(nextRuntimeOptions.uploadedDocuments) || nextRuntimeOptions.uploadedDocuments.length === 0) {
    return nextRuntimeOptions
  }

  nextRuntimeOptions.uploadedDocuments = await Promise.all(
    nextRuntimeOptions.uploadedDocuments.map(async (document) => ({
      ...document,
      template: await inlineTemplateBasePdf(document.template),
    })),
  )

  return nextRuntimeOptions
}

export const buildLabExampleDownloadBundle = async (example) => {
  const safeExample = cloneExample(example)
  const [template, runtimeOptions] = await Promise.all([
    inlineTemplateBasePdf(safeExample.template),
    inlineRuntimeOptionsBasePdfs(safeExample.runtimeOptions),
  ])

  return {
    source: 'sisad-pdfme-lab',
    version: 2,
    assetEncoding: 'base64-inline',
    exportedAt: new Date().toISOString(),
    example: {
      id: safeExample.id,
      path: safeExample.path,
      title: safeExample.title,
      description: safeExample.description,
      status: safeExample.status,
      defaultMode: safeExample.defaultMode,
      initialSchemaType: safeExample.initialSchemaType,
    },
    template,
    inputs: safeExample.inputs,
    collaboration: safeExample.collaboration,
    runtimeOptions,
    availableActions: getLabExampleActions(safeExample),
  }
}

export const buildLabExampleDownloadHref = async (example) => {
  const bundle = await buildLabExampleDownloadBundle(example)
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(bundle, null, 2))}`
}

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
