import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import {
  resolveRuntimeSchemaAccess,
  resolveSchemaAccessState,
} from '@/sisad-pdfme/ui/collaboration/schemaRuntimeAccess'

const LAB_MODE_LABELS = {
  designer: 'Diseñador',
  form: 'Formulario',
  viewer: 'Visor',
}

const LAB_COVERAGE_LABELS = {
  canvas: 'Canvas',
  schemas: 'Schemas',
  collaboration: 'Colaboración',
  multiDocument: 'Multidocumento',
  signature: 'Firma',
  generator: 'Generator',
  converter: 'Converter',
  viewer: 'Viewer',
  form: 'Form',
}

const LAB_EXAMPLE_PRESENTATION = {
  'basic-designer': {
    coverage: ['canvas', 'schemas', 'viewer', 'form'],
    focus: 'Editor integral',
    summary: 'Valida selección, edición y alta de campos sobre PDF real.',
  },
  'enterprise-collaboration': {
    coverage: ['canvas', 'schemas', 'collaboration', 'signature'],
    focus: 'Colaboración integral',
    summary: 'Valida ownership, locks, comentarios y cobertura enterprise.',
  },
  'multiuser-collaboration': {
    coverage: ['canvas', 'schemas', 'collaboration'],
    focus: 'Colaboración multiusuario',
    summary: 'Valida cambio de usuario, permisos y edición compartida.',
  },
  'multi-document-routing': {
    coverage: ['canvas', 'schemas', 'multiDocument', 'form', 'viewer'],
    focus: 'Multidocumento integral',
    summary: 'Valida ruteo por documento, página y destinatario con cobertura total de schemas.',
  },
  'generator-runtime': {
    coverage: ['generator', 'converter', 'form', 'viewer'],
    focus: 'Runtime integral',
    summary: 'Valida captura, generación, conversión y resultados.',
  },
}

const LAB_COLOR_CLASSES = {
  '#2563eb': 'text-blue-700 bg-[rgba(219,234,254,0.95)]',
  '#d946ef': 'text-fuchsia-700 bg-[rgba(250,232,255,0.92)]',
  '#f97316': 'text-orange-700 bg-[rgba(255,237,213,0.95)]',
  '#0f766e': 'text-teal-700 bg-[rgba(204,251,241,0.95)]',
  '#ca8a04': 'text-amber-700 bg-[rgba(254,243,199,0.95)]',
  '#7c3aed': 'text-violet-700 bg-[rgba(237,233,254,0.95)]',
}

export const getLabModeLabel = (mode) => LAB_MODE_LABELS[mode] || String(mode || '')

export const getLabExamplePresentation = (example) => {
  const meta = LAB_EXAMPLE_PRESENTATION[example?.id] || {}
  const modeLabel = getLabModeLabel(example?.defaultMode)
  const coverage = Array.isArray(meta.coverage)
    ? meta.coverage.map((key) => LAB_COVERAGE_LABELS[key] || key).filter(Boolean)
    : []

  return {
    modeLabel,
    focus: meta.focus || example?.title || modeLabel,
    summary: meta.summary || example?.description || '',
    coverage,
    recommended: example?.id === 'multi-document-routing',
  }
}

export const getLabCoverageLabel = (key) => LAB_COVERAGE_LABELS[key] || key

export const getCollaboratorToneClass = (color) => {
  const normalized = String(color || '').trim().toLowerCase()
  if (!normalized) return ''
  return LAB_COLOR_CLASSES[normalized] || ''
}

export const flattenSchemasFromTemplate = (template) => {
  if (!template || !Array.isArray(template.schemas)) return []
  return template.schemas.flatMap((page) => (Array.isArray(page) ? page : []))
}

export const getExampleSchemas = (example) => {
  const mainSchemas = flattenSchemasFromTemplate(example?.template)
  const uploadedSchemas = Array.isArray(example?.runtimeOptions?.uploadedDocuments)
    ? example.runtimeOptions.uploadedDocuments.flatMap((document) => flattenSchemasFromTemplate(document?.template))
    : []

  return [...mainSchemas, ...uploadedSchemas]
}

export const getUniqueSchemaTypes = (schemas = []) =>
  new Set(schemas.map((schema) => String(schema?.type || '').trim()).filter(Boolean))

export const getLabCoverageCounts = (examples = []) => {
  const counts = new Map()

  examples.forEach((example) => {
    const coverage = getLabExamplePresentation(example).coverage
    coverage.forEach((label) => {
      counts.set(label, (counts.get(label) || 0) + 1)
    })
  })

  return counts
}

const EXCLUDED_SCHEMA_TYPES = new Set(['qrcode'])
const ALL_SCHEMA_TYPES = new Set(
  builtInSchemaDefinitions
    .map((definition) => String(definition?.type || '').trim())
    .filter((type) => type && !EXCLUDED_SCHEMA_TYPES.has(type)),
)

export const getLabExampleSchemaStats = (example) => {
  const schemas = getExampleSchemas(example)
  const schemaTypes = getUniqueSchemaTypes(schemas)

  const registeredSchemaTypes = ALL_SCHEMA_TYPES.size
  const usedSchemaTypes = schemaTypes.size
  const coverageRatio = registeredSchemaTypes > 0 ? usedSchemaTypes / registeredSchemaTypes : 0

  return {
    totalSchemas: schemas.length,
    usedSchemaTypes,
    registeredSchemaTypes,
    coverageRatio,
    isFullCoverage: usedSchemaTypes >= registeredSchemaTypes && registeredSchemaTypes > 0,
  }
}

export const getLabCollaborationSummary = ({
  schemas = [],
  activeUserId = '',
  isGlobalView = false,
} = {}) => {
  const collaborationContext = {
    activeRecipientId: activeUserId || null,
    activeRecipient: activeUserId ? { id: activeUserId, name: activeUserId } : null,
    isGlobalView,
    canEditStructure: true,
    actorId: activeUserId || null,
    actorColor: null,
    recipientColorMap: new Map(),
    recipientNameMap: new Map(),
  }

  const schemaAccess = schemas.map((schema) => {
    const runtimeAccess = resolveRuntimeSchemaAccess(schema, 'designer', collaborationContext)
    const accessState = resolveSchemaAccessState(schema, collaborationContext)
    return {
      runtimeAccess,
      accessState,
    }
  })

  const visibleSchemas = schemaAccess.filter(({ runtimeAccess }) => runtimeAccess.visible)
  const editableSchemas = schemaAccess.filter(
    ({ runtimeAccess, accessState }) => runtimeAccess.visible && runtimeAccess.editable && accessState.canEditProperties,
  )
  const lockedCount = schemaAccess.filter(({ runtimeAccess, accessState }) =>
    runtimeAccess.visible && (runtimeAccess.reason === 'locked' || accessState.isObjectLocked || accessState.isLockedByOther),
  ).length

  const commentCount = schemas.reduce((total, schema) => {
    const inlineComments = Array.isArray(schema?.comments) ? schema.comments.length : 0
    const commentAnchors = Array.isArray(schema?.commentAnchors) ? schema.commentAnchors.length : 0
    const legacyAnchors = Array.isArray(schema?.commentsAnchors) ? schema.commentsAnchors.length : 0
    const storedCount = Number(schema?.commentsCount || 0)
    return total + Math.max(storedCount, inlineComments + commentAnchors + legacyAnchors)
  }, 0)

  return {
    visibleCount: visibleSchemas.length,
    editableCount: editableSchemas.length,
    lockedCount,
    commentCount,
  }
}
