import { cloneDeep, getB64BasePdf } from '@sisad-pdfme/common';
import type { Template } from '@sisad-pdfme/common';
import { cloneExample } from '../builders/exampleTemplate.js';
import type { ExampleDefinition, ExampleRuntimeOptions, UploadedDocument } from '../builders/exampleTemplate.js';
import { sanitizeIdentifier } from '../builders/schemaFactory.js';
import type { LabHostExample } from '@/features/pdfcomponent/integration/normalizeLabHostData';
import { normalizeLabHostData } from '@/features/pdfcomponent/integration/normalizeLabHostData';

/** Inlines a template's basePdf as a base64 data string. */
export const inlineTemplateBasePdf = async (template: Template) => {
  if (!template) return template;
  const nextTemplate = cloneDeep(template);
  nextTemplate.basePdf = await getB64BasePdf(
    nextTemplate.basePdf as string | ArrayBuffer | Uint8Array,
  );
  return nextTemplate;
};

/** Inlines basePdfs for every uploaded document in runtime options. */
export const inlineRuntimeOptionsBasePdfs = async (runtimeOptions: ExampleRuntimeOptions | null | undefined) => {
  if (!runtimeOptions) return null;
  const next = cloneDeep(runtimeOptions) as ExampleRuntimeOptions;
  if (!Array.isArray(next.uploadedDocuments) || next.uploadedDocuments.length === 0) {
    return next;
  }
  next.uploadedDocuments = await Promise.all(
    next.uploadedDocuments.map(async (document: UploadedDocument) => ({
      ...document,
      template: await inlineTemplateBasePdf(document.template),
    })),
  );
  return next;
};

export type ExampleBundleOptions = {
  /** Bundle `source` tag. Defaults to 'sisad-pdfme'. */
  source?: string;
  /** Bundle schema version. Defaults to 2. */
  version?: number;
  /** Resolves the available action list for an example. */
  getActions?: (example: ExampleDefinition) => string[];
};

export const getExampleBundleFilename = (example: ExampleDefinition): string =>
  `${sanitizeIdentifier(example?.id)}.json`;

/**
 * Builds a self-contained, base64-inlined export bundle for an example.
 * `source`/`version`/`getActions` are injected by the host so no lab identity
 * is baked into the core exporter.
 */
export const buildExampleBundle = async (example: ExampleDefinition, options: ExampleBundleOptions = {}) => {
  const { source = 'sisad-pdfme', version = 2, getActions } = options;
  const safeExample = cloneExample(example);
  const labHostExample: LabHostExample = {
    id: safeExample.id,
    title: safeExample.title,
    defaultMode: safeExample.defaultMode,
    template: safeExample.template,
    inputs: safeExample.inputs,
    collaboration: safeExample.collaboration,
    runtimeOptions: safeExample.runtimeOptions,
  };
  const normalized = normalizeLabHostData(labHostExample);
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
