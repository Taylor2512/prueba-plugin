import { getPlugin } from '@sisad-pdfme/schemas/date/helper';
import { CalendarClock } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';

const type = 'dateTime';

const icon = renderLucideIcon(CalendarClock);

export default createSchemaPlugin(getPlugin({ type, icon }), {
  key: 'dateTime',
  type: 'dateTime',
  label: 'Fecha y hora',
  category: 'Fechas',
  tags: ['date', 'time', 'datetime', 'calendar'],
  capabilities: ['designer', 'form', 'viewer', 'content', 'prefill'],
});
