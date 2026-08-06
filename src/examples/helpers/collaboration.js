import { cloneDeep } from '@sisad-pdfme/common';
import { decorateCollaborationUsers, decorateTemplateWithCollaboration } from '@/sisad-pdfme/devtools';

export const applyCollaborationDecorations = (template, recipients) => {
  if (!recipients || recipients.length === 0) {
    return template;
  }

  const decoratedUsers = decorateCollaborationUsers(recipients);
  return decorateTemplateWithCollaboration(cloneDeep(template), decoratedUsers);
};
