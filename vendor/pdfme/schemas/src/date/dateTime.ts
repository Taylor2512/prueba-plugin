import { getPlugin } from './helper.js';
import { CalendarClock } from 'lucide';
import { createLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';

const type = 'dateTime';

const icon = createLucideIcon(CalendarClock);

export default createSchemaPlugin(getPlugin({ type, icon }), {
  key: 'dateTime',
  type: 'dateTime',
  label: 'Fecha y hora',
  category: 'Fechas',
  tags: ['date', 'time', 'datetime', 'calendar'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});
