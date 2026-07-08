import { cloneDeep } from '@sisad-pdfme/common';

const DEFAULT_TEMPLATE_SCHEMA_VERSION = 2;

const normalizeText = (value: unknown) => String(value || '').trim();

const normalizeSchemaForLoad = (schema: any, context: Record<string, unknown> = {}) => {
  if (!schema || typeof schema !== 'object') return schema;

  const schemaUid = normalizeText(schema.schemaUid || schema.id || context.schemaUid || '');
  const fallbackName = normalizeText(context.name || '') || `campo_${Number(context.fieldIndex || 0) + 1}`;
  const normalized = {
    ...cloneDeep(schema),
    schemaUid: schemaUid || normalizeText(schema.id || `schema_${Date.now()}`),
    id: normalizeText(schema.id || schemaUid || context.id || ''),
    name: normalizeText(schema.name) || fallbackName,
    required: Boolean(schema.required),
    editable: schema.editable !== false,
  };

  return normalized;
};

const normalizeTemplate = (template: any = {}, context: Record<string, unknown> = {}) => {
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
  const handlersRecord = eventHandlers as Record<string, any>;
  const handlers = {
    onSchemaCreate: typeof handlersRecord.onSchemaCreate === 'function' ? handlersRecord.onSchemaCreate : () => {},
    onSchemaUpdate: typeof handlersRecord.onSchemaUpdate === 'function' ? handlersRecord.onSchemaUpdate : () => {},
    onSchemaNormalize: typeof handlersRecord.onSchemaNormalize === 'function' ? handlersRecord.onSchemaNormalize : () => {},
  };

  const processSchema = (schema: any, context: Record<string, unknown> = {}) => {
    const normalized = normalizeSchemaForLoad(schema, context);
    if (context.source === 'onSchemaCreate' || context.isNewSchema === true) {
      handlers.onSchemaCreate(normalized, context);
    } else if (context.source === 'onSchemaUpdate') {
      handlers.onSchemaUpdate(normalized, context);
    }
    handlers.onSchemaNormalize(normalized, context);
    return normalized;
  };

  const processTemplate = (template: any = {}, context: Record<string, unknown> = {}) => normalizeTemplate(template, context);
  const normalizeTemplateForLoad = (template: any = {}, context: Record<string, unknown> = {}) => normalizeTemplate(template, context);
  const normalizeTemplateForCreate = (template: any = {}, context: Record<string, unknown> = {}) => normalizeTemplate(template, context);
  const normalizeTemplateForSave = (template: any = {}, context: Record<string, unknown> = {}) => normalizeTemplate(template, context);

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
