import type { Plugin } from '@sisad-pdfme/common';
import { pdfRender } from './pdfRender.js';
import { propPanel } from './propPanel.js';
import { uiRender } from './uiRender.js';
import type { MultiVariableTextSchema } from './types.js';
import { Type } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';

const schema: Plugin<MultiVariableTextSchema> = createSchemaPlugin<MultiVariableTextSchema>({
  pdf: pdfRender,
  ui: uiRender,
  propPanel,
  icon: renderLucideIcon(Type),
  uninterruptedEditMode: true,
}, {
  key: 'multiVariableText',
  type: 'multiVariableText',
  label: 'Texto con variables',
  category: 'General',
  tags: ['text', 'template', 'variables', 'prefill'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'dynamic', 'prefill'],
});
export default schema;
