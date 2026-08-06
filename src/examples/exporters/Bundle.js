import { cloneDeep, getB64BasePdf, getInputFromTemplate } from '@sisad-pdfme/common';
import {
  createDocumentsAdapter,
  createRecipientsAdapter,
  createSignatureProviderAdapter,
} from '../../sisad-pdfme/adapters/index.ts';
import { normalizeHostData as normalizeSisadPdfmeHostData } from '../../sisad-pdfme/integration/normalizeHostData.ts';
import { clone, sanitizeIdentifier } from '../domain/Builder.js';
import { applyCollaborationDecorations } from '../helpers/collaboration.js';

export const normalizeHostData = (source = {}) => {
  const normalized = normalizeSisadPdfmeHostData({
    template: cloneDeep(source.template || { schemas: [[]] }),
    inputs: Array.isArray(source.inputs) ? cloneDeep(source.inputs) : null,
    recipients: source.collaboration?.users || [],
    documents: source.runtimeOptions?.uploadedDocuments || [],
    signatureProviders: source.runtimeOptions?.signatureProviders || [],
    activeRecipientId:
      source.collaboration?.activeUserId ||
      source.collaboration?.actorId ||
      null,
    adapters: {
      recipients: createRecipientsAdapter(),
      documents: createDocumentsAdapter(),
      signatures: createSignatureProviderAdapter(),
    },
  });

  const template = applyCollaborationDecorations(normalized.template, normalized.recipients);
  const inputs = Array.isArray(source.inputs)
    ? cloneDeep(source.inputs)
    : getInputFromTemplate(template);
  const documents = normalized.documents.map((document) => ({
    ...document,
    template: applyCollaborationDecorations(document.template, normalized.recipients),
  }));
  const activeRecipientId = normalized.activeRecipientId || (normalized.recipients[0]?.id) || '';

  return {
    template,
    inputs,
    recipients: normalized.recipients,
    documents,
    activeRecipientId,
    signatureProviders: normalized.signatureProviders,
  };
};

export const getBundleFilename = (source = {}) =>
  `${sanitizeIdentifier(source.id)}.json`;

const inlineBasePdf = async (obj, path = 'basePdf') => {
  if (!obj) return obj;
  const cloned = cloneDeep(obj);
  const parts = path.split('.');
  const last = parts.pop();
  let current = cloned;

  for (const part of parts) {
    if (!current[part]) return cloned;
    current = current[part];
  }

  if (current[last]) {
    current[last] = await getB64BasePdf(current[last]);
  }

  return cloned;
};

const inlineNestedBasePdfs = async (container, documentPath = 'uploadedDocuments', templatePath = 'template') => {
  if (!container) return null;
  const next = cloneDeep(container);
  const documents = Array.isArray(next[documentPath]) ? next[documentPath] : [];

  if (documents.length === 0) return next;

  next[documentPath] = await Promise.all(
    documents.map(async (doc) => ({
      ...doc,
      [templatePath]: doc[templatePath] ? await inlineBasePdf(doc[templatePath]) : doc[templatePath],
    })),
  );

  return next;
};

export const buildBundle = async (source, options = {}) => {
  const { source: bundleSource = 'sisad-pdfme', version = 2, getActions } = options;
  const safe = clone(source);
  const normalized = normalizeHostData(safe);
  const [template, runtimeOptions, documents] = await Promise.all([
    inlineBasePdf(normalized.template),
    inlineNestedBasePdfs(safe.runtimeOptions),
    Promise.all(
      normalized.documents.map((doc) => inlineBasePdf(doc)),
    ),
  ]);

  return {
    source: bundleSource,
    version,
    assetEncoding: 'base64-inline',
    exportedAt: new Date().toISOString(),
    instance: {
      id: safe.id,
      path: safe.path,
      title: safe.title,
      description: safe.description,
      status: safe.status,
      defaultMode: safe.defaultMode,
      initialSchemaType: safe.initialSchemaType,
    },
    template,
    inputs: normalized.inputs,
    recipients: normalized.recipients,
    documents,
    config: {
      runtime: {
        mode: safe.defaultMode || 'designer',
      },
      collaboration: {
        enabled: Boolean(safe.collaboration?.enabled ?? normalized.recipients.length > 0),
        activeRecipientId: normalized.activeRecipientId || null,
        isGlobalView: Boolean(safe.collaboration?.isGlobalView),
      },
      documents: {
        mode: documents.length > 1 ? 'multi' : 'single',
      },
      signatures: {
        enabled: true,
        defaultMode: 'draw',
        providers: normalized.signatureProviders,
      },
    },
    runtimeOptions: runtimeOptions
      ? {
          ...runtimeOptions,
          uploadedDocuments: undefined,
        }
      : undefined,
    availableActions: getActions ? getActions(safe) : undefined,
  };
};

export const buildHref = async (source, options = {}) => {
  const bundle = await buildBundle(source, options);
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(bundle, null, 2))}`;
};
