import type { Plugin } from '@sisad-pdfme/common';
import { renderMultiVariableTextPdf } from '@sisad-pdfme/schemas/multiVariableText/pdfRender';
import { propPanel } from '@sisad-pdfme/schemas/multiVariableText/propPanel';
import { renderMultiVariableTextUi } from '@sisad-pdfme/schemas/multiVariableText/uiRender';
import type { MultiVariableTextSchema } from '@sisad-pdfme/schemas/multiVariableText/types';
import { Type } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '@sisad-pdfme/schemas/schemaBuilder';

const schema: Plugin<MultiVariableTextSchema> = createSchemaPlugin<MultiVariableTextSchema>({
  pdf: renderMultiVariableTextPdf,
  ui: renderMultiVariableTextUi,
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
