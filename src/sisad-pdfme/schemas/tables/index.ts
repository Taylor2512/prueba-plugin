import type { Plugin } from '@sisad-pdfme/common';
import type { TableSchema } from '@sisad-pdfme/schemas/tables/types';
import { renderTablePdf } from '@sisad-pdfme/schemas/tables/pdfRender';
import { renderTableUi } from '@sisad-pdfme/schemas/tables/uiRender';
import { propPanel } from '@sisad-pdfme/schemas/tables/propPanel';
import { Table } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '@sisad-pdfme/schemas/schemaBuilder';

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
