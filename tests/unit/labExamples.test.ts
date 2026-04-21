import { describe, expect, it } from 'vitest'
import { buildSchemaAssignments } from '@sisad-pdfme/common'
import {
  getLabExampleById,
  getLabExampleByPath,
  getLabExamples,
} from '../../src/features/sisad-pdfme/examples/labExamples.js'

describe('sisad-pdfme lab examples', () => {
  it('exposes the documented example catalog', () => {
    const examples = getLabExamples()

    expect(examples.map((example) => example.id)).toEqual([
      'basic-designer',
      'enterprise-collaboration',
      'multi-document-routing',
      'generator-runtime',
    ])

    const basicExample = getLabExampleById('basic-designer')
    expect(basicExample?.path).toBe('/lab/basic-designer')
    expect(basicExample?.template.schemas[0].some((schema) => schema.schemaUid === 'basic-full-name')).toBe(true)
    expect(basicExample?.inputs[0].full_name).toBe('Ada Lovelace')

    expect(getLabExampleByPath('/lab/basic-designer')?.id).toBe('basic-designer')
  })

  it('preserves collaboration metadata in the enterprise example', () => {
    const example = getLabExampleById('enterprise-collaboration')

    expect(example?.template.schemas[0][0].ownerMode).toBe('multi')
    expect(example?.template.schemas[0][0].commentsCount).toBe(1)
    expect(example?.template.schemas[0][0].comments?.[0]?.text).toContain('identificador')
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

  it('keeps generator example ready for form runtime and custom options', () => {
    const example = getLabExampleById('generator-runtime')

    expect(example?.defaultMode).toBe('form')
    expect(example?.template.schemas[0][1].options).toEqual(['basic', 'pro', 'enterprise'])
    expect(example?.inputs[0].plan).toBe('enterprise')
  })
})
