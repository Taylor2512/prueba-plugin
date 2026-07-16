import type { ExampleDefinition, CreateExampleArgs } from '../builders/exampleTemplate.js'
import { createExample } from '../builders/exampleTemplate.js'

export type LabExampleDefinition = ExampleDefinition

export const createLabExample = (config: CreateExampleArgs): LabExampleDefinition =>
  createExample({
    defaultMode: 'designer',
    initialSchemaType: 'text',
    ...config,
  })
