import type { Plugin } from '@sisad-pdfme/common';
import { renderTextPdf } from '@sisad-pdfme/schemas/text/pdfRender';
import { propPanel } from '@sisad-pdfme/schemas/text/propPanel';
import { renderTextUi } from '@sisad-pdfme/schemas/text/uiRender';
import type { TextSchema } from '@sisad-pdfme/schemas/text/types';
import { TextCursorInput } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '@sisad-pdfme/schemas/schemaBuilder';

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
