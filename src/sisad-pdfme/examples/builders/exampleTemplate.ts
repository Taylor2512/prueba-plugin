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

/**
 * Builds a template from schema pages, padding to `pageCount` empty pages.
 * Base shape comes from `createDefaultTemplate`.
 */
export const createTemplate = (schemas: any[][], options: CreateTemplateOptions = {}): Template => {
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
  } as Template;
};

export const appendTemplatePages = (template: Template, extraPages: any[][]): Template => ({
  ...template,
  schemas: [...((template as any).schemas || []), ...cloneDeep(extraPages)],
});

export type CreateUploadedDocumentArgs = {
  id: string;
  name: string;
  pdfFileName: string;
  pageCount?: number;
  schemas: any[][];
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
}: CreateUploadedDocumentArgs) => ({
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
  metadata: any = {},
  options: CreateCollaborationOptions = {},
) => {
  const decorate = options.decorateUsers ?? ((u: CollaboratorUser[]) => decorateCollaborationUsers(u));
  return {
    activeUserId,
    actorId: metadata.actorId || activeUserId,
    sessionId: metadata.sessionId || `lab-${activeUserId}`,
    enabled: metadata.enabled ?? true,
    users: decorate(users),
  };
};

/** Deep-clones an assembled example (template/inputs/runtimeOptions). */
export const cloneExample = (example: any) => ({
  ...example,
  template: cloneDeep(example.template),
  inputs: cloneDeep(example.inputs),
  runtimeOptions: cloneDeep(example.runtimeOptions),
});

export type CreateExampleArgs = {
  id: string;
  path: string;
  title: string;
  description: string;
  status: string;
  defaultMode?: string;
  initialSchemaType?: string;
  collaboration?: any;
  template: Template;
  runtimeOptions?: any;
};

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
}: CreateExampleArgs) => {
  const safeCollaboration = collaboration ? cloneDeep(collaboration) : null;
  const users = safeCollaboration?.users || [];
  const safeTemplate = decorateTemplateWithCollaboration(template, users);
  const safeRuntimeOptions = runtimeOptions
    ? cloneDeep({
        ...runtimeOptions,
        uploadedDocuments: (runtimeOptions.uploadedDocuments || []).map((document: any) => ({
          ...document,
          template: decorateTemplateWithCollaboration(document.template, users),
        })),
      })
    : null;

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
