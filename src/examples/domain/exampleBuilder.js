import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common';
import { createDefaultTemplate, decorateCollaborationUsers, decorateTemplateWithCollaboration } from '@/sisad-pdfme/devtools';

export const sanitizeIdentifier = (value) =>
  String(value || 'lab-example')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lab-example';

const normalizeStringValue = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value : fallback;

const normalizeBooleanValue = (value, fallback) =>
  typeof value === 'boolean' ? value : fallback;

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

export const createUploadedDocument = ({
  id,
  name,
  pdfFileName,
  pageCount,
  schemas,
  pdfResolver,
}) => ({
  id,
  name,
  pageCount,
  template: createTemplate(schemas, {
    basePdf: pdfResolver(pdfFileName),
    pageCount,
  }),
});

export const createCollaboration = (
  activeUserId,
  users,
  metadata = {},
  options = {},
) => {
  const decorate = options.decorateUsers ?? ((u) => decorateCollaborationUsers(u));
  return {
    activeUserId,
    actorId: normalizeStringValue(metadata.actorId, activeUserId),
    sessionId: normalizeStringValue(metadata.sessionId, `lab-${activeUserId}`),
    enabled: normalizeBooleanValue(metadata.enabled, true),
    users: decorate(users),
  };
};

export const cloneExample = (example) => ({
  ...example,
  template: cloneDeep(example.template),
  inputs: cloneDeep(example.inputs),
  runtimeOptions: cloneDeep(example.runtimeOptions),
});

const normalizeUploadedDocuments = (runtimeOptions, users) => {
  if (!runtimeOptions) {
    return null;
  }

  const cloned = cloneDeep(runtimeOptions);
  const uploadedDocuments = Array.isArray(cloned.uploadedDocuments) ? cloned.uploadedDocuments : [];

  return {
    ...cloned,
    uploadedDocuments: uploadedDocuments.map((document) => ({
      ...document,
      template: decorateTemplateWithCollaboration(document.template, users),
    })),
  };
};

const buildCollaborationSnapshot = (collaboration) => (collaboration ? cloneDeep(collaboration) : null);

export const createExample = ({
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
  const safeCollaboration = buildCollaborationSnapshot(collaboration);
  const users = safeCollaboration?.users || [];
  const safeTemplate = decorateTemplateWithCollaboration(template, users);
  const safeRuntimeOptions = normalizeUploadedDocuments(runtimeOptions, users);

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
    runtimeOptions: safeRuntimeOptions,
  };
};
