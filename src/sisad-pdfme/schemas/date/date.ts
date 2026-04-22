import { getPlugin } from './helper.js';
import { Calendar } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';

const type = 'date';

const icon = renderLucideIcon(Calendar);

export default createSchemaPlugin(getPlugin({ type, icon }), {
  key: 'date',
  type: 'date',
  label: 'Fecha',
  category: 'Fechas',
  tags: ['date', 'calendar', 'time'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});
