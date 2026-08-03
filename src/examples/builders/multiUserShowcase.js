import { decorateCollaborationUsers, decorateTemplateWithCollaboration } from '@/sisad-pdfme/devtools';
import { buildShowcaseTemplate } from './showcaseTemplate.js';
import { MULTI_USER_RECIPIENTS } from '../fixtures/recipients.js';

const normalizeRecipient = (recipient, index) => {
  const id = String(recipient?.id ?? '').trim() || `recipient-${index + 1}`;
  const name = String(recipient?.name ?? recipient?.label ?? id).trim() || id;
  return {
    ...recipient,
    id,
    name,
  };
};

const applyRecipientOwnership = (template, recipients) => {
  if (!template || !Array.isArray(template.schemas) || recipients.length === 0) {
    return template;
  }

  let schemaIndex = 0;
  return {
    ...template,
    schemas: template.schemas.map((pageSchemas = []) =>
      pageSchemas.map((schema) => {
        const recipient = recipients[schemaIndex % recipients.length];
        schemaIndex += 1;

        return {
          ...schema,
          ownerRecipientId: recipient.id,
          ownerRecipientIds: [recipient.id],
          ownerRecipientName: recipient.name,
          recipientId: recipient.id,
          ownerMode: 'single',
        };
      }),
    ),
  };
};

export function buildMultiUserShowcaseTemplate(groups, recipients = MULTI_USER_RECIPIENTS) {
  const safeRecipients = decorateCollaborationUsers((Array.isArray(recipients) ? recipients : []).map(normalizeRecipient));
  const baseTemplate = buildShowcaseTemplate(groups);
  const ownershipTemplate = applyRecipientOwnership(baseTemplate, safeRecipients);

  return decorateTemplateWithCollaboration(ownershipTemplate, safeRecipients);
}
