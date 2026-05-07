import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildSchemaAssignments } from '@sisad-pdfme/common'
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas'
import {
  buildLabExampleDownloadBundle,
  getLabExampleActions,
  getLabExampleDownloadFilename,
  getLabExampleById,
  getLabExampleByPath,
  getLabExamples,
} from '../../src/features/pdfcomponent/examples/labExamples.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('sisad-pdfme lab examples', () => {
  it('exposes the documented example catalog', () => {
    const examples = getLabExamples()

    expect(examples.map((example) => example.id)).toEqual([
      'basic-designer',
      'enterprise-collaboration',
      'multi-document-routing',
      'generator-runtime',
    ])

    expect(examples).toHaveLength(4)
    expect(examples.every((example) => example.path.startsWith('/lab/'))).toBe(true)

    const basicExample = getLabExampleById('basic-designer')
    expect(basicExample?.path).toBe('/lab/basic-designer')
    expect(basicExample?.template.schemas[0].some((schema) => schema.schemaUid === 'basic-full-name')).toBe(true)
    expect(basicExample?.inputs[0].full_name).toBe('Ada Lovelace')
    expect(basicExample?.collaboration?.sessionId).toBe('basic-designer-session')
    expect(basicExample?.collaboration?.actorId).toBe('basic-user-1')

    expect(getLabExampleByPath('/lab/basic-designer')?.id).toBe('basic-designer')
  })

  it('covers every built-in schema type inside the consolidated routes', () => {
    const examples = getLabExamples()
    const schemaTypesInCatalog = Array.from(
      new Set(
        examples
          .flatMap((example) => example.template.schemas)
          .flatMap((page) => page)
          .map((schema) => schema.type),
      ),
    )

    expect(schemaTypesInCatalog.sort()).toEqual(
      builtInSchemaDefinitions.map((definition) => definition.type).sort(),
    )

    const basicExample = getLabExampleById('basic-designer')
    expect(basicExample?.template.schemas.length).toBeGreaterThan(1)
    expect(
      basicExample?.template.schemas.flat().some((schema) => schema.type === 'qrcode'),
    ).toBe(true)
    expect(
      basicExample?.template.schemas.flat().some((schema) => schema.type === 'signature'),
    ).toBe(true)
  })

  it('keeps a collaboration roster and session on every example', () => {
    const examples = getLabExamples()

    expect(examples.every((example) => example.collaboration?.sessionId)).toBe(true)
    expect(examples.every((example) => Array.isArray(example.collaboration?.users) && example.collaboration.users.length > 0)).toBe(true)
  })

  it('preserves collaboration metadata in the enterprise example', () => {
    const example = getLabExampleById('enterprise-collaboration')

    expect(example?.template.schemas[0][0].ownerMode).toBe('multi')
    expect(example?.template.schemas[0][0].commentsCount).toBe(1)
    expect(example?.template.schemas[0][0].comments?.[0]?.text).toContain('identificador')
    expect(example?.template.schemas[0][0].commentAnchors?.length).toBe(1)
    expect(example?.template.schemas[0][1].state).toBe('locked')
    expect(example?.template.schemas[0][1].lock?.lockedBy).toBe('ops-user-1')
  })

  it('groups assignments per recipient, file and page for the multi-document example', () => {
    const example = getLabExampleById('multi-document-routing')

    const assignments = buildSchemaAssignments(example?.template.schemas || [])
    expect(assignments['recipient-1']['file-contract-a']['1']).toEqual([
      'multi-contract-name',
      'multi-contract-date',
    ])
    expect(assignments['recipient-2']['file-contract-b']['2']).toEqual([
      'multi-annex-name',
      'multi-annex-sign',
    ])
  })

  it('exposes a shared multiuser roster and assignment map for all collaborators', () => {
    const example = getLabExampleById('enterprise-collaboration')
    const multiuserOwnerSchema = example?.template.schemas
      .flat()
      .find((schema) => schema.schemaUid === 'multiuser-owner-name')
    const multiuserTeamSchema = example?.template.schemas
      .flat()
      .find((schema) => schema.schemaUid === 'multiuser-team-note')
    const multiuserLockedSchema = example?.template.schemas
      .flat()
      .find((schema) => schema.schemaUid === 'multiuser-locked-approval')
    const multiuserSharedSchema = example?.template.schemas
      .flat()
      .find((schema) => schema.schemaUid === 'multiuser-shared-summary')

    expect(example?.collaboration?.activeUserId).toBe('ops-user-1')
    expect(example?.collaboration?.users?.map((user) => user.id)).toEqual([
      'sales-user-1',
      'legal-user-1',
      'ops-user-1',
    ])
    expect(example?.collaboration?.users?.map((user) => user.color)).toEqual([
      '#2563EB',
      '#D946EF',
      '#F97316',
    ])
    expect(multiuserSharedSchema?.ownerMode).toBe('shared')
    expect(multiuserSharedSchema?.ownerRecipientIds).toEqual([
      'sales-user-1',
      'legal-user-1',
      'ops-user-1',
    ])
    expect(multiuserOwnerSchema?.ownerColor).toBe('#2563EB')
    expect(multiuserTeamSchema?.ownerColor).toBe('#D946EF')
    expect(multiuserLockedSchema?.ownerColor).toBe('#F97316')

    expect(multiuserOwnerSchema).toBeDefined()
    expect(multiuserTeamSchema).toBeDefined()
    expect(multiuserSharedSchema).toBeDefined()
    expect(multiuserLockedSchema).toBeDefined()
  })

  it('keeps generator example ready for form runtime and custom options', () => {
    const example = getLabExampleById('generator-runtime')

    expect(example?.defaultMode).toBe('form')
    expect(example?.collaboration?.users?.length).toBe(2)
    expect(example?.collaboration?.sessionId).toBe('generator-runtime-session')
    expect(example?.template.schemas[0][1].options).toEqual(['basic', 'pro', 'enterprise'])
    expect(example?.template.schemas[0][1].commentsCount).toBe(1)
    expect(example?.inputs[0].plan).toBe('enterprise')
    expect(example?.template.schemas.length).toBeGreaterThan(1)
  })

  it('builds a downloadable bundle with inlined base64 PDFs and runtime context', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => ({
      blob: async () => new Blob(['%PDF-1.4 generator'], { type: 'application/pdf' }),
    }))

    const example = getLabExampleById('generator-runtime')
    const bundle = await buildLabExampleDownloadBundle(example)

    expect(bundle.source).toBe('sisad-pdfme-lab')
    expect(bundle.version).toBe(2)
    expect(bundle.assetEncoding).toBe('base64-inline')
    expect(bundle.example).toMatchObject({
      id: 'generator-runtime',
      defaultMode: 'form',
      path: '/lab/generator-runtime',
    })
    expect(bundle.template.basePdf).toContain('data:application/pdf;base64,')
    expect(bundle.inputs[0].plan).toBe('enterprise')
    expect(bundle.collaboration.sessionId).toBe('generator-runtime-session')
    expect(bundle.runtimeOptions).toBeNull()
    expect(bundle.availableActions).toContain('download-template')
    expect(getLabExampleDownloadFilename(example)).toBe('generator-runtime.json')
  })

  it('inlines uploaded document PDFs inside runtimeOptions when exporting', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => ({
      blob: async () => new Blob(['%PDF-1.4 multi-doc'], { type: 'application/pdf' }),
    }))

    const example = getLabExampleById('multi-document-routing')
    const bundle = await buildLabExampleDownloadBundle(example)

    expect(bundle.runtimeOptions?.uploadedDocuments?.length).toBeGreaterThan(0)
    expect(bundle.runtimeOptions?.uploadedDocuments?.every((document) =>
      String(document?.template?.basePdf || '').startsWith('data:application/pdf;base64,'))).toBe(true)
  })

  it('maps actions by runtime mode', () => {
    expect(getLabExampleActions(getLabExampleById('basic-designer'))).toContain('add-schema')
    expect(getLabExampleActions(getLabExampleById('generator-runtime'))).toEqual([
      'open-example',
      'download-template',
      'generate-pdf',
      'pdf2size',
      'pdf2img',
      'img2pdf',
      'reset-template',
    ])
    expect(getLabExampleActions(getLabExampleById('enterprise-collaboration'))).toContain('fit-width')
  })
})
