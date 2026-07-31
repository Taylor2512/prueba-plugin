import type { SisadPdfmeDocumentsAdapter } from '../config/SisadPdfmeConfig.js';

export type {  SisadPdfmeDocumentsAdapter };

export const createDocumentsAdapter = <THostDocument = unknown>(): SisadPdfmeDocumentsAdapter<THostDocument> => ({
  toDocument(input) {
    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      const id = String(record.id ?? record.documentId ?? record.fileId ?? '').trim();
      const label = String(record.label ?? record.name ?? id).trim();
      const templateSource =
        (record.template && typeof record.template === 'object' ? record.template : undefined) ||
        (record.metadata && typeof record.metadata === 'object'
          ? (record.metadata as Record<string, unknown>).template
          : undefined);
      const template = templateSource && typeof templateSource === 'object' ? templateSource : undefined;
      const pageCount =
        typeof record.pageCount === 'number'
          ? record.pageCount
          : template && typeof template === 'object' && Array.isArray((template as Record<string, unknown>).schemas)
            ? ((template as Record<string, unknown>).schemas as unknown[]).length
            : undefined;
      return {
        id: id || label || 'document',
        label: label || id || 'Document',
        name: label || id || 'Document',
        pageCount,
        basePdf: record.basePdf,
        template,
        metadata: record,
      };
    }
    const value = String(input ?? '').trim();
    return { id: value || 'document', label: value || 'Document', name: value || 'Document' };
  },
  toDocuments(input) {
    return Array.isArray(input) ? input.map((entry) => this.toDocument(entry)) : [];
  },
});
