import { getPlugin } from '@sisad-pdfme/schemas/date/helper';
import { Clock } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';

const type = 'time';

const icon = renderLucideIcon(Clock);

export default createSchemaPlugin(getPlugin({ type, icon }), {
  key: 'time',
  type: 'time',
  label: 'Hora',
  category: 'Fechas',
  tags: ['time', 'clock'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});
