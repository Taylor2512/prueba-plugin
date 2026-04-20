import { getPlugin } from './helper.js';
import { Calendar } from 'lucide-react';
import { createLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';

const type = 'date';

const icon = createLucideIcon(Calendar);

export default createSchemaPlugin(getPlugin({ type, icon }), {
  key: 'date',
  type: 'date',
  label: 'Fecha',
  category: 'Fechas',
  tags: ['date', 'calendar', 'time'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});
