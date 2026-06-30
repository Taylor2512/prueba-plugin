import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'

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

const LAB_COLOR_TOKENS = {
  '#2563eb': 'blue',
  '#d946ef': 'fuchsia',
  '#f97316': 'orange',
  '#0f766e': 'teal',
  '#ca8a04': 'amber',
  '#7c3aed': 'violet',
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
  }
}

export const getLabCoverageLabel = (key) => LAB_COVERAGE_LABELS[key] || key

export const getCollaboratorToneClass = (color) => {
  const normalized = String(color || '').trim().toLowerCase()
  if (!normalized) return ''
  return LAB_COLOR_TOKENS[normalized] ? `sisad-pdfme-lab-chip-tone-${LAB_COLOR_TOKENS[normalized]}` : ''
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
  const normalizeValue = (value) => String(value || '').trim()
  const getOwnerIds = (schema) => {
    const ids = []
    if (Array.isArray(schema?.ownerRecipientIds)) ids.push(...schema.ownerRecipientIds)
    if (schema?.ownerRecipientId) ids.push(schema.ownerRecipientId)
    return Array.from(new Set(ids.map(normalizeValue).filter(Boolean)))
  }

  // Visibility/editability follow ASSIGNMENT (owner), not authorship — same rule
  // as schemaMatchesCollaborationView so counters match the canvas. The old
  // `schemaOwner === activeUserId` (createdBy/lastModifiedBy) clause leaked
  // other recipients' schemas the active user authored.
  const visibleSchemas = schemas.filter((schema) => {
    if (isGlobalView) return true
    const ownerIds = getOwnerIds(schema)
    const sharedOwner = normalizeValue(schema?.ownerMode) === 'shared'
    return ownerIds.length === 0 || ownerIds.includes(activeUserId) || sharedOwner
  })

  const editableSchemas = visibleSchemas.filter((schema) => {
    const ownerIds = getOwnerIds(schema)
    const sharedOwner = normalizeValue(schema?.ownerMode) === 'shared'
    const lockedBy = normalizeValue(schema?.lock?.lockedBy)
    const isReadonly = Boolean(schema?.readonly || schema?.__designer?.ownership?.readonly)
    const ownershipMatches =
      ownerIds.length === 0 || ownerIds.includes(activeUserId) || sharedOwner

    return ownershipMatches && !isReadonly && (!lockedBy || lockedBy === activeUserId)
  })

  const lockedCount = schemas.filter((schema) => {
    const lockedBy = normalizeValue(schema?.lock?.lockedBy)
    return Boolean(lockedBy && lockedBy !== activeUserId)
  }).length

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
