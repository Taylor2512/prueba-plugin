export type PageMetadata = {
  documentId?: string | null;
  pageIndex?: number;
  pageNumber?: number;
};

export const buildPageMetadataAttrs = ({
  documentId,
  pageIndex,
  pageNumber,
}: PageMetadata): {
  'data-document-id'?: string;
  'data-page-index'?: string;
  'data-page-number'?: string;
} => ({
  'data-document-id': documentId || undefined,
  'data-page-index': typeof pageIndex === 'number' ? String(pageIndex) : undefined,
  'data-page-number': typeof pageNumber === 'number' ? String(pageNumber) : undefined,
});
