import type { Plugin } from '@pdfme/common';
import type { TableSchema } from './types.js';
import { pdfRender } from './pdfRender.js';
import { uiRender } from './uiRender.js';
import { propPanel } from './propPanel.js';
import { Table } from 'lucide';
import { createSchemaPlugin, createLucideIcon } from '../schemaBuilder.js';

const tableSchema: Plugin<TableSchema> = createSchemaPlugin<TableSchema>({
  pdf: pdfRender,
  ui: uiRender,
  propPanel,
  icon: createLucideIcon(Table),
}, {
  key: 'table',
  type: 'table',
  label: 'Tabla',
  category: 'Estructura',
  tags: ['table', 'grid', 'layout'],
  capabilities: ['designer', 'viewer', 'layout', 'dynamic'],
});
export default tableSchema;
