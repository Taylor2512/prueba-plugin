import { validateCollaborativeSchemas } from '@sisad-pdfme/common'
import { generate } from '@sisad-pdfme/generator'
import { flatSchemaPlugins } from '@sisad-pdfme/schemas'
import { img2pdf, pdf2img, pdf2size } from '@sisad-pdfme/converter'
import type { Template } from '@sisad-pdfme/common'

export type GenerateLabPdfArgs = {
  template: Template
  inputs: unknown
  plugins?: typeof flatSchemaPlugins
}

export type ConvertImagesToPdfArgs = {
  imageBuffers: ArrayBuffer[]
}

export const validateLabTemplateForGeneration = (template: Template) =>
  validateCollaborativeSchemas(template?.schemas || [])

export const generateLabPdf = ({ template, inputs, plugins = flatSchemaPlugins }: GenerateLabPdfArgs) =>
  generate({
    template,
    inputs,
    plugins,
  })

export const getLabPdfSizes = (pdfBytes: ArrayBuffer | Uint8Array) => pdf2size(pdfBytes)

export const convertLabPdfToImages = (
  pdfBytes: ArrayBuffer | Uint8Array,
  options = {
    scale: 1,
    imageType: 'png',
  },
) => pdf2img(pdfBytes, options)

export const convertLabImagesToPdf = ({ imageBuffers }: ConvertImagesToPdfArgs) =>
  img2pdf(imageBuffers, {
    margin: [10, 10, 10, 10],
    size: { width: 210, height: 297 },
  })
