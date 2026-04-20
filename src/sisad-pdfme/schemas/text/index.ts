import type { Plugin } from '@sisad-pdfme/common';
import { pdfRender } from './pdfRender.js';
import { propPanel } from './propPanel.js';
import { uiRender } from './uiRender.js';
import type { TextSchema } from './types.js';
import { TextCursorInput } from 'lucide-react';
import { createSchemaPlugin, createLucideIcon } from '../schemaBuilder.js';

const textSchema: Plugin<TextSchema> = createSchemaPlugin<TextSchema>({
  pdf: pdfRender,
  ui: uiRender,
  propPanel,
  icon: createLucideIcon(TextCursorInput),
}, {
  key: 'text',
  type: 'text',
  label: 'Texto',
  category: 'General',
  tags: ['text', 'input', 'content'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});

export default textSchema;
