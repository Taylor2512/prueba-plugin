import { cloneDeep, getB64BasePdf, getInputFromTemplate } from '@sisad-pdfme/common';
import { decorateCollaborationUsers, decorateTemplateWithCollaboration } from '@/sisad-pdfme/devtools';
import { cloneExample, sanitizeIdentifier } from '../domain/exampleBuilder.js';

const buildDocumentLabel = (document) =>
  String(document?.name || document?.id || 'Documento').trim() || 'Documento';

const normalizeExampleDocuments = (runtimeOptions, users) => {
  if (!runtimeOptions || !Array.isArray(runtimeOptions.uploadedDocuments)) return [];

  return runtimeOptions.uploadedDocuments
    .map((document) => {
      const originalDocument = cloneDeep(document || {});
      const template = document?.template;
      const templateRecord = template && typeof template === 'object' ? template : null;
      const basePdf = templateRecord ? templateRecord.basePdf : undefined;
      const pageCount =
        typeof document?.pageCount === 'number'
          ? document.pageCount
          : Array.isArray(templateRecord?.schemas)
            ? templateRecord.schemas.length
            : undefined;

      return {
        ...originalDocument,
        id: String(document?.id || document?.name || 'document').trim() || 'document',
        name: buildDocumentLabel(document),
        label: buildDocumentLabel(document),
        pageCount,
        basePdf,
        template: template ? decorateTemplateWithCollaboration(template, users) : undefined,
        metadata: {
          ...cloneDeep(document || {}),
          template,
        },
      };
    })
    .filter((document) => Boolean(document.id));
};

export const normalizeExampleHostData = (example) => {
  const collaborationUsers = decorateCollaborationUsers((example?.collaboration?.users || []));
  const template = decorateTemplateWithCollaboration(
    cloneDeep(example?.template || { schemas: [[]] }),
    collaborationUsers,
  );
  const inputs = Array.isArray(example?.inputs) ? cloneDeep(example.inputs) : getInputFromTemplate(template);
  const activeRecipientId =
    example?.collaboration?.activeUserId ||
    example?.collaboration?.actorId ||
    collaborationUsers[0]?.id ||
    '';

  return {
    template,
    inputs,
    recipients: collaborationUsers,
    documents: normalizeExampleDocuments(example?.runtimeOptions, collaborationUsers),
    activeRecipientId,
    signatureProviders: Array.isArray(example?.runtimeOptions?.signatureProviders)
      ? cloneDeep(example.runtimeOptions.signatureProviders)
      : [],
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
    inputs: safeExample.inputs,
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
