// Lab examples. Builders/exporters live beside this catalog under labs/.
// This file keeps the public catalog lean: example data lives in the per-case
// catalog files and the shared bundle helpers stay here.
import { cloneExample, buildExampleBundle, getExampleBundleFilename } from '@/features/pdfcomponent/labs/export/buildExampleBundle'
import { buildExampleHref } from '@/features/pdfcomponent/labs/export/downloadExampleBundle'
import { basicDesignerLabExample } from './catalog/basicDesigner.ts'
import { multiDocumentRoutingLabExample } from './catalog/multiDocumentRouting.ts'
import { generatorRuntimeLabExample } from './catalog/generatorRuntime.ts'
import {
  enterpriseCollaborationLabExample,
  multiuserCollaborationLabExample,
} from './catalog/collaborationShowcases.ts'

const LAB_EXAMPLES = [
  basicDesignerLabExample,
  enterpriseCollaborationLabExample,
  multiuserCollaborationLabExample,
  multiDocumentRoutingLabExample,
  generatorRuntimeLabExample,
]

const EXAMPLE_ACTIONS_BY_MODE = {
  designer: [
    'open-example',
    'download-template',
    'generate-pdf',
    'pdf2size',
    'pdf2img',
    'img2pdf',
    'add-page',
    'fit-page',
    'fit-width',
    'add-schema',
    'reset-template',
  ],
  form: [
    'open-example',
    'download-template',
    'generate-pdf',
    'pdf2size',
    'pdf2img',
    'img2pdf',
    'reset-template',
  ],
  viewer: ['open-example', 'download-template', 'reset-template'],
}

export const getLabExampleDownloadFilename = (example) => getExampleBundleFilename(example)

export const getLabExampleActions = (example) => {
  const mode = String(example?.defaultMode || 'designer')
  return EXAMPLE_ACTIONS_BY_MODE[mode] || EXAMPLE_ACTIONS_BY_MODE.designer
}

export const buildLabExampleDownloadBundle = (example) =>
  buildExampleBundle(example, { source: 'sisad-pdfme-lab', version: 2, getActions: getLabExampleActions })

export const buildLabExampleDownloadHref = (example) =>
  buildExampleHref(example, { source: 'sisad-pdfme-lab', version: 2, getActions: getLabExampleActions })

export const getLabExamples = () => LAB_EXAMPLES.map(cloneExample)

export const getLabExampleById = (id) => {
  const example = LAB_EXAMPLES.find((entry) => entry.id === id)
  return example ? cloneExample(example) : undefined
}

export const getLabExampleByPath = (path) => {
  const example = LAB_EXAMPLES.find((entry) => entry.path === path)
  return example ? cloneExample(example) : undefined
}

export const LAB_EXAMPLES_COUNT = LAB_EXAMPLES.length
