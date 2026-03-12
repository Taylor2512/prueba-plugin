import { getPlugin } from './helper.js';
import { Clock } from 'lucide';
import { createLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';

const type = 'time';

const icon = createLucideIcon(Clock);

export default createSchemaPlugin(getPlugin({ type, icon }), {
  key: 'time',
  type: 'time',
  label: 'Hora',
  category: 'Fechas',
  tags: ['time', 'clock'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});
