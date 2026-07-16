import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common'
import type { Template } from '@sisad-pdfme/common'
import { decorateCollaborationUsers } from '@/sisad-pdfme/collaboration/recipientPalette'
import { decorateTemplateWithCollaboration } from '@/sisad-pdfme/collaboration/schemaOwnershipAppearance'

export type LabHostDocument = {
  id: string
  name?: string
  label: string
  pageCount?: number
  basePdf?: Template['basePdf']
  template?: Template
  metadata?: Record<string, unknown>
}

export type LabHostRecipient = {
  id: string
  name: string
  role?: string
  team?: string
  color?: string
  metadata?: Record<string, unknown>
}

export type LabHostRuntimeOptions = {
  uploadedDocuments?: Array<{
    id?: string
    name?: string
    pageCount?: number
    template?: Template
    [key: string]: unknown
  }>
  signatureProviders?: unknown[]
  [key: string]: unknown
}

export type LabHostExample = {
  id: string
  title: string
  defaultMode?: string
  template: Template
  inputs?: unknown
  collaboration?: {
    activeUserId?: string
    actorId?: string
    sessionId?: string
    enabled?: boolean
    isGlobalView?: boolean
    users?: LabHostRecipient[]
  } | null
  runtimeOptions?: LabHostRuntimeOptions | null
}

export type NormalizedLabHostData = {
  template: Template
  inputs: unknown[]
  recipients: LabHostRecipient[]
  documents: LabHostDocument[]
  activeRecipientId: string
  signatureProviders: unknown[]
}

const buildDocumentLabel = (document: { id?: string; name?: string }) =>
  String(document?.name || document?.id || 'Documento').trim() || 'Documento'

const normalizeDocuments = (runtimeOptions: LabHostRuntimeOptions | null | undefined): LabHostDocument[] => {
  if (!runtimeOptions || !Array.isArray(runtimeOptions.uploadedDocuments)) return []

  return runtimeOptions.uploadedDocuments
    .map((document) => {
      const originalDocument = cloneDeep(document || {}) as Record<string, unknown>
      const template = document?.template
      const templateRecord = template && typeof template === 'object' ? template : null
      const basePdf = templateRecord ? (templateRecord as Template).basePdf : undefined
      const pageCount = typeof document?.pageCount === 'number'
        ? document.pageCount
        : Array.isArray(templateRecord?.schemas)
          ? templateRecord.schemas.length
          : undefined

      return {
        ...originalDocument,
        id: String(document?.id || document?.name || 'document').trim() || 'document',
        name: buildDocumentLabel(document),
        label: buildDocumentLabel(document),
        pageCount,
        basePdf,
        template: template || undefined,
        metadata: {
          ...cloneDeep(document || {}),
          template,
        },
      }
    })
    .filter((document) => Boolean(document.id))
}

export const normalizeLabHostData = (
  example: LabHostExample,
): NormalizedLabHostData => {
  const collaborationUsers = decorateCollaborationUsers((example?.collaboration?.users || []) as LabHostRecipient[])
  const template = decorateTemplateWithCollaboration(
    cloneDeep(example?.template || ({ schemas: [[]] } as Template)),
    collaborationUsers as unknown[],
  )
  const inputs = Array.isArray(example?.inputs) ? cloneDeep(example.inputs) : getInputFromTemplate(template)
  const activeRecipientId =
    example?.collaboration?.activeUserId ||
    example?.collaboration?.actorId ||
    collaborationUsers[0]?.id ||
    ''

  return {
    template,
    inputs,
    recipients: collaborationUsers,
    documents: normalizeDocuments(example?.runtimeOptions),
    activeRecipientId,
    signatureProviders: Array.isArray(example?.runtimeOptions?.signatureProviders)
      ? cloneDeep(example.runtimeOptions.signatureProviders)
      : [],
  }
}
