import type { Plugin } from '@sisad-pdfme/common';
import { renderTextPdf } from './pdfRender.js';
import { propPanel } from './propPanel.js';
import { renderTextUi } from './uiRender.js';
import type { TextSchema } from './types.js';
import { TextCursorInput } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';

const textSchema: Plugin<TextSchema> = createSchemaPlugin<TextSchema>({
  pdf: renderTextPdf,
  ui: renderTextUi,
  propPanel,
  icon: renderLucideIcon(TextCursorInput),
}, {
  key: 'text',
  type: 'text',
  label: 'Texto',
  category: 'General',
  tags: ['text', 'input', 'content'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});

export default textSchema;
