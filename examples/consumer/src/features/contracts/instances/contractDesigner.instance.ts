import { defineSisadPdfmeInstance } from '@/sisad-pdfme';
import { sisadPdfmeConfig } from '../config/sisadPdfme.config';
import { recipientsAdapter } from '../adapters/sisadPdfme.adapters';

export const createContractDesignerInstance = ({
  template,
  recipients,
  documents,
  saveTemplate,
}: {
  template: unknown;
  recipients: unknown[];
  documents: unknown[];
  saveTemplate: (template: unknown) => Promise<void>;
}) =>
  defineSisadPdfmeInstance({
    id: 'contract-designer',
    revision: 1,
    definition: {
      mode: 'designer',
      defaultState: {
        template,
        activeRecipientId: null,
        activeDocumentId: null,
      },
    },
    resources: {
      config: sisadPdfmeConfig,
      recipients,
      documents,
      adapters: {
        recipients: recipientsAdapter,
      },
    },
    handlers: {
      onSave: saveTemplate,
    },
  });
