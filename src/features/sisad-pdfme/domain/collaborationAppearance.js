import { cloneDeep } from '@sisad-pdfme/common'

const DEFAULT_COLLABORATOR_COLORS = ['#2563EB', '#D946EF', '#F97316', '#0F766E', '#CA8A04', '#7C3AED']

const normalizeId = (value) => (typeof value === 'string' ? value.trim() : '')

const buildOwnerIds = (schema) => {
  const values = []

  if (Array.isArray(schema?.ownerRecipientIds)) values.push(...schema.ownerRecipientIds)
  if (schema?.ownerRecipientId) values.push(schema.ownerRecipientId)

  return Array.from(new Set(values.map(normalizeId).filter(Boolean)))
}

export const decorateCollaborationUsers = (users = []) =>
  users.map((user, index) => ({
    ...user,
    color: user?.color || DEFAULT_COLLABORATOR_COLORS[index % DEFAULT_COLLABORATOR_COLORS.length],
  }))

export const resolveCollaboratorById = (collaboratorId, users = []) => {
  const normalizedId = normalizeId(collaboratorId)
  if (!normalizedId) return null
  return users.find((user) => normalizeId(user?.id) === normalizedId) || null
}

export const withAlpha = (color, alpha) => {
  if (typeof color !== 'string') return color
  const normalized = color.trim()
  if (!/^#([0-9a-fA-F]{6})$/.test(normalized)) return normalized

  const hex = normalized.slice(1)
  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export const buildCollaboratorChipStyle = (color, isActive = false) => {
  if (typeof color !== 'string') return undefined

  const normalized = color.trim()
  if (!normalized) return undefined

  const alpha = isActive ? 0.18 : 0.1
  const ringAlpha = isActive ? 0.45 : 0.25

  return {
    color: normalized,
    backgroundColor: withAlpha(normalized, alpha),
    boxShadow: `inset 0 0 0 1px ${withAlpha(normalized, ringAlpha)}`,
  }
}

export const resolveSchemaOwnerColor = (schema, users = []) => {
  const explicitUserColor = typeof schema?.userColor === 'string' ? schema.userColor.trim() : ''
  if (explicitUserColor) return explicitUserColor

  const explicitColor = typeof schema?.ownerColor === 'string' ? schema.ownerColor.trim() : ''
  if (explicitColor) return explicitColor

  const candidates = [schema?.ownerRecipientId, schema?.lastModifiedBy, ...buildOwnerIds(schema), schema?.createdBy]

  for (const candidate of candidates) {
    const collaborator = resolveCollaboratorById(candidate, users)
    if (collaborator?.color) return collaborator.color
  }

  return ''
}

export const decorateSchemaWithCollaboration = (schema, users = []) => {
  if (!schema || typeof schema !== 'object') return schema

  const ownerRecipientIds = buildOwnerIds(schema)
  const ownerRecipientId = normalizeId(schema.ownerRecipientId) || ownerRecipientIds[0] || undefined
  let ownerMode = schema.ownerMode
  if (!ownerMode) {
    if (ownerRecipientIds.length > 1) ownerMode = 'multi'
    else if (ownerRecipientIds.length === 1) ownerMode = 'single'
  }
  const ownerColor = resolveSchemaOwnerColor(schema, users)
  const authorColor =
    resolveCollaboratorById(schema?.lastModifiedBy, users)?.color ||
    resolveCollaboratorById(schema?.createdBy, users)?.color ||
    ownerColor

  const nextSchema = { ...schema }

  if (ownerRecipientId && nextSchema.ownerRecipientId !== ownerRecipientId) {
    nextSchema.ownerRecipientId = ownerRecipientId
  }

  if (
    ownerRecipientIds.length > 0 &&
    (ownerRecipientIds.length !== (Array.isArray(nextSchema.ownerRecipientIds) ? nextSchema.ownerRecipientIds.length : 0) ||
      ownerRecipientIds.some((value, index) => value !== nextSchema.ownerRecipientIds?.[index]))
  ) {
    nextSchema.ownerRecipientIds = ownerRecipientIds
  }

  if (ownerMode && nextSchema.ownerMode !== ownerMode) {
    nextSchema.ownerMode = ownerMode
  }

  if (ownerColor && nextSchema.ownerColor !== ownerColor) {
    nextSchema.ownerColor = ownerColor
  }

  if (authorColor && nextSchema.userColor !== authorColor) {
    nextSchema.userColor = authorColor
  }

  return nextSchema
}

export const decorateTemplateWithCollaboration = (template, users = []) => {
  if (!template || !Array.isArray(template.schemas)) return cloneDeep(template)

  return {
    ...cloneDeep(template),
    schemas: template.schemas.map((pageSchemas = []) =>
      pageSchemas.map((schema) => decorateSchemaWithCollaboration(schema, users)),
    ),
  }
}
