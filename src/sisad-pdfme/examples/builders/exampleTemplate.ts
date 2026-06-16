import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common';
import type { Template } from '@sisad-pdfme/common';
import { createDefaultTemplate } from '../../templates/createDefaultTemplate.js';
import { decorateCollaborationUsers } from '../../collaboration/recipientPalette.js';
import { decorateTemplateWithCollaboration } from '../../collaboration/schemaOwnershipAppearance.js';
import type { CollaboratorUser } from '../../collaboration/recipientPalette.js';

export type CreateTemplateOptions = {
  basePdf?: Template['basePdf'];
  pageCount?: number;
};

export type TemplatePage = Template['schemas'][number];

export type UploadedDocument = {
  id: string;
  name: string;
  pageCount?: number;
  template: Template;
};

export type ExampleRuntimeOptions = {
  uploadedDocuments?: UploadedDocument[];
  [key: string]: unknown;
};

export type ExampleDefinition = {
  id: string;
  path: string;
  title: string;
  description: string;
  status: string;
  defaultMode?: string;
  initialSchemaType?: string;
  collaboration?: {
    activeUserId?: string;
    actorId?: string;
    sessionId?: string;
    enabled?: boolean;
    users?: CollaboratorUser[];
  } | null;
  template: Template;
  inputs?: unknown;
  runtimeOptions?: ExampleRuntimeOptions | null;
};

const normalizeUploadedDocuments = (
  runtimeOptions: ExampleRuntimeOptions | null | undefined,
  users: CollaboratorUser[],
): ExampleRuntimeOptions | null => {
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

const buildCollaborativeTemplate = (template: Template, users: CollaboratorUser[]) =>
  decorateTemplateWithCollaboration(template, users);

const buildCollaborationSnapshot = (
  collaboration: ExampleDefinition['collaboration'],
): ExampleDefinition['collaboration'] =>
  collaboration ? cloneDeep(collaboration) : null;

const normalizeStringValue = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback;

const normalizeBooleanValue = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

/**
 * Builds a template from schema pages, padding to `pageCount` empty pages.
 * Base shape comes from `createDefaultTemplate`.
 */
export const createTemplate = (schemas: Template['schemas'], options: CreateTemplateOptions = {}): Template => {
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

export const appendTemplatePages = (template: Template, extraPages: Template['schemas']): Template => ({
  ...template,
  schemas: [...(template.schemas || []), ...cloneDeep(extraPages)],
});

export type CreateUploadedDocumentArgs = {
  id: string;
  name: string;
  pdfFileName: string;
  pageCount?: number;
  schemas: Template['schemas'];
  /** Resolves a pdf file name to a basePdf (URL or bytes). Host-supplied. */
  pdfResolver: (pdfFileName: string) => Template['basePdf'];
};

export const createUploadedDocument = ({
  id,
  name,
  pdfFileName,
  pageCount,
  schemas,
  pdfResolver,
}: CreateUploadedDocumentArgs): UploadedDocument => ({
  id,
  name,
  pageCount,
  template: createTemplate(schemas, {
    basePdf: pdfResolver(pdfFileName),
    pageCount,
  }),
});

export type CreateCollaborationOptions = {
  /** Override the user-decoration step. Defaults to core decorateCollaborationUsers. */
  decorateUsers?: (users: CollaboratorUser[]) => CollaboratorUser[];
};

export const createCollaboration = (
  activeUserId: string,
  users: CollaboratorUser[],
  metadata: Record<string, unknown> = {},
  options: CreateCollaborationOptions = {},
): NonNullable<ExampleDefinition['collaboration']> => {
  const decorate = options.decorateUsers ?? ((u: CollaboratorUser[]) => decorateCollaborationUsers(u));
  return {
    activeUserId,
    actorId: normalizeStringValue(metadata.actorId, activeUserId),
    sessionId: normalizeStringValue(metadata.sessionId, `lab-${activeUserId}`),
    enabled: normalizeBooleanValue(metadata.enabled, true),
    users: decorate(users),
  };
};

/** Deep-clones an assembled example (template/inputs/runtimeOptions). */
export const cloneExample = <T extends ExampleDefinition>(example: T): T => ({
  ...example,
  template: cloneDeep(example.template),
  inputs: cloneDeep(example.inputs),
  runtimeOptions: cloneDeep(example.runtimeOptions),
});

export type CreateExampleArgs = ExampleDefinition;

/**
 * Assembles an example: decorates the template (and any uploaded documents)
 * with collaboration appearance, derives inputs, and clones runtime options.
 */
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
}: CreateExampleArgs): ExampleDefinition => {
  const safeCollaboration = buildCollaborationSnapshot(collaboration);
  const users = safeCollaboration?.users || [];
  const safeTemplate = buildCollaborativeTemplate(template, users);
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
