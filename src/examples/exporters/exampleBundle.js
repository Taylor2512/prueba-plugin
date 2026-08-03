import { cloneDeep, getB64BasePdf, getInputFromTemplate } from '@sisad-pdfme/common';
import { createDocumentsAdapter, createRecipientsAdapter, createSignatureProviderAdapter } from '../../sisad-pdfme/adapters/index.ts';
import { normalizeHostData } from '../../sisad-pdfme/integration/normalizeHostData.ts';
import { decorateCollaborationUsers, decorateTemplateWithCollaboration } from '@/sisad-pdfme/devtools';
import { cloneExample, sanitizeIdentifier } from '../domain/exampleBuilder.js';

export const normalizeExampleHostData = (example) => {
  const normalized = normalizeHostData({
    template: cloneDeep(example?.template || { schemas: [[]] }),
    inputs: Array.isArray(example?.inputs) ? cloneDeep(example.inputs) : null,
    recipients: example?.collaboration?.users || [],
    documents: example?.runtimeOptions?.uploadedDocuments || [],
    signatureProviders: example?.runtimeOptions?.signatureProviders || [],
    activeRecipientId:
      example?.collaboration?.activeUserId ||
      example?.collaboration?.actorId ||
      null,
    adapters: {
      recipients: createRecipientsAdapter(),
      documents: createDocumentsAdapter(),
      signatures: createSignatureProviderAdapter(),
    },
  });
  const collaborationUsers = decorateCollaborationUsers(normalized.recipients);
  const template = decorateTemplateWithCollaboration(
    cloneDeep(normalized.template),
    collaborationUsers,
  );
  const inputs = Array.isArray(example?.inputs)
    ? cloneDeep(example.inputs)
    : getInputFromTemplate(template);
  const documents = normalized.documents.map((document) => ({
    ...document,
    template: document.template
      ? decorateTemplateWithCollaboration(document.template, collaborationUsers)
      : document.template,
  }));
  const activeRecipientId = normalized.activeRecipientId || collaborationUsers[0]?.id || '';

  return {
    template,
    inputs,
    recipients: collaborationUsers,
    documents,
    activeRecipientId,
    signatureProviders: normalized.signatureProviders,
  };
};

export const getExampleBundleFilename = (example) =>
  `${sanitizeIdentifier(example?.id)}.json`;

const inlineTemplateBasePdf = async (template) => {
  if (!template) return template;
  const nextTemplate = cloneDeep(template);
  nextTemplate.basePdf = await getB64BasePdf(nextTemplate.basePdf);
  return nextTemplate;
};

const inlineRuntimeOptionsBasePdfs = async (runtimeOptions) => {
  if (!runtimeOptions) return null;
  const next = cloneDeep(runtimeOptions);
  if (!Array.isArray(next.uploadedDocuments) || next.uploadedDocuments.length === 0) {
    return next;
  }
  next.uploadedDocuments = await Promise.all(
    next.uploadedDocuments.map(async (document) => ({
      ...document,
      template: document.template ? await inlineTemplateBasePdf(document.template) : document.template,
    })),
  );
  return next;
};

export const buildExampleBundle = async (example, options = {}) => {
  const { source = 'sisad-pdfme', version = 2, getActions } = options;
  const safeExample = cloneExample(example);
  const normalized = normalizeExampleHostData({
    id: safeExample.id,
    title: safeExample.title,
    defaultMode: safeExample.defaultMode,
    template: safeExample.template,
    inputs: safeExample.inputs,
    collaboration: safeExample.collaboration,
    runtimeOptions: safeExample.runtimeOptions,
  });
  const [template, runtimeOptions, documents] = await Promise.all([
    inlineTemplateBasePdf(normalized.template),
    inlineRuntimeOptionsBasePdfs(safeExample.runtimeOptions),
    Promise.all(
      normalized.documents.map(async (document) => ({
        ...document,
        template: document.template ? await inlineTemplateBasePdf(document.template) : document.template,
      })),
    ),
  ]);

  return {
    source,
    version,
    assetEncoding: 'base64-inline',
    exportedAt: new Date().toISOString(),
    example: {
      id: safeExample.id,
      path: safeExample.path,
      title: safeExample.title,
      description: safeExample.description,
      status: safeExample.status,
      defaultMode: safeExample.defaultMode,
      initialSchemaType: safeExample.initialSchemaType,
    },
    template,
    inputs: normalized.inputs,
    recipients: normalized.recipients,
    documents,
    config: {
      runtime: {
        mode: safeExample.defaultMode || 'designer',
      },
      collaboration: {
        enabled: Boolean(safeExample.collaboration?.enabled ?? normalized.recipients.length > 0),
        activeRecipientId: normalized.activeRecipientId || null,
        isGlobalView: Boolean(safeExample.collaboration?.isGlobalView),
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
    availableActions: getActions ? getActions(safeExample) : undefined,
  };
};

export const buildExampleHref = async (example, options = {}) => {
  const bundle = await buildExampleBundle(example, options);
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(bundle, null, 2))}`;
};
