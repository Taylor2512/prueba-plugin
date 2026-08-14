/**
 * text-like presets: fullName, emailAddress, company, title.
 * Each is a thin createTextLikeSchemaPlugin call.
 * Rendering logic lives in textLikeSchemaFactory.ts.
 */
import { User, Mail, Building2, Briefcase } from 'lucide-react';
import { renderLucideIcon } from '../schemaBuilder.js';
import { createTextLikeSchemaPlugin } from './textLikeSchemaFactory.js';

export const fullName = createTextLikeSchemaPlugin({
  type: 'fullName',
  label: 'Nombre completo',
  sourceField: 'user.name',
  icon: renderLucideIcon(User, { stroke: '#374151' }),
  category: 'Destinatario',
  tags: ['name', 'full name', 'recipient', 'text'],
});

export const emailAddress = createTextLikeSchemaPlugin({
  type: 'emailAddress',
  label: 'Correo electrónico',
  sourceField: 'user.email',
  icon: renderLucideIcon(Mail, { stroke: '#374151' }),
  category: 'Destinatario',
  tags: ['email', 'recipient', 'text'],
});

export const company = createTextLikeSchemaPlugin({
  type: 'company',
  label: 'Empresa',
  sourceField: 'user.company',
  icon: renderLucideIcon(Building2, { stroke: '#374151' }),
  category: 'Destinatario',
  tags: ['company', 'organization', 'recipient', 'text'],
});

export const title = createTextLikeSchemaPlugin({
  type: 'title',
  label: 'Cargo',
  sourceField: 'user.title',
  icon: renderLucideIcon(Briefcase, { stroke: '#374151' }),
  category: 'Destinatario',
  tags: ['title', 'job title', 'position', 'recipient', 'text'],
});
