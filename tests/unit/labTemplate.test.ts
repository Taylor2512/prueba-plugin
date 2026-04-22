import { describe, expect, it } from 'vitest'
import { createInitialPdfmeTemplate } from '../../src/features/sisad-pdfme/template.js'

describe('lab template', () => {
  it('creates a blank template with a single page bucket', () => {
    const template = createInitialPdfmeTemplate()

    expect(template.basePdf).toMatchObject({
      width: 390,
      height: 400,
      padding: [12, 12, 12, 12],
    })
    expect(template.schemas).toEqual([[]])
  })
})
