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
  const keyword =
    normalizeText(schema?.autoPlaceText) ||
    normalizeText(schema?.__designer?.autoPlace?.keyword) ||
    normalizeText(options.keyword) ||
    '';
  if (!keyword) return null;

  return buildAutoPlaceDescriptor(keyword, {
    scope:
      options.scope ||
      schema?.__designer?.autoPlace?.scope ||
      schema?.autoPlaceScope ||
      DEFAULT_AUTO_PLACE_SCOPE,
    matchMode:
      options.matchMode ||
      schema?.__designer?.autoPlace?.matchMode ||
      schema?.autoPlaceMatchMode ||
      DEFAULT_AUTO_PLACE_MATCH_MODE,
    fieldType: options.fieldType || schema?.type,
    schemaUid: options.schemaUid || schema?.schemaUid || schema?.id,
    schemaName: options.schemaName || schema?.name,
    documentId: options.documentId || schema?.documentId || schema?.fileTemplateId || schema?.fileId,
    pageIndex:
      options.pageIndex !== undefined
        ? options.pageIndex
        : schema?.pageIndex !== undefined
          ? schema.pageIndex
          : schema?.pageNumber !== undefined
            ? Math.max(0, Number(schema.pageNumber) - 1)
            : undefined,
  });
};

export const collectAutoPlaceRulesFromDocuments = (documents: unknown[] = []) => {
  if (!Array.isArray(documents) || !documents.length) return [];

  const rules: Record<string, unknown>[] = [];
  documents.forEach((document: Record<string, unknown> = {}) => {
    const documentId = normalizeText(document?.id || document?.fileId || document?.fileTemplateId);
    const templateSchemas = Array.isArray(document?.template?.schemas) ? document.template.schemas : [];
    templateSchemas.forEach((page: unknown[] = [], pageIndex: number) => {
      (Array.isArray(page) ? page : []).forEach((schema: Record<string, unknown> = {}) => {
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
