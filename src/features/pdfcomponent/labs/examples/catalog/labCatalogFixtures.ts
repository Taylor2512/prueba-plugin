import {
  builtInSchemaDefinitions,
  checkbox,
  select,
  text,
  optionGroupDesignerHeightMM,
  optionGroupDesignerWidthMM,
} from '@sisad-pdfme/schemas';
import { createSchema } from '@/features/pdfcomponent/labs/builders/schemaFactory';

export {
  createAuditMetadata,
  createCommentAnchor,
} from '@/features/pdfcomponent/labs/builders/schemaFactory';
export {
  appendTemplatePages,
  createCollaboration,
  createTemplate,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate';
import { createSchemaShowcasePages } from '@/features/pdfcomponent/labs/builders/schemaShowcase';

const EXCLUDED_SHOWCASE_SCHEMA_TYPES = new Set(['qrcode']);

export const getTemplatePdfUrl = (fileName: string) =>
  `/templates/${encodeURIComponent(fileName)}`;

export const SHOWCASE_SCHEMA_DEFINITIONS = builtInSchemaDefinitions
  .slice()
  .sort((a, b) => `${a.category}-${a.label}`.localeCompare(`${b.category}-${b.label}`))
  .filter((definition) => !EXCLUDED_SHOWCASE_SCHEMA_TYPES.has(String(definition?.type || '').toLowerCase()));

const resolveSchemaPosition = (
  basePosition: Record<string, unknown> = {},
  overrides: Record<string, unknown> = {},
) => {
  const nextPosition = { ...basePosition };
  const overridePosition =
    overrides.position && typeof overrides.position === 'object'
      ? (overrides.position as Record<string, unknown>)
      : undefined;

  if (overridePosition?.x != null) nextPosition.x = overridePosition.x;
  if (overridePosition?.y != null) nextPosition.y = overridePosition.y;
  if (overrides.x != null) nextPosition.x = overrides.x;
  if (overrides.y != null) nextPosition.y = overrides.y;

  return nextPosition;
};

export const createCatalogSchemaFactory = (
  baseSchema: Record<string, unknown>,
  basePosition: Record<string, unknown>,
  defaults: Record<string, unknown> = {},
) =>
  (overrides: Record<string, unknown> = {}) => {
    const { position, x, y, ...rest } = overrides;
    return createSchema(baseSchema, {
      ...defaults,
      ...rest,
      position: resolveSchemaPosition(basePosition, { position, x, y }),
    });
  };

export const createStandardTextSchema = createCatalogSchemaFactory(
  text.propPanel.defaultSchema,
  { x: 18, y: 24 },
  { width: 92, height: 12, fontSize: 12 },
);

export const createStandardSelectSchema = createCatalogSchemaFactory(
  select.propPanel.defaultSchema,
  { x: 18, y: 46 },
  { width: 92, height: 12 },
);

export const createStandardCheckboxSchema = createCatalogSchemaFactory(
  checkbox.propPanel.defaultSchema,
  { x: 18, y: 66 },
  { width: 8, height: 8 },
);

type CatalogOptionGroupType = Parameters<typeof optionGroupDesignerWidthMM>[0];

export const createCatalogOptionGroupFactory = (
  baseSchema: Record<string, unknown>,
  type: CatalogOptionGroupType,
  basePosition: Record<string, unknown>,
) =>
  (overrides: Record<string, unknown> = {}) => {
    const { position, x, y, options, width, height, ...rest } = overrides;
    const optionCount = Array.isArray(options) ? options.length : 2;

    return createSchema(baseSchema, {
      width: width ?? optionGroupDesignerWidthMM(type),
      height: height ?? optionGroupDesignerHeightMM(type, optionCount),
      ...(options ? { options } : {}),
      ...rest,
      position: resolveSchemaPosition(basePosition, { position, x, y }),
    });
  };

export const BASIC_SCHEMA_EXAMPLE_OVERRIDES = {
  text: {
    name: 'customer_full_name',
    content: 'Taylor Demo',
    width: 92,
    height: 12,
  },
  signature: {
    name: 'review_signature',
    width: 60,
    height: 24,
  },
};

export const EXTENDED_SCHEMA_EXAMPLE_OVERRIDES = {
  ...BASIC_SCHEMA_EXAMPLE_OVERRIDES,
  multiVariableText: {
    name: 'approval_summary',
    text: 'Cliente {customer_name} · Plan {plan}',
    content: '{customer_name}',
    width: 110,
    height: 14,
  },
  select: {
    name: 'contract_stage',
    content: 'Aprobado',
    options: ['Pendiente', 'Aprobado', 'Rechazado'],
    width: 92,
    height: 12,
  },
  checkbox: {
    name: 'accept_terms',
    content: 'true',
    width: 8,
    height: 8,
  },
  radioGroup: {
    name: 'notify_customer',
    groupId: 'delivery-notifications',
    group: 'delivery-notifications',
    groupName: 'Notificaciones de entrega',
    content: 'option_1',
    selectedOptionId: 'option_1',
    defaultSelectedOptionId: 'option_1',
    options: [
      { optionId: 'option_1', label: 'Sí' },
      { optionId: 'option_2', label: 'No' },
    ],
    width: 82,
    height: 18,
  },
  checkboxGroup: {
    name: 'preferences',
    options: [
      { optionId: 'opt_1', label: 'Opción A' },
      { optionId: 'opt_2', label: 'Opción B' },
      { optionId: 'opt_3', label: 'Opción C' },
    ],
    selectedOptionIds: ['opt_1'],
    width: 92,
    height: 12,
  },
  image: {
    name: 'company_logo',
    width: 42,
    height: 42,
  },
  svg: {
    name: 'process_icon',
    width: 42,
    height: 42,
  },
  line: {
    name: 'divider_line',
    width: 94,
    height: 0.75,
  },
  rectangle: {
    name: 'highlight_box',
    width: 94,
    height: 32,
  },
  ellipse: {
    name: 'approval_badge',
    width: 52,
    height: 28,
  },
  table: {
    name: 'line_items',
    width: 155,
    height: 28,
  },
  dateTime: {
    name: 'approval_timestamp',
    width: 68,
    height: 12,
  },
  date: {
    name: 'approval_date',
    width: 54,
    height: 12,
  },
  time: {
    name: 'approval_time',
    width: 36,
    height: 12,
  },
};

export type LabSchemaShowcaseConfig = {
  scope: string;
  ownerRecipientId?: string;
  fileId?: string;
  fileTemplateId?: string;
  startingPageNumber?: number;
  auditOffset?: number;
  definitions?: typeof SHOWCASE_SCHEMA_DEFINITIONS;
};

export const createLabSchemaShowcasePages = (
  {
    definitions = SHOWCASE_SCHEMA_DEFINITIONS,
    ...config
  }: LabSchemaShowcaseConfig,
  overridesByType: Record<string, Record<string, unknown>> = BASIC_SCHEMA_EXAMPLE_OVERRIDES,
) =>
  createSchemaShowcasePages({
    definitions,
    ...config,
    overridesByType,
  });
