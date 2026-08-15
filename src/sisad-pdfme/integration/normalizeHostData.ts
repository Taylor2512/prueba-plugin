import { cloneDeep, getInputFromTemplate, type Template } from '@sisad-pdfme/common';
import {
  createDocumentsAdapter,
  createRecipientsAdapter,
  createSignatureProviderAdapter,
} from '@sisad-pdfme/adapters';
import type {
  SisadPdfmeDocument,
  SisadPdfmeDocumentsAdapter,
  SisadPdfmeRecipientsAdapter,
  SisadPdfmeSignatureProvider,
  SisadPdfmeSignatureProviderAdapter,
} from '@sisad-pdfme/config/SisadPdfmeConfig';
import type {
  SisadPdfmeRecipient,
} from '@sisad-pdfme/recipients';

export type SisadPdfmeHostDataAdapters = {
  recipients?: SisadPdfmeRecipientsAdapter<unknown>;
  documents?: SisadPdfmeDocumentsAdapter<unknown>;
  signatures?: SisadPdfmeSignatureProviderAdapter<unknown>;
};

export type SisadPdfmeHostDataInput = {
  template?: Template | null;
  inputs?: unknown[] | null;
  recipients?: unknown[] | null;
  documents?: unknown[] | null;
  signatureProviders?: unknown[] | null;
  activeRecipientId?: string | null;
  adapters?: SisadPdfmeHostDataAdapters;
};

export type SisadPdfmeNormalizedHostData = {
  template: Template;
  inputs: unknown[];
  recipients: SisadPdfmeRecipient[];
  documents: SisadPdfmeDocument[];
  activeRecipientId: string;
  signatureProviders: SisadPdfmeSignatureProvider[];
};

const createDefaultTemplate = (): Template =>
  ({
    schemas: [[]],
  }) as Template;

export const normalizeHostData = ({
  template,
  inputs,
  recipients,
  documents,
  signatureProviders,
  activeRecipientId,
  adapters,
}: SisadPdfmeHostDataInput): SisadPdfmeNormalizedHostData => {
  const recipientAdapter = adapters?.recipients ?? createRecipientsAdapter();
  const documentAdapter = adapters?.documents ?? createDocumentsAdapter();
  const signatureProviderAdapter = adapters?.signatures ?? createSignatureProviderAdapter();
  const normalizedTemplate = cloneDeep(template ?? createDefaultTemplate());
  const normalizedRecipients = Array.isArray(recipients)
    ? recipientAdapter.toRecipients(recipients)
    : [];
  const normalizedDocuments = Array.isArray(documents)
    ? documentAdapter.toDocuments(documents)
    : [];
  const normalizedSignatureProviders = Array.isArray(signatureProviders)
    ? signatureProviderAdapter.toProviders(signatureProviders)
    : [];
  const normalizedInputs = Array.isArray(inputs) && inputs.length > 0
    ? cloneDeep(inputs)
    : getInputFromTemplate(normalizedTemplate);
  const resolvedActiveRecipientId = String(
    activeRecipientId ?? normalizedRecipients[0]?.id ?? '',
  ).trim();

  return {
    template: normalizedTemplate,
    inputs: normalizedInputs,
    recipients: normalizedRecipients,
    documents: normalizedDocuments,
    activeRecipientId: resolvedActiveRecipientId,
    signatureProviders: normalizedSignatureProviders,
  };
};
