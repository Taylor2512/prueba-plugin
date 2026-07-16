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
  createCollaboration,
  createExample,
  cloneExample,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate'
import {
  buildExampleBundle,
  getExampleBundleFilename,
} from '@/features/pdfcomponent/labs/export/buildExampleBundle'
import { buildExampleHref } from '@/features/pdfcomponent/labs/export/downloadExampleBundle'
import { basicDesignerLabExample } from './catalog/basicDesigner.ts'
import { multiDocumentRoutingLabExample } from './catalog/multiDocumentRouting.ts'
import { BASIC_SIGNATURE_PROVIDERS, generatorRuntimeLabExample } from './catalog/generatorRuntime.ts'
import {
  enterpriseCollaborationLabExample,
  multiuserCollaborationLabExample,
} from './catalog/collaborationShowcases.ts'

const BASE_COLLABORATION_TIMESTAMP = 1713570000000

const getTemplatePdfUrl = (fileName) => `/templates/${encodeURIComponent(fileName)}`

const LAB_PDFS = {
  basic: getTemplatePdfUrl('test.pdf'),
  multiuser: getTemplatePdfUrl('test.pdf'),
  generator: getTemplatePdfUrl('test.pdf'),
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

const LAB_EXAMPLES = [
  basicDesignerLabExample,
  enterpriseCollaborationLabExample,
  multiuserCollaborationLabExample,
  multiDocumentRoutingLabExample,
  generatorRuntimeLabExample,
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
