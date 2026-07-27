import type { GenerateProps, Schema, Template } from '@sisad-pdfme/common';
import { cloneDeep, getDynamicTemplate, isBlankPdf, pluginRegistry, replacePlaceholders } from '@sisad-pdfme/common';
import { builtInPlugins, getSchemaPluginByType } from '@sisad-pdfme/schemas';
import type { MultiVariableTextSchema } from '@sisad-pdfme/schemas/multiVariableText/types.js';
import {
  getMissingVariables,
  parseVariablesInput,
  substituteVariables,
} from '@sisad-pdfme/schemas/multiVariableText/helper.js';
import {
  getSchemaBooleanValue,
  getSchemaNumberValue,
  getSchemaOptionSelection,
} from '@sisad-pdfme/schemas/values/schemaValueAdapter.js';

export type PdfPreflightIssueSeverity = 'info' | 'warning' | 'error';

export type PdfPreflightIssue = {
  documentIndex: number;
  pageIndex: number;
  schemaName: string;
  schemaType: string;
  severity: PdfPreflightIssueSeverity;
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type PdfPreflightPageReport = {
  documentIndex: number;
  pageIndex: number;
  schemaCount: number;
  renderedSchemaCount: number;
  issues: PdfPreflightIssue[];
  isEmpty: boolean;
};

export type PdfPreflightReport = {
  totalPages: number;
  totalSchemas: number;
  renderedSchemas: number;
  skippedSchemas: number;
  emptyPages: number;
  issues: PdfPreflightIssue[];
  pages: PdfPreflightPageReport[];
  ok: boolean;
};

const normalizePreflightText = (value: unknown): string => String(value ?? '').trim();

const getPluginsRegistry = (plugins: GenerateProps['plugins']) =>
  pluginRegistry(Object.values(plugins || {}).length > 0 ? (plugins || {}) : builtInPlugins);

const getSchemaRawValue = (
  schema: Schema,
  input: Record<string, unknown>,
  pageIndex: number,
  totalPages: number,
  schemas: Schema[][],
): string => {
  if (schema.readOnly) {
    return replacePlaceholders({
      content: schema.content || '',
      variables: { ...input, totalPages, currentPage: pageIndex + 1 },
      schemas,
    });
  }

  const raw = input[schema.name];
  if (raw == null || raw === '') {
    return typeof schema.content === 'string' ? schema.content : '';
  }
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);
  return JSON.stringify(raw);
};

const addIssue = (
  issues: PdfPreflightIssue[],
  issue: PdfPreflightIssue,
): void => {
  issues.push(issue);
};

const inspectMultiVariableText = (
  schema: MultiVariableTextSchema,
  rawValue: string,
  documentIndex: number,
  pageIndex: number,
  issues: PdfPreflightIssue[],
) => {
  const variables = Array.isArray(schema.variables) ? schema.variables : [];
  if (variables.length === 0) {
    return;
  }

  const parsed = parseVariablesInput(rawValue);
  if (rawValue && Object.keys(parsed).length === 0) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'error',
      code: 'invalid-json',
      message: 'El valor de variables no es un JSON válido',
    });
    return;
  }

  const missingVariables = getMissingVariables(rawValue, schema);
  if (missingVariables.length > 0) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: schema.required ? 'error' : 'warning',
      code: schema.required ? 'missing-variable' : 'unresolved-variable',
      message: schema.required
        ? `Faltan variables requeridas: ${missingVariables.join(', ')}`
        : `Variables sin resolver: ${missingVariables.join(', ')}`,
      details: { variables: missingVariables },
    });
  }

  const substituted = substituteVariables(String(schema.text || ''), parsed);
  if (substituted.includes('{') && substituted.includes('}')) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'warning',
      code: 'unresolved-placeholder',
      message: 'Quedan placeholders sin resolver en el texto compuesto',
    });
  }
};

const inspectSelectValue = (
  schema: Schema,
  rawValue: string,
  documentIndex: number,
  pageIndex: number,
  issues: PdfPreflightIssue[],
) => {
  const options = Array.isArray((schema as { options?: string[] }).options)
    ? ((schema as { options?: string[] }).options || []).map((option) => normalizePreflightText(option)).filter(Boolean)
    : [];

  if (!rawValue) {
    if (schema.required) {
      addIssue(issues, {
        documentIndex,
        pageIndex,
        schemaName: schema.name,
        schemaType: schema.type,
        severity: 'error',
        code: 'missing-selection',
        message: 'Falta una selección obligatoria',
      });
    }
    return;
  }

  if (options.length > 0 && !options.includes(rawValue)) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'warning',
      code: 'invalid-selection',
      message: 'La selección no coincide con ninguna opción visible',
      details: { value: rawValue, options },
    });
  }
};

const inspectOptionGroup = (
  schema: Schema,
  rawValue: string,
  documentIndex: number,
  pageIndex: number,
  issues: PdfPreflightIssue[],
) => {
  const optionSelection = getSchemaOptionSelection(schema);
  const selectedIds = optionSelection.multiple || (optionSelection.single ? [optionSelection.single] : []);
  const options = Array.isArray((schema as { options?: Array<string | { optionId?: string; label?: string }> }).options)
    ? ((schema as { options?: Array<string | { optionId?: string; label?: string }> }).options || []).map((option, index) => {
        if (typeof option === 'string') {
          return normalizePreflightText(option);
        }
        return normalizePreflightText(option.optionId) || `option_${index + 1}`;
      }).filter(Boolean)
    : [];

  if (schema.required && selectedIds.length === 0 && !rawValue) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'error',
      code: 'missing-selection',
      message: 'El grupo requiere al menos una selección',
    });
    return;
  }

  if (options.length > 0) {
    const invalid = selectedIds.filter((id) => !options.includes(id));
    if (invalid.length > 0) {
      addIssue(issues, {
        documentIndex,
        pageIndex,
        schemaName: schema.name,
        schemaType: schema.type,
        severity: 'warning',
        code: 'invalid-selection',
        message: 'El grupo contiene opciones seleccionadas que ya no existen',
        details: { invalid, options },
      });
    }
  }
};

const inspectCheckbox = (
  schema: Schema,
  rawValue: string,
  documentIndex: number,
  pageIndex: number,
  issues: PdfPreflightIssue[],
) => {
  const checked = getSchemaBooleanValue({ ...schema, content: rawValue });
  if (schema.required && !checked) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'error',
      code: 'missing-selection',
      message: 'La casilla obligatoria está desmarcada',
    });
  }
};

const inspectNumber = (
  schema: Schema,
  rawValue: string,
  documentIndex: number,
  pageIndex: number,
  issues: PdfPreflightIssue[],
) => {
  if (!rawValue && schema.required) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'error',
      code: 'missing-value',
      message: 'Falta el valor numérico obligatorio',
    });
    return;
  }

  if (rawValue && getSchemaNumberValue({ ...schema, content: rawValue }) == null) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'warning',
      code: 'invalid-number',
      message: 'El valor numérico no se pudo interpretar',
    });
  }
};

const inspectOutOfBounds = (
  schema: Schema,
  basePdf: Template['basePdf'],
  documentIndex: number,
  pageIndex: number,
  issues: PdfPreflightIssue[],
) => {
  if (!isBlankPdf(basePdf)) return;

  const width = Number((basePdf as { width?: number }).width || 0);
  const height = Number((basePdf as { height?: number }).height || 0);
  const left = Number(schema.position?.x || 0);
  const top = Number(schema.position?.y || 0);
  const right = left + Number(schema.width || 0);
  const bottom = top + Number(schema.height || 0);

  if (left < 0 || top < 0 || right > width || bottom > height) {
    addIssue(issues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'warning',
      code: 'out-of-bounds',
      message: 'El schema queda fuera de los límites de la página base',
      details: { left, top, right, bottom, width, height },
    });
  }
};

const inspectSchema = (
  schema: Schema,
  input: Record<string, unknown>,
  documentIndex: number,
  pageIndex: number,
  totalPages: number,
  basePdf: Template['basePdf'],
  schemas: Schema[][],
  issues: PdfPreflightIssue[],
  registry: ReturnType<typeof pluginRegistry>,
) => {
  const schemaIssues: PdfPreflightIssue[] = [];
  const schemaType = normalizePreflightText(schema.type).toLowerCase();
  const hasRenderer = Boolean(registry.findByType(schemaType) || getSchemaPluginByType(schemaType));
  if (!hasRenderer) {
    addIssue(schemaIssues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'error',
      code: 'missing-renderer',
      message: `No hay renderer PDF para el schema tipo '${schema.type}'`,
    });
    issues.push(...schemaIssues);
    return false;
  }

  const rawValue = getSchemaRawValue(schema, input, pageIndex, totalPages, schemas);
  const renderedBeforeChecks = rawValue.length > 0;

  if (schema.required && !rawValue && schema.type !== 'checkbox') {
    addIssue(schemaIssues, {
      documentIndex,
      pageIndex,
      schemaName: schema.name,
      schemaType: schema.type,
      severity: 'error',
      code: 'missing-value',
      message: 'Falta el valor requerido',
    });
  }

  if (schema.type === 'multiVariableText') {
    inspectMultiVariableText(schema as MultiVariableTextSchema, rawValue, documentIndex, pageIndex, schemaIssues);
  } else if (schema.type === 'select' || schema.type === 'dropdown') {
    inspectSelectValue(schema, rawValue, documentIndex, pageIndex, schemaIssues);
  } else if (schema.type === 'checkboxGroup' || schema.type === 'radioGroup') {
    inspectOptionGroup(schema, rawValue, documentIndex, pageIndex, schemaIssues);
  } else if (schema.type === 'checkbox') {
    inspectCheckbox(schema, rawValue, documentIndex, pageIndex, schemaIssues);
  } else if (schema.type === 'number') {
    inspectNumber(schema, rawValue, documentIndex, pageIndex, schemaIssues);
  }

  inspectOutOfBounds(schema, basePdf, documentIndex, pageIndex, schemaIssues);
  issues.push(...schemaIssues);
  return renderedBeforeChecks && !schemaIssues.some((issue) => issue.severity === 'error');
};

export const createPdfPreflightReport = async (props: GenerateProps): Promise<PdfPreflightReport> => {
  const template = cloneDeep(props.template) as Template;
  const registry = getPluginsRegistry(props.plugins);
  const inputList = props.inputs;
  const issues: PdfPreflightIssue[] = [];
  const pages: PdfPreflightPageReport[] = [];

  let totalSchemas = 0;
  let renderedSchemas = 0;
  let emptyPages = 0;

  for (let inputIndex = 0; inputIndex < inputList.length; inputIndex += 1) {
    const input = inputList[inputIndex] || {};
    const dynamicTemplate = await getDynamicTemplate({
      template,
      input,
      options: props.options || {},
      _cache: new Map<string, unknown>(),
      getDynamicHeights: async (_value, args) => [args.schema.height],
    });

    const pageSchemas = dynamicTemplate.schemas as Schema[][];
    const totalPages = pageSchemas.length || 1;

    for (let pageIndex = 0; pageIndex < pageSchemas.length; pageIndex += 1) {
      const page = pageSchemas[pageIndex] || [];
      totalSchemas += page.length;
      if (page.length === 0) {
        emptyPages += 1;
      }

      const pageIssues: PdfPreflightIssue[] = [];
      let renderedCount = 0;

      for (const schema of page) {
        const rendered = inspectSchema(
          schema,
          input,
          inputIndex,
          pageIndex,
          totalPages,
          dynamicTemplate.basePdf,
          pageSchemas,
          pageIssues,
          registry,
        );
        if (rendered) {
          renderedCount += 1;
        }
      }

      renderedSchemas += renderedCount;
      issues.push(...pageIssues);
      pages.push({
        documentIndex: inputIndex,
        pageIndex,
        schemaCount: page.length,
        renderedSchemaCount: renderedCount,
        issues: pageIssues,
        isEmpty: page.length === 0,
      });
    }
  }

  return {
    totalPages: pages.length,
    totalSchemas,
    renderedSchemas,
    skippedSchemas: Math.max(0, totalSchemas - renderedSchemas),
    emptyPages,
    issues,
    pages,
    ok: issues.every((issue) => issue.severity !== 'error'),
  };
};
