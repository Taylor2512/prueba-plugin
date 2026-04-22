import { describe, expect, it } from 'vitest'
import { buildSchemaAssignments, buildUserSchemaAssignments, SHARED_ASSIGNMENTS_BUCKET } from '@sisad-pdfme/common'
import {
  getLabExampleById,
  getLabExampleByPath,
  getLabExamples,
} from '../../src/features/pdfcomponent/examples/labExamples.js'

describe('sisad-pdfme lab examples', () => {
  it('exposes the documented example catalog', () => {
    const examples = getLabExamples()

    expect(examples.map((example) => example.id)).toEqual([
      'basic-designer',
      'enterprise-collaboration',
      'multi-document-routing',
      'multiuser-collaboration',
      'generator-runtime',
    ])

    const basicExample = getLabExampleById('basic-designer')
    expect(basicExample?.path).toBe('/lab/basic-designer')
    expect(basicExample?.template.schemas[0].some((schema) => schema.schemaUid === 'basic-full-name')).toBe(true)
    expect(basicExample?.inputs[0].full_name).toBe('Ada Lovelace')
    expect(basicExample?.collaboration?.sessionId).toBe('basic-designer-session')
    expect(basicExample?.collaboration?.actorId).toBe('basic-user-1')

    expect(getLabExampleByPath('/lab/basic-designer')?.id).toBe('basic-designer')
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
    const example = getLabExampleById('multiuser-collaboration')

    expect(example?.collaboration?.activeUserId).toBe('sales-user-1')
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
    expect(example?.template.schemas[1][0].ownerMode).toBe('shared')
    expect(example?.template.schemas[1][0].ownerRecipientIds).toEqual([
      'sales-user-1',
      'legal-user-1',
      'ops-user-1',
    ])
    expect(example?.template.schemas[0][0].ownerColor).toBe('#2563EB')
    expect(example?.template.schemas[0][1].ownerColor).toBe('#D946EF')
    expect(example?.template.schemas[1][1].ownerColor).toBe('#F97316')

    const assignments = buildSchemaAssignments(example?.template.schemas || [])

    expect(assignments['sales-user-1']['multiuser-contract']['2']).toContain('multiuser-shared-summary')
    expect(assignments['legal-user-1']['multiuser-contract']['2']).toContain('multiuser-shared-summary')
    expect(assignments['ops-user-1']['multiuser-contract']['2']).toContain('multiuser-shared-summary')

    const userAssignments = buildUserSchemaAssignments(example?.template.schemas || [])

    expect(userAssignments['sales-user-1']['multiuser-contract']['1']).toEqual([
      'multiuser-owner-name',
      'multiuser-team-note',
    ])
    expect(userAssignments['legal-user-1']['multiuser-contract']['2']).toEqual([
      'multiuser-locked-approval',
    ])
    expect(userAssignments[SHARED_ASSIGNMENTS_BUCKET]['multiuser-contract']['2']).toEqual([
      'multiuser-shared-summary',
    ])
    expect(userAssignments['ops-user-1']).toBeUndefined()
  })

  it('keeps generator example ready for form runtime and custom options', () => {
    const example = getLabExampleById('generator-runtime')

    expect(example?.defaultMode).toBe('form')
    expect(example?.collaboration?.users?.length).toBe(2)
    expect(example?.collaboration?.sessionId).toBe('generator-runtime-session')
    expect(example?.template.schemas[0][1].options).toEqual(['basic', 'pro', 'enterprise'])
    expect(example?.template.schemas[0][1].commentsCount).toBe(1)
    expect(example?.inputs[0].plan).toBe('enterprise')
  })
})
