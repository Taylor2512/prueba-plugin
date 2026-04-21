import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common'
import { checkbox, select, text } from '@sisad-pdfme/schemas'
import { createInitialPdfmeTemplate } from '../template.js'

const BASE_COLLABORATION_TIMESTAMP = 1713570000000

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

const createTemplate = (schemas) => ({
  ...createInitialPdfmeTemplate(),
  schemas,
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
  users,
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
}) => {
  const safeTemplate = cloneDeep(template)

  return {
    id,
    path,
    title,
    description,
    status,
    defaultMode,
    initialSchemaType,
    collaboration: collaboration ? cloneDeep(collaboration) : null,
    template: safeTemplate,
    inputs: getInputFromTemplate(safeTemplate),
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
  ],
])

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
])

const multiDocumentRoutingTemplate = createTemplate([
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
      pageNumber: 1,
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 45000),
      name: 'contract_date',
      content: '2026-05-01',
      y: 40,
    }),
  ],
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
      y: 40,
    }),
  ],
])

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
])

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
])

const LAB_EXAMPLES = [
  createExample({
    id: 'basic-designer',
    path: '/lab/basic-designer',
    title: 'Editor básico',
    description: 'Arranca en modo designer con una plantilla mínima para crear y mover campos.',
    status: 'Listo para editar el template base',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('basic-user-1', [
      { id: 'basic-user-1', name: 'Diseño', role: 'owner', team: 'lab-team' },
      { id: 'basic-user-2', name: 'QA', role: 'reviewer', team: 'lab-team' },
    ], { sessionId: 'basic-designer-session', actorId: 'basic-user-1' }),
    template: basicDesignerTemplate,
  }),
  createExample({
    id: 'enterprise-collaboration',
    path: '/lab/enterprise-collaboration',
    title: 'Enterprise con colaboración',
    description: 'Incluye owners, comentarios y bloqueo para revisar contratos multiusuario.',
    status: 'Preparado para probar metadatos colaborativos',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('ops-user-1', [
      { id: 'sales-user-1', name: 'Equipo de Ventas', role: 'editor', team: 'sales-team' },
      { id: 'legal-user-1', name: 'Equipo Legal', role: 'reviewer', team: 'legal-team' },
      { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops-team' },
    ], { sessionId: 'enterprise-collaboration-session', actorId: 'ops-user-1' }),
    template: enterpriseCollaborationTemplate,
  }),
  createExample({
    id: 'multi-document-routing',
    path: '/lab/multi-document-routing',
    title: 'Multidocumento y destinatarios',
    description: 'Distribuye schemas por archivo, página y destinatario para flujos de entrega.',
    status: 'Listo para validar asignaciones por destinatario',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('recipient-1', [
      { id: 'recipient-1', name: 'Cliente Principal', role: 'signer' },
      { id: 'recipient-2', name: 'Avalista', role: 'signer' },
      { id: 'routing-user-1', name: 'Mesa de entrega', role: 'coordinator' },
    ], { sessionId: 'multi-document-routing-session', actorId: 'routing-user-1' }),
    template: multiDocumentRoutingTemplate,
  }),
  createExample({
    id: 'multiuser-collaboration',
    path: '/lab/multiuser-collaboration',
    title: 'Colaboración multiusuario',
    description: 'Muestra ownership individual, grupal y compartido con registro de usuarios y roles.',
    status: 'Listo para validar ownership por usuario y grupos',
    defaultMode: 'designer',
    initialSchemaType: 'text',
    collaboration: createCollaboration('sales-user-1', [
      { id: 'sales-user-1', name: 'Ventas Ejecutivas', role: 'owner', team: 'sales-team' },
      { id: 'legal-user-1', name: 'Revisor Legal', role: 'reviewer', team: 'legal-team' },
      { id: 'ops-user-1', name: 'Operaciones', role: 'approver', team: 'ops-team' },
    ], { sessionId: 'multiuser-collaboration-session', actorId: 'sales-user-1' }),
    template: multiuserCollaborationTemplate,
  }),
  createExample({
    id: 'generator-runtime',
    path: '/lab/generator-runtime',
    title: 'Generación y conversión',
    description: 'Arranca en modo form para probar generate, pdf2size, pdf2img e img2pdf.',
    status: 'Listo para generar PDF y probar conversiones',
    defaultMode: 'form',
    initialSchemaType: 'select',
    collaboration: createCollaboration('generator-user-1', [
      { id: 'generator-user-1', name: 'Formulario', role: 'owner', team: 'automation-team' },
      { id: 'generator-user-2', name: 'Conversión', role: 'reviewer', team: 'automation-team' },
    ], { sessionId: 'generator-runtime-session', actorId: 'generator-user-1' }),
    template: generatorRuntimeTemplate,
  }),
]

const cloneExample = (example) => ({
  ...example,
  template: cloneDeep(example.template),
  inputs: cloneDeep(example.inputs),
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
