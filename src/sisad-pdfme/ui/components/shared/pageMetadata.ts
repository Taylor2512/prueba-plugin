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

export const applyPageMetadataDataset = (
  element: HTMLElement,
  metadata: PageMetadata & { pageActive?: boolean; pageEmpty?: boolean },
): void => {
  const { documentId, pageIndex, pageNumber, pageActive, pageEmpty } = metadata;

  if (documentId) {
    element.dataset.documentId = documentId;
  } else {
    delete element.dataset.documentId;
  }

  if (typeof pageIndex === 'number') {
    element.dataset.pageIndex = String(pageIndex);
  } else {
    delete element.dataset.pageIndex;
  }

  if (typeof pageNumber === 'number') {
    element.dataset.pageNumber = String(pageNumber);
  } else {
    delete element.dataset.pageNumber;
  }

  if (typeof pageActive === 'boolean') {
    element.dataset.pageActive = pageActive ? 'true' : 'false';
  }

  if (typeof pageEmpty === 'boolean') {
    element.dataset.pageEmpty = pageEmpty ? 'true' : 'false';
  }
};
