import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common'
import { checkbox, select, text, signature } from '@sisad-pdfme/schemas'
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

const LAB_EXAMPLES = [
  createExample({
    id: 'basic-designer',
    path: '/lab/basic-designer',
    title: 'Editor básico',
    description: 'Arranca en modo designer sobre un PDF real para crear, mover y revisar campos.',
    status: 'Listo para editar sobre sample-a4.pdf',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('basic-user-1', [
      { id: 'basic-user-1', name: 'Diseño', role: 'owner', team: 'lab-team', color: '#2563EB' },
      { id: 'basic-user-2', name: 'QA', role: 'reviewer', team: 'lab-team', color: '#D946EF' },
    ], { sessionId: 'basic-designer-session', actorId: 'basic-user-1' }),
    template: basicDesignerTemplate,
  }),
  createExample({
    id: 'enterprise-collaboration',
    path: '/lab/enterprise-collaboration',
    title: 'Enterprise con colaboración',
    description: 'Incluye owners, comentarios y bloqueo sobre un convenio real para revisar contratos multiusuario.',
    status: 'Preparado para probar metadatos colaborativos sobre PDF real',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('ops-user-1', [
      { id: 'sales-user-1', name: 'Equipo de Ventas', role: 'editor', team: 'sales-team', color: '#2563EB' },
      { id: 'legal-user-1', name: 'Equipo Legal', role: 'reviewer', team: 'legal-team', color: '#D946EF' },
      { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops-team', color: '#F97316' },
    ], { sessionId: 'enterprise-collaboration-session', actorId: 'ops-user-1' }),
    template: enterpriseCollaborationTemplate,
  }),
  createExample({
    id: 'multi-document-routing',
    path: '/lab/multi-document-routing',
    title: 'Multidocumento y destinatarios',
    description: 'Distribuye schemas por archivo, página y destinatario con dos PDFs precargados.',
    status: 'Listo para validar asignaciones por documento, página y destinatario',
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
    id: 'multiuser-collaboration',
    path: '/lab/multiuser-collaboration',
    title: 'Colaboración multiusuario',
    description: 'Muestra ownership individual, grupal y compartido sobre un PDF real con registro de usuarios y roles.',
    status: 'Listo para validar ownership por usuario y grupos sobre PDF real',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('sales-user-1', [
      { id: 'sales-user-1', name: 'Ventas Ejecutivas', role: 'owner', team: 'sales-team', color: '#2563EB' },
      { id: 'legal-user-1', name: 'Revisor Legal', role: 'reviewer', team: 'legal-team', color: '#D946EF' },
      { id: 'ops-user-1', name: 'Operaciones', role: 'approver', team: 'ops-team', color: '#F97316' },
    ], { sessionId: 'multiuser-collaboration-session', actorId: 'sales-user-1' }),
    template: multiuserCollaborationTemplate,
  }),
  createExample({
    id: 'generator-runtime',
    path: '/lab/generator-runtime',
    title: 'Generación y conversión',
    description: 'Arranca en modo form sobre un PDF real para probar generate, pdf2size, pdf2img e img2pdf.',
    status: 'Listo para generar PDF y probar conversiones sobre documento real',
    defaultMode: 'form',
    initialSchemaType: 'select',
    collaboration: createCollaboration('generator-user-1', [
      { id: 'generator-user-1', name: 'Formulario', role: 'owner', team: 'automation-team', color: '#2563EB' },
      { id: 'generator-user-2', name: 'Conversión', role: 'reviewer', team: 'automation-team', color: '#D946EF' },
    ], { sessionId: 'generator-runtime-session', actorId: 'generator-user-1' }),
    template: generatorRuntimeTemplate,
  }),
]

const cloneExample = (example) => ({
  ...example,
  template: cloneDeep(example.template),
  inputs: cloneDeep(example.inputs),
  runtimeOptions: cloneDeep(example.runtimeOptions),
})

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
