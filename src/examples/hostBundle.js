/**
 * API de integración host: construcción de instancias de laboratorio y
 * exportación a bundle portable.
 *
 * No la consume ninguna página; se mantiene como superficie pública de
 * `src/examples` para hosts y tests de integración.
 */
import { cloneDeep, getB64BasePdf, getInputFromTemplate } from '@sisad-pdfme/common';
import {
  createDefaultTemplate,
  decorateCollaborationUsers,
  decorateTemplateWithCollaboration,
} from '@/sisad-pdfme/devtools';

import {
  createDocumentsAdapter,
  createRecipientsAdapter,
  createSignatureProviderAdapter,
} from '../sisad-pdfme/adapters/index.ts';
import { normalizeHostData as normalizeSisadPdfmeHostData } from '../sisad-pdfme/integration/normalizeHostData.ts';

/* ── Utilidades ───────────────────────────────────────────────────────── */

export const sanitizeIdentifier = (value) =>
  String(value || 'lab-')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lab-';

const normalizeString = (value, fallback = '') =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const normalizeBoolean = (value, fallback) => (typeof value === 'boolean' ? value : fallback);

export const applyCollaborationDecorations = (template, recipients) => {
  if (!recipients || recipients.length === 0) return template;

  const decoratedUsers = decorateCollaborationUsers(recipients);
  return decorateTemplateWithCollaboration(cloneDeep(template), decoratedUsers);
};

/* ── Construcción de instancias ───────────────────────────────────────── */

export const createTemplate = (schemas, options = {}) => {
  const initialTemplate = createDefaultTemplate();
  const nextSchemas = cloneDeep(Array.isArray(schemas) && schemas.length > 0 ? schemas : [[]]);
  const safePageCount = Math.max(
    1,
    Number(options.pageCount || nextSchemas.length) || nextSchemas.length || 1,
  );

  while (nextSchemas.length < safePageCount) nextSchemas.push([]);

  return {
    ...initialTemplate,
    basePdf: options.basePdf || initialTemplate.basePdf,
    schemas: nextSchemas,
  };
};

export const appendTemplatePages = (template, extraPages) => ({
  ...template,
  schemas: [...(template.schemas || []), ...cloneDeep(extraPages)],
});

export const createUploadedDocument = ({ id, name, pdfFileName, pageCount, schemas, pdfResolver }) => ({
  id,
  name,
  pageCount,
  template: createTemplate(schemas, {
    basePdf: pdfResolver(pdfFileName),
    pageCount,
  }),
});

export const createCollaboration = (activeUserId, users, metadata = {}, options = {}) => {
  const decorate = options.decorateUsers ?? ((value) => decorateCollaborationUsers(value));

  return {
    activeUserId,
    actorId: normalizeString(metadata.actorId, activeUserId),
    sessionId: normalizeString(metadata.sessionId, `lab-${activeUserId}`),
    enabled: normalizeBoolean(metadata.enabled, true),
    users: decorate(users),
  };
};

export const clone = (source = {}) => ({
  ...source,
  template: cloneDeep(source.template),
  inputs: cloneDeep(source.inputs),
  runtimeOptions: cloneDeep(source.runtimeOptions),
});

const normalizeUploadedDocuments = (runtimeOptions, users) => {
  if (!runtimeOptions) return null;

  const cloned = cloneDeep(runtimeOptions);
  const uploadedDocuments = Array.isArray(cloned.uploadedDocuments) ? cloned.uploadedDocuments : [];

  return {
    ...cloned,
    uploadedDocuments: uploadedDocuments.map((document) => ({
      ...document,
      template: applyCollaborationDecorations(document.template, users),
    })),
  };
};

export const create = ({
  id,
  path,
  title,
  description,
  status,
  defaultMode = 'designer',
  initialSchemaType = 'text',
  collaboration = null,
  template,
  runtimeOptions = null,
}) => {
  const safeCollaboration = collaboration ? cloneDeep(collaboration) : null;
  const users = safeCollaboration?.users || [];
  const safeTemplate = applyCollaborationDecorations(template, users);

  return {
    id,
    path,
    title,
    description,
    status,
    defaultMode,
    initialSchemaType,
    collaboration: safeCollaboration,
    template: safeTemplate,
    inputs: getInputFromTemplate(safeTemplate),
    runtimeOptions: normalizeUploadedDocuments(runtimeOptions, users),
  };
};

/* ── Exportación a bundle ─────────────────────────────────────────────── */

export const normalizeHostData = (source = {}) => {
  const normalized = normalizeSisadPdfmeHostData({
    template: cloneDeep(source.template || { schemas: [[]] }),
    inputs: Array.isArray(source.inputs) ? cloneDeep(source.inputs) : null,
    recipients: source.collaboration?.users || [],
    documents: source.runtimeOptions?.uploadedDocuments || [],
    signatureProviders: source.runtimeOptions?.signatureProviders || [],
    activeRecipientId: source.collaboration?.activeUserId || source.collaboration?.actorId || null,
    adapters: {
      recipients: createRecipientsAdapter(),
      documents: createDocumentsAdapter(),
      signatures: createSignatureProviderAdapter(),
    },
  });

  const template = applyCollaborationDecorations(normalized.template, normalized.recipients);

  return {
    template,
    inputs: Array.isArray(source.inputs) ? cloneDeep(source.inputs) : getInputFromTemplate(template),
    recipients: normalized.recipients,
    documents: normalized.documents.map((document) => ({
      ...document,
      template: applyCollaborationDecorations(document.template, normalized.recipients),
    })),
    activeRecipientId: normalized.activeRecipientId || normalized.recipients[0]?.id || '',
    signatureProviders: normalized.signatureProviders,
  };
};

export const getBundleFilename = (source = {}) => `${sanitizeIdentifier(source.id)}.json`;

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
    Promise.all(normalized.documents.map((doc) => inlineBasePdf(doc))),
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
