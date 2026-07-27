import type { Plugin } from '@sisad-pdfme/common';
import type { TableSchema } from './types.js';
import { renderTablePdf } from './pdfRender.js';
import { renderTableUi } from './uiRender.js';
import { propPanel } from './propPanel.js';
import { Table } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '../schemaBuilder.js';

const tableSchema: Plugin<TableSchema> = createSchemaPlugin<TableSchema>({
  pdf: renderTablePdf,
  ui: renderTableUi,
  propPanel,
  icon: renderLucideIcon(Table),
}, {
  key: 'table',
  type: 'table',
  label: 'Tabla',
  category: 'Estructura',
  tags: ['table', 'grid', 'layout'],
  capabilities: ['designer', 'viewer', 'layout', 'dynamic'],
});
export default tableSchema;
