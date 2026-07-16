import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { text, select, checkbox } from '@sisad-pdfme/schemas'
import { createSchema, createCommentAnchor, createAuditMetadata } from '@/features/pdfcomponent/labs/builders/schemaFactory'
import {
  createSchemaShowcasePages as createShowcasePagesCore,
} from '@/features/pdfcomponent/labs/builders/schemaShowcase'
import {
  createTemplate,
  appendTemplatePages,
  createCollaboration,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate'
import { createLabExample } from '../createLabExample.ts'

const getTemplatePdfUrl = (fileName) => `/templates/${encodeURIComponent(fileName)}`

const LAB_PDFS = {
  generator: getTemplatePdfUrl('test.pdf'),
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

const generatorShowcasePages = createLabSchemaShowcasePages({
  scope: 'generator-showcase',
  ownerRecipientId: 'generator-user-1',
  startingPageNumber: generatorRuntimeTemplate.schemas.length + 1,
  auditOffset: 360000,
})

const generatorRuntimeShowcaseTemplate = appendTemplatePages(generatorRuntimeTemplate, generatorShowcasePages)

export const BASIC_SIGNATURE_PROVIDERS = [
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

export const generatorRuntimeLabExample = createLabExample({
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
  runtimeOptions: {
    signatureProviders: BASIC_SIGNATURE_PROVIDERS,
  },
})
