import { asRecord, isRecord } from './objectGuards.js';

const DEFAULT_AUTO_PLACE_SCOPE = 'document';
const DEFAULT_AUTO_PLACE_MATCH_MODE = 'contains';

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const buildAutoPlaceDescriptor = (keyword: unknown, options: Record<string, unknown> = {}) => {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return null;

  const normalizedScope = normalizeText(options.scope) || DEFAULT_AUTO_PLACE_SCOPE;
  const normalizedMatchMode = normalizeText(options.matchMode) || DEFAULT_AUTO_PLACE_MATCH_MODE;

  return {
    enabled: true as const,
    keyword: normalizedKeyword,
    scope: normalizedScope,
    matchMode: normalizedMatchMode,
    fieldType: normalizeText(options.fieldType) || null,
    schemaUid: normalizeText(options.schemaUid) || null,
    schemaName: normalizeText(options.schemaName) || null,
    documentId: normalizeText(options.documentId) || null,
    pageIndex: Number.isFinite(Number(options.pageIndex)) ? Number(options.pageIndex) : undefined,
  };
};

export const resolveSchemaAutoPlaceDescriptor = (schema: Record<string, unknown> = {}, options: Record<string, unknown> = {}) => {
  const s = schema;
  const designer = isRecord(s.__designer) ? s.__designer : undefined;
  const autoPlace = isRecord(designer?.autoPlace) ? designer.autoPlace : undefined;
  const keyword =
    normalizeText(s?.autoPlaceText) ||
    normalizeText(autoPlace?.keyword) ||
    normalizeText(options.keyword) ||
    '';
  if (!keyword) return null;

  return buildAutoPlaceDescriptor(keyword, {
    scope:
      options.scope ||
      autoPlace?.scope ||
      s?.autoPlaceScope ||
      DEFAULT_AUTO_PLACE_SCOPE,
    matchMode:
      options.matchMode ||
      autoPlace?.matchMode ||
      s?.autoPlaceMatchMode ||
      DEFAULT_AUTO_PLACE_MATCH_MODE,
    fieldType: options.fieldType || s?.type,
    schemaUid: options.schemaUid || s?.schemaUid || s?.id,
    schemaName: options.schemaName || s?.name,
    documentId: options.documentId || s?.documentId || s?.fileTemplateId || s?.fileId,
    pageIndex:
      options.pageIndex !== undefined
        ? options.pageIndex
        : s?.pageIndex !== undefined
          ? s.pageIndex
          : s?.pageNumber !== undefined
            ? Math.max(0, Number(s.pageNumber) - 1)
            : undefined,
  });
};

const collectAutoPlaceRulesFromDocuments = (documents: unknown[] = []) => {
  if (!Array.isArray(documents) || !documents.length) return [];

  const rules: Record<string, unknown>[] = [];
  documents.forEach((documentRaw: unknown = {}) => {
    const document = asRecord(documentRaw);
    if (!document) return;
    const documentId = normalizeText(document?.id || document?.fileId || document?.fileTemplateId);
    const template = isRecord(document.template) ? document.template : undefined;
    const templateSchemas = Array.isArray(template?.schemas) ? template.schemas : [];
    templateSchemas.forEach((page: unknown[] = [], pageIndex: number) => {
      (Array.isArray(page) ? page : []).forEach((schemaRaw: unknown = {}) => {
        if (!isRecord(schemaRaw)) return;
        const schema = schemaRaw;
        const descriptor = resolveSchemaAutoPlaceDescriptor(schema, {
          documentId,
          pageIndex,
        });
        if (!descriptor) return;
        rules.push({
          ...descriptor,
          documentId: descriptor.documentId || documentId || null,
          pageIndex: descriptor.pageIndex !== undefined ? descriptor.pageIndex : pageIndex,
          schemaUid: descriptor.schemaUid || normalizeText(schema?.schemaUid || schema?.id) || null,
          schemaName: descriptor.schemaName || normalizeText(schema?.name) || null,
        });
      });
    });
  });

  return rules;
};
