import { cloneDeep } from '@sisad-pdfme/common';
import { normalizeLooseText } from '@sisad-pdfme/shared/text';

const DEFAULT_TEMPLATE_SCHEMA_VERSION = 2;

const normalizeSchemaControllerText = normalizeLooseText;

type SchemaLike = Record<string, unknown> & {
  schemaUid?: string;
  id?: string;
  name?: string;
  required?: boolean;
  editable?: boolean;
};

type TemplateLike = Record<string, unknown> & {
  schemas?: Array<Array<SchemaLike> | SchemaLike[]>;
};

const normalizeSchemaForLoad = (schema: SchemaLike, context: Record<string, unknown> = {}) => {
  if (!schema || typeof schema !== 'object') return schema;

  const schemaUid = normalizeSchemaControllerText(schema.schemaUid || schema.id || context.schemaUid || '');
  const fallbackName = normalizeSchemaControllerText(context.name || '') || `campo_${Number(context.fieldIndex || 0) + 1}`;
  const normalized = {
    ...cloneDeep(schema),
    schemaUid: schemaUid || normalizeSchemaControllerText(schema.id || `schema_${Date.now()}`),
    id: normalizeSchemaControllerText(schema.id || schemaUid || context.id || ''),
    name: normalizeSchemaControllerText(schema.name) || fallbackName,
    required: Boolean(schema.required),
    editable: schema.editable !== false,
  };

  return normalized;
};

const normalizeSchemaTemplate = (template: TemplateLike = {}, context: Record<string, unknown> = {}) => {
  if (!template || typeof template !== 'object') return template;
  const schemas = Array.isArray(template.schemas) ? template.schemas : [[]];

  return {
    ...cloneDeep(template),
    templateSchemaVersion: DEFAULT_TEMPLATE_SCHEMA_VERSION,
    schemas: schemas.map((page, pageIndex) =>
      (Array.isArray(page) ? page : []).map((schema, fieldIndex) =>
        normalizeSchemaForLoad(schema, { ...context, pageIndex, fieldIndex }),
      ),
    ),
  };
};

export const createSchemaController = (customConfig: Record<string, unknown> = {}) => {
  const { eventHandlers = {} } = customConfig || {};
  const handlersRecord = eventHandlers as Record<string, unknown>;
  const handlers = {
    onSchemaCreate:
      typeof handlersRecord.onSchemaCreate === 'function' ? (handlersRecord.onSchemaCreate as (schema: SchemaLike, context: Record<string, unknown>) => void) : () => {},
    onSchemaUpdate:
      typeof handlersRecord.onSchemaUpdate === 'function' ? (handlersRecord.onSchemaUpdate as (schema: SchemaLike, context: Record<string, unknown>) => void) : () => {},
    onSchemaNormalize:
      typeof handlersRecord.onSchemaNormalize === 'function'
        ? (handlersRecord.onSchemaNormalize as (schema: SchemaLike, context: Record<string, unknown>) => void)
        : () => {},
  };

  const processSchema = (schema: SchemaLike, context: Record<string, unknown> = {}) => {
    const normalized = normalizeSchemaForLoad(schema, context);
    if (context.source === 'onSchemaCreate' || context.isNewSchema === true) {
      handlers.onSchemaCreate(normalized, context);
    } else if (context.source === 'onSchemaUpdate') {
      handlers.onSchemaUpdate(normalized, context);
    }
    handlers.onSchemaNormalize(normalized, context);
    return normalized;
  };

  const processTemplate = (template: TemplateLike = {}, context: Record<string, unknown> = {}) => normalizeSchemaTemplate(template, context);
  const normalizeTemplateForLoad = (template: TemplateLike = {}, context: Record<string, unknown> = {}) => normalizeSchemaTemplate(template, context);
  const normalizeTemplateForCreate = (template: TemplateLike = {}, context: Record<string, unknown> = {}) => normalizeSchemaTemplate(template, context);
  const normalizeTemplateForSave = (template: TemplateLike = {}, context: Record<string, unknown> = {}) => normalizeSchemaTemplate(template, context);

  return {
    handlers,
    processSchema,
    processTemplate,
    normalizeSchemaForLoad,
    normalizeTemplateForLoad,
    normalizeTemplateForCreate,
    normalizeTemplateForSave,
  };
};
