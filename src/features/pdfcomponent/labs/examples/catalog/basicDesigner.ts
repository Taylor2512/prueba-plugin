import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import { text, signature } from '@sisad-pdfme/schemas'
import { createSchema, createAuditMetadata } from '@/features/pdfcomponent/labs/builders/schemaFactory'
import {
  createSchemaShowcasePages as createShowcasePagesCore,
} from '@/features/pdfcomponent/labs/builders/schemaShowcase'
import {
  createTemplate,
  appendTemplatePages,
  createCollaboration,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate'
import { createLabExample } from '../createLabExample.ts'
import { BASIC_SIGNATURE_PROVIDERS } from './generatorRuntime.ts'

const getTemplatePdfUrl = (fileName) => `/templates/${encodeURIComponent(fileName)}`

const LAB_PDFS = {
  basic: getTemplatePdfUrl('test.pdf'),
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
})

const createSignatureSchema = createSchemaFactory(signature.propPanel.defaultSchema, { x: 18, y: 88 }, {
  width: 60,
  height: 24,
})

const SCHEMA_EXAMPLE_OVERRIDES = {
  text: {
    name: 'customer_full_name',
    content: 'Taylor Demo',
    width: 92,
    height: 12,
  },
  signature: {
    name: 'review_signature',
    width: 60,
    height: 24,
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

const designerShowcasePages = createLabSchemaShowcasePages({
  scope: 'designer-showcase',
  ownerRecipientId: 'basic-user-1',
  startingPageNumber: basicDesignerTemplate.schemas.length + 1,
  auditOffset: 120000,
})

const basicDesignerShowcaseTemplate = appendTemplatePages(basicDesignerTemplate, designerShowcasePages)

export const basicDesignerLabExample = createLabExample({
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
})
