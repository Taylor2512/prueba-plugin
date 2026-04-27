import { cloneDeep, type SchemaForUI, type Template } from '@sisad-pdfme/common';
import { img2pdf, pdf2img, pdf2size } from '@sisad-pdfme/converter';
import type { Img2PdfOptions, Pdf2ImgOptions, Pdf2SizeOptions } from '@sisad-pdfme/converter';

type DocumentLike = {
  id?: string | null;
  fileId?: string | null;
  fileTemplateId?: string | null;
  name?: string | null;
  title?: string | null;
  template?: Template | null;
  basePdf?: Template['basePdf'] | null;
  pageCount?: number | string | null;
  pages?: number | string | null;
  schemas?: SchemaForUI[][];
  assignments?: unknown;
  originalForm?: Template | null;
  [key: string]: unknown;
};

const normalizeText = (value: unknown) => String(value || '').trim();

const resolveDocumentId = (document: DocumentLike, index: number) =>
  normalizeText(document.id || document.fileId || document.fileTemplateId) || `document-${index + 1}`;

const normalizeTemplate = (template: Template | null | undefined) => {
  if (!template || typeof template !== 'object') return null;
  return {
    ...template,
    schemas: Array.isArray(template.schemas) ? template.schemas : [[]],
  };
};

export const normalizeTemplatePagesForDocument = (
  templateValue: Partial<Template> | null | undefined,
  pageCount?: number | string | null,
  basePdf?: Template['basePdf'] | null,
) => {
  const sourceTemplate =
    templateValue && typeof templateValue === 'object' ? cloneDeep(templateValue) : {};
  const sourceSchemas = Array.isArray(sourceTemplate.schemas) && sourceTemplate.schemas.length > 0
    ? sourceTemplate.schemas
    : [[]];
  const safePageCount = Math.max(
    1,
    Number(pageCount || sourceTemplate.pageCount || sourceSchemas.length || 1) || 1,
  );
  const normalizedSchemas = sourceSchemas
    .slice(0, safePageCount)
    .map((page) => (Array.isArray(page) ? cloneDeep(page) : []));
  while (normalizedSchemas.length < safePageCount) normalizedSchemas.push([]);

  return {
    ...sourceTemplate,
    basePdf: sourceTemplate.basePdf || basePdf || null,
    pageCount: safePageCount,
    schemas: normalizedSchemas,
  } as Template & { pageCount: number };
};

export const normalizeDocuments = <T extends DocumentLike>(documents: T[] = []) =>
  (Array.isArray(documents) ? documents : []).map((document, index) => {
    const id = resolveDocumentId(document, index);
    return {
      ...document,
      id,
      fileId: normalizeText(document.fileId || document.fileTemplateId || id) || id,
      fileTemplateId: normalizeText(document.fileTemplateId || document.fileId || id) || id,
      name: normalizeText(document.name || document.title || id) || id,
      title: normalizeText(document.title || document.name || id) || id,
      template: normalizeTemplate(document.template),
    };
  });

export const resolveActiveDocument = <T extends DocumentLike>(
  documents: T[] = [],
  activeDocumentId?: string | null,
) => {
  const normalizedDocuments = normalizeDocuments(documents);
  const normalizedActiveId = normalizeText(activeDocumentId);
  return (
    normalizedDocuments.find((document) => document.id === normalizedActiveId) ||
    normalizedDocuments[0] ||
    null
  );
};

export const pdfToImages = (pdf: ArrayBuffer | Uint8Array, options: Pdf2ImgOptions = {}) =>
  pdf2img(pdf, options);

export const pdfToPageSizes = (pdf: ArrayBuffer | Uint8Array, options: Pdf2SizeOptions = {}) =>
  pdf2size(pdf, options);

export const imagesToPdf = (images: ArrayBuffer[], options: Img2PdfOptions = {}) =>
  img2pdf(images, options);

export const getPdfPageSizes = pdfToPageSizes;

export const filterSchemasByFileAndPage = (
  source: Template | SchemaForUI[][] = [[]],
  fileId?: string | null,
  pageNumber?: number | null,
) => {
  const schemas = Array.isArray(source) ? source : source?.schemas || [];
  const normalizedFileId = normalizeText(fileId);
  const normalizedPageNumber =
    Number.isFinite(pageNumber) && Number(pageNumber) > 0 ? Math.trunc(Number(pageNumber)) : null;

  return (schemas || []).flatMap((page = [], pageIndex) =>
    (page || []).filter((schema) => {
      const schemaFileId = normalizeText(schema.fileId || schema.fileTemplateId);
      const schemaPageNumber =
        Number.isFinite(schema.pageNumber) && Number(schema.pageNumber) > 0
          ? Math.trunc(Number(schema.pageNumber))
          : pageIndex + 1;
      if (normalizedFileId && schemaFileId && schemaFileId !== normalizedFileId) return false;
      if (normalizedPageNumber && schemaPageNumber !== normalizedPageNumber) return false;
      return true;
    }),
  );
};

export const reconcileTemplateDocuments = <T extends DocumentLike>(
  documents: T[] = [],
  templatesByDocumentId: Record<string, Template> = {},
) =>
  normalizeDocuments(documents).map((document) => {
    const templateFromMap = templatesByDocumentId[document.id || ''];
    const resolvedTemplate = normalizeTemplate(templateFromMap || document.template || null);
    return {
      ...document,
      template: resolvedTemplate,
      schemas: cloneDeep(resolvedTemplate?.schemas || []),
    };
  });

export const mergeDesignerDocumentIntoFile = <T extends DocumentLike>(
  existingFile: T | null | undefined,
  documentId: string | null | undefined,
  document: DocumentLike | null | undefined,
) => {
  const normalizedId = normalizeText(documentId || document?.id || existingFile?.id);
  if (!normalizedId && !existingFile && !document) return null;

  const runtimeTemplate =
    document?.template && typeof document.template === 'object'
      ? document.template
      : existingFile?.template || ({ schemas: [[]] } as Template);
  const resolvedPageCount = Math.max(
    1,
    Number(document?.pageCount || document?.pages || existingFile?.pageCount || existingFile?.pages || runtimeTemplate?.schemas?.length || 1) || 1,
  );
  const resolvedBasePdf =
    runtimeTemplate?.basePdf ||
    document?.basePdf ||
    existingFile?.basePdf ||
    existingFile?.template?.basePdf ||
    null;
  const normalizedTemplate = normalizeTemplatePagesForDocument(
    runtimeTemplate,
    resolvedPageCount,
    resolvedBasePdf,
  );
  const mergedFile = existingFile ? cloneDeep(existingFile) : {};
  if (document && typeof document === 'object') {
    Object.assign(mergedFile, cloneDeep(document));
  }

  return {
    ...mergedFile,
    id: normalizedId,
    fileId: normalizedId,
    fileTemplateId: normalizedId,
    name: normalizeText(document?.name || existingFile?.name) || `Documento ${normalizedId}`,
    title: normalizeText(document?.title || document?.name || existingFile?.title || existingFile?.name) || `Documento ${normalizedId}`,
    pageCount: resolvedPageCount,
    pages: resolvedPageCount,
    basePdf: resolvedBasePdf,
    template: normalizedTemplate,
    assignments: cloneDeep((mergedFile as DocumentLike)?.assignments || existingFile?.assignments || {}),
    originalForm: normalizeTemplatePagesForDocument(
      (mergedFile as DocumentLike)?.originalForm || existingFile?.originalForm || normalizedTemplate,
      resolvedPageCount,
      resolvedBasePdf,
    ),
    updatedAt: Number(document?.updatedAt) || Number(existingFile?.updatedAt) || Date.now(),
  };
};
