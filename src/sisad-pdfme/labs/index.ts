import {
  cloneDeep,
  getB64BasePdf,
  getInputFromTemplate,
  type SchemaForUI,
  type Template,
} from '@sisad-pdfme/common';
import { builtInSchemaDefinitions, createDefaultSchema } from '@sisad-pdfme/schemas';
import { createDefaultTemplate, decorateCollaborationUsers, decorateTemplateWithCollaboration } from '../devtools/index.js';
import { resolveSchemaSemanticFamily } from '../schemas/schemaFamilies.js';
import type { CollaboratorUser } from '../collaboration/recipientPalette.js';

export type FamilyExample = {
  key: string;
  slug: string;
  title: string;
  description: string;
  types: string[];
};

export type CreateTemplateOptions = {
  basePdf?: Template['basePdf'];
  pageCount?: number;
};

export type UploadedDocument = {
  id: string;
  name: string;
  pageCount?: number;
  template: Template;
  [key: string]: unknown;
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

export type CreateUploadedDocumentArgs = {
  id: string;
  name: string;
  pdfFileName: string;
  pageCount?: number;
  schemas: Template['schemas'];
  pdfResolver: (pdfFileName: string) => Template['basePdf'];
};

export type CreateCollaborationOptions = {
  decorateUsers?: (users: CollaboratorUser[]) => CollaboratorUser[];
};

export type CreateExampleArgs = ExampleDefinition;

export type ExampleBundleOptions = {
  source?: string;
  version?: number;
  getActions?: (example: ExampleDefinition) => string[];
};

export type ExampleHostExample = {
  id: string;
  title: string;
  defaultMode?: string;
  template: Template;
  inputs?: unknown;
  collaboration?: {
    activeUserId?: string;
    actorId?: string;
    sessionId?: string;
    enabled?: boolean;
    isGlobalView?: boolean;
    users?: CollaboratorUser[];
  } | null;
  runtimeOptions?: ExampleRuntimeOptions | null;
};

export type NormalizedExampleHostData = {
  template: Template;
  inputs: unknown[];
  recipients: CollaboratorUser[];
  documents: UploadedDocument[];
  activeRecipientId: string;
  signatureProviders: unknown[];
};

export const sanitizeIdentifier = (value: unknown): string =>
  String(value || 'lab-example')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lab-example';

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

const buildCollaborationSnapshot = (
  collaboration: ExampleDefinition['collaboration'],
): ExampleDefinition['collaboration'] => (collaboration ? cloneDeep(collaboration) : null);

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

const PAGE_SIZE = { width: 210, height: 297 };
const PAGE_PADDING: [number, number, number, number] = [15, 15, 15, 15];
const PAGE_CONTENT_WIDTH = PAGE_SIZE.width - PAGE_PADDING[1] - PAGE_PADDING[3];
const PAGE_CONTENT_HEIGHT = PAGE_SIZE.height - PAGE_PADDING[0] - PAGE_PADDING[2];
const PAGE_LEFT = PAGE_PADDING[3];
const PAGE_TOP = PAGE_PADDING[0];
const COLUMN_GAP = 6;
const ROW_GAP = 6;
const FALLBACK_SIZE = { width: 45, height: 7 };

const TEXT_SAMPLE_VALUES: Record<string, string> = {
  text: 'Texto de ejemplo',
  multiVariableText: 'Linea 1\nLinea 2\nLinea 3',
  fullName: 'Ada Lovelace',
  emailAddress: 'ada@acme.example',
  company: 'Acme Labs',
  title: 'Analista senior',
  number: '42',
  date: '2026-07-29',
  time: '14:30',
  dateTime: '2026-07-29 14:30',
};

function decorateDemoSchema(schema: SchemaForUI) {
  const next = { ...schema };
  const sample = TEXT_SAMPLE_VALUES[schema.type];
  if (sample) {
    next.content = sample;
  }
  if (schema.type === 'checkbox') {
    next.content = 'true';
  }
  return next;
}

/**
 * Toma la medida natural del schema y solo la recorta si no cabe en la página.
 */
function resolveNaturalSize(schema: SchemaForUI) {
  const width = Number(schema.width) > 0 ? Number(schema.width) : FALLBACK_SIZE.width;
  const height = Number(schema.height) > 0 ? Number(schema.height) : FALLBACK_SIZE.height;

  return {
    width: Math.min(width, PAGE_CONTENT_WIDTH),
    height: Math.min(height, PAGE_CONTENT_HEIGHT),
  };
}

function layoutPageForTypes(types: string[], firstPageIndex: number) {
  const pages: SchemaForUI[][] = [];
  const placedSchemas: SchemaForUI[] = [];
  let currentPage: SchemaForUI[] = [];
  const cursor = { x: PAGE_LEFT, y: PAGE_TOP, rowHeight: 0, pageIndex: firstPageIndex };

  const breakRow = () => {
    cursor.x = PAGE_LEFT;
    cursor.y += cursor.rowHeight + ROW_GAP;
    cursor.rowHeight = 0;
  };

  const breakPage = () => {
    pages.push(currentPage);
    currentPage = [];
    cursor.x = PAGE_LEFT;
    cursor.y = PAGE_TOP;
    cursor.rowHeight = 0;
    cursor.pageIndex += 1;
  };

  types.forEach((type, typeIndex) => {
    const created = createDefaultSchema(type, {
      pageNumber: cursor.pageIndex + 1,
      id: `${type}-${typeIndex}`,
      schemaUid: `${type}-${typeIndex}`,
      position: { x: PAGE_LEFT, y: PAGE_TOP },
      existingSchemas: placedSchemas,
    });
    const size = resolveNaturalSize(created);

    if (cursor.x + size.width > PAGE_LEFT + PAGE_CONTENT_WIDTH && currentPage.length > 0) {
      breakRow();
    }
    if (cursor.y + size.height > PAGE_TOP + PAGE_CONTENT_HEIGHT && currentPage.length > 0) {
      breakPage();
    }

    const schema = decorateDemoSchema(created);
    schema.pageNumber = cursor.pageIndex + 1;
    schema.position = { x: cursor.x, y: cursor.y };
    schema.width = size.width;
    schema.height = size.height;

    currentPage.push(schema);
    placedSchemas.push(schema);

    cursor.x += size.width + COLUMN_GAP;
    cursor.rowHeight = Math.max(cursor.rowHeight, size.height);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[]];
}

/**
 * Toma el layout natural del plugin y lo acomoda por flujo, página por página.
 */
export function buildShowcaseTemplate(groups: Array<{ title: string; types: string[] }>) {
  const schemas = groups.reduce(
    (pages, group) => pages.concat(layoutPageForTypes(group.types, pages.length)),
    [] as SchemaForUI[][],
  );

  return createDefaultTemplate({
    basePdf: {
      width: PAGE_SIZE.width,
      height: PAGE_SIZE.height,
      padding: PAGE_PADDING,
    },
    schemas,
  });
}

export const MULTI_USER_RECIPIENTS = [
  { id: 'alice', name: 'Alice', color: '#2563eb' },
  { id: 'bob', name: 'Bob', color: '#f59e0b' },
  { id: 'carla', name: 'Carla', color: '#10b981' },
];

export const MULTI_USER_FAMILY_KEYS = ['text', 'choice', 'boolean', 'signature'];

const normalizeRecipient = (recipient: Record<string, unknown>, index: number) => {
  const id = String(recipient?.id ?? '').trim() || `recipient-${index + 1}`;
  const name = String(recipient?.name ?? recipient?.label ?? id).trim() || id;
  return {
    ...recipient,
    id,
    name,
  };
};

const applyRecipientOwnership = (template: Template, recipients: CollaboratorUser[]) => {
  if (!template || !Array.isArray(template.schemas) || recipients.length === 0) {
    return template;
  }

  let schemaIndex = 0;
  return {
    ...template,
    schemas: template.schemas.map((pageSchemas = []) =>
      pageSchemas.map((schema) => {
        const recipient = recipients[schemaIndex % recipients.length];
        schemaIndex += 1;

        return {
          ...schema,
          ownerRecipientId: recipient.id,
          ownerRecipientIds: [recipient.id],
          ownerRecipientName: recipient.name,
          recipientId: recipient.id,
          ownerMode: 'single',
        };
      }),
    ),
  };
};

/**
 * Construye el template multiusuario con ownership y color propagados.
 */
export function buildMultiUserShowcaseTemplate(
  groups: Array<{ title: string; types: string[] }>,
  recipients: CollaboratorUser[] = MULTI_USER_RECIPIENTS,
) {
  const safeRecipients = decorateCollaborationUsers((Array.isArray(recipients) ? recipients : []).map(normalizeRecipient));
  const baseTemplate = buildShowcaseTemplate(groups);
  const ownershipTemplate = applyRecipientOwnership(baseTemplate, safeRecipients);

  return decorateTemplateWithCollaboration(ownershipTemplate, safeRecipients);
}

export const FAMILY_META = {
  text: {
    slug: 'text',
    title: 'Texto y campos simples',
    description: 'Ejemplos de texto, texto ampliado, prefills y campos de datos simples.',
  },
  multiVariableText: {
    slug: 'multi-variable-text',
    title: 'Texto multivariable',
    description: 'Un ejemplo dedicado al campo de texto multilineal y sus variantes de contenido.',
  },
  choice: {
    slug: 'choice',
    title: 'Selección',
    description: 'Select, radioGroup, checkbox y checkboxGroup con la misma base runtime.',
  },
  boolean: {
    slug: 'boolean',
    title: 'Booleanos',
    description: 'Checkbox como caso aislado para validar el flujo booleano con una ruta propia.',
  },
  dateTime: {
    slug: 'date-time',
    title: 'Fecha y hora',
    description: 'Casos de fecha, hora y fecha-hora renderizados como runtime editable.',
  },
  signature: {
    slug: 'signature',
    title: 'Firma',
    description: 'Firma dibujada, iniciales y fecha de firma en un mismo flujo de ejemplo.',
  },
  table: {
    slug: 'table',
    title: 'Tablas',
    description: 'La familia tabular con un layout compacto y repetible.',
  },
  barcode: {
    slug: 'barcode',
    title: 'Códigos de barras',
    description: 'Códigos 1D/2D agrupados de forma genérica y totalmente data-driven.',
  },
  media: {
    slug: 'media',
    title: 'Media',
    description: 'Imagen y SVG como campos visuales reutilizables.',
  },
  shape: {
    slug: 'shape',
    title: 'Formas',
    description: 'Línea, rectángulo y elipse como soporte de composición visual.',
  },
  action: {
    slug: 'action',
    title: 'Acciones',
    description: 'Attachment, note, approve y decline como acciones de flujo.',
  },
} as const;

const FAMILY_TYPE_ORDER: Record<keyof typeof FAMILY_META, string[]> = {
  text: ['text', 'number', 'fullName', 'emailAddress', 'company', 'title'],
  multiVariableText: ['multiVariableText'],
  choice: ['select', 'dropdown', 'radioGroup', 'checkboxGroup'],
  boolean: ['checkbox'],
  dateTime: ['date', 'time', 'dateTime'],
  signature: ['signature', 'initials', 'dateSigned'],
  table: ['table'],
  barcode: ['qrcode', 'japanpost', 'ean13', 'ean8', 'code39', 'code128', 'nw7', 'itf14', 'upca', 'upce', 'gs1datamatrix', 'pdf417'],
  media: ['image', 'svg'],
  shape: ['line', 'rectangle', 'ellipse'],
  action: ['attachment', 'note', 'approve', 'decline'],
};

function buildFamilyExamples(): FamilyExample[] {
  const schemaTypesByFamily = new Map(Object.keys(FAMILY_META).map((key) => [key, [] as string[]]));

  builtInSchemaDefinitions.forEach((definition) => {
    const family = resolveSchemaSemanticFamily(definition.type);
    if (!schemaTypesByFamily.has(family)) return;
    schemaTypesByFamily.get(family)?.push(definition.type);
  });

  return Object.entries(FAMILY_META).map(([key, meta]) => {
    const discoveredTypes = schemaTypesByFamily.get(key) ?? [];
    const seededTypes = FAMILY_TYPE_ORDER[key as keyof typeof FAMILY_META];
    const types = Array.from(new Set([...seededTypes, ...discoveredTypes]));

    return {
      key,
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      types,
    };
  });
}

export const FAMILY_EXAMPLES = buildFamilyExamples();

const typesOf = (keys: string[]) =>
  FAMILY_EXAMPLES.filter((family) => keys.includes(family.key)).flatMap((family) => family.types);

/**
 * Documentos de demostración para el enrutado multi-documento.
 */
export const DEMO_DOCUMENTS = [
  {
    id: 'contrato-marco',
    label: 'Contrato marco',
    template: buildShowcaseTemplate([
      { title: 'Datos del contrato', types: typesOf(['text', 'choice']) },
    ]),
  },
  {
    id: 'anexo-firmas',
    label: 'Anexo de firmas',
    template: buildShowcaseTemplate([
      { title: 'Firmas y aprobaciones', types: typesOf(['signature', 'boolean']) },
    ]),
  },
];

export const PRIMARY_ROUTE_GROUPS = [
  { id: 'catalog', path: '/', title: 'Catálogo', description: 'Puerta de entrada a todos los ejemplos.' },
  { id: 'single-user', path: '/examples/designer/single-user', title: 'Designer: un usuario', description: 'Un solo usuario con todas las familias de schema.' },
  { id: 'multi-user', path: '/examples/designer/multi-user', title: 'Designer: multiusuario', description: 'Colaboración con varios usuarios y cambio de actor activo.' },
  { id: 'form', path: '/examples/runtime/form', title: 'Runtime: Form', description: 'Modo de llenado con prefill y resumen lateral.' },
  { id: 'viewer', path: '/examples/runtime/viewer', title: 'Runtime: Viewer', description: 'Modo de solo lectura para revisión y auditoría.' },
  { id: 'schemas', path: '/examples/schemas', title: 'Schemas', description: 'Catálogo por familia y por tipo de schema.' },
];

export const FAMILY_ROUTE_GROUPS = Object.values(FAMILY_META).map((meta) => ({
  path: `/examples/schemas/${meta.slug}`,
  title: meta.title,
  description: meta.description,
}));

export const SEMANTIC_ROUTE_EXAMPLES = FAMILY_EXAMPLES.map((family) => ({
  id: family.key,
  path: `/examples/schemas/${family.slug}`,
  title: family.title,
  description: family.description,
}));

export const IMMERSIVE_ROUTE_OPTIONS = [
  ...PRIMARY_ROUTE_GROUPS.filter((route) => route.path !== '/'),
  ...SEMANTIC_ROUTE_EXAMPLES,
].map((route) => ({ path: route.path, title: route.title }));

const inlineTemplateBasePdf = async (template: Template) => {
  if (!template) return template;
  const nextTemplate = cloneDeep(template);
  nextTemplate.basePdf = await getB64BasePdf(nextTemplate.basePdf as string | ArrayBuffer | Uint8Array);
  return nextTemplate;
};

const inlineRuntimeOptionsBasePdfs = async (
  runtimeOptions: ExampleRuntimeOptions | null | undefined,
): Promise<ExampleRuntimeOptions | null> => {
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

const buildDocumentLabel = (document: { id?: string; name?: string }) =>
  String(document?.name || document?.id || 'Documento').trim() || 'Documento';

const normalizeExampleDocuments = (runtimeOptions: ExampleRuntimeOptions | null | undefined): UploadedDocument[] => {
  if (!runtimeOptions || !Array.isArray(runtimeOptions.uploadedDocuments)) return [];

  return runtimeOptions.uploadedDocuments
    .map((document) => {
      const originalDocument = cloneDeep(document || {}) as Record<string, unknown>;
      const template = document?.template;
      const templateRecord = template && typeof template === 'object' ? template : null;
      const basePdf = templateRecord ? (templateRecord as Template).basePdf : undefined;
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
        template: template || undefined,
        metadata: {
          ...cloneDeep(document || {}),
          template,
        },
      } as UploadedDocument;
    })
    .filter((document) => Boolean(document.id));
};

export const normalizeExampleHostData = (example: ExampleHostExample): NormalizedExampleHostData => {
  const collaborationUsers = decorateCollaborationUsers((example?.collaboration?.users || []) as CollaboratorUser[]);
  const template = decorateTemplateWithCollaboration(
    cloneDeep(example?.template || ({ schemas: [[]] } as Template)),
    collaborationUsers as unknown[],
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
    documents: normalizeExampleDocuments(example?.runtimeOptions),
    activeRecipientId,
    signatureProviders: Array.isArray(example?.runtimeOptions?.signatureProviders)
      ? cloneDeep(example.runtimeOptions.signatureProviders)
      : [],
  };
};

export const getExampleBundleFilename = (example: ExampleDefinition): string =>
  `${sanitizeIdentifier(example?.id)}.json`;

/**
 * Builds a self-contained, base64-inlined export bundle for an example.
 */
export const buildExampleBundle = async (example: ExampleDefinition, options: ExampleBundleOptions = {}) => {
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

export const buildExampleHref = async (example: ExampleDefinition, options: ExampleBundleOptions = {}): Promise<string> => {
  const bundle = await buildExampleBundle(example, options);
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(bundle, null, 2))}`;
};
