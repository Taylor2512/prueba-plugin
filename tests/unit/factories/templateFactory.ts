import type { ValidateTemplateInput, ValidatablePageSize } from '../../../src/sisad-pdfme/shared/templateValidator.js';
import { makeRecipient } from './recipientFactory.js';
import { makeSchema, makeSignatureSchema, makeSelectSchema } from './schemaFactory.js';

export interface TemplateFactoryOptions {
  schemasByPage?: ValidateTemplateInput['schemasByPage'];
  pageSizes?: ValidatablePageSize[];
  recipients?: ValidateTemplateInput['recipients'];
}

export function makeTemplateInput(options: TemplateFactoryOptions = {}): ValidateTemplateInput {
  return {
    schemasByPage: options.schemasByPage ?? [[makeSchema()]],
    pageSizes: options.pageSizes ?? [{ width: 210, height: 297 }],
    recipients: options.recipients ?? [],
  };
}

export function makeMultiPageTemplateInput(): ValidateTemplateInput {
  return makeTemplateInput({
    schemasByPage: [
      [makeSchema({ name: 'campo_1', id: 'schema-campo-1', schemaUid: 'uid-campo-1' })],
      [makeSignatureSchema({ name: 'firma_1', id: 'schema-firma-1', schemaUid: 'uid-firma-1' })],
      [makeSelectSchema({ name: 'selector_1', id: 'schema-selector-1', schemaUid: 'uid-selector-1' })],
    ],
    pageSizes: [
      { width: 210, height: 297 },
      { width: 210, height: 297 },
      { width: 210, height: 297 },
    ],
    recipients: [makeRecipient({ id: 'rec-1', name: 'Cliente' })],
  });
}

export function makeMultiDocumentTemplateInput(): ValidateTemplateInput {
  return makeTemplateInput({
    schemasByPage: [
      [
        makeSchema({
          id: 'schema-doc-a-1',
          schemaUid: 'uid-doc-a-1',
          name: 'campo_doc_a',
          documentId: 'doc-a',
          pageNumber: 1,
        }),
      ],
      [
        makeSignatureSchema({
          id: 'schema-doc-b-1',
          schemaUid: 'uid-doc-b-1',
          name: 'firma_doc_b',
          documentId: 'doc-b',
          pageNumber: 1,
        }),
      ],
    ],
    pageSizes: [
      { width: 210, height: 297 },
      { width: 210, height: 297 },
    ],
    recipients: [
      makeRecipient({ id: 'rec-1', name: 'Titular' }),
      makeRecipient({ id: 'rec-2', name: 'Aval' }),
    ],
  });
}
