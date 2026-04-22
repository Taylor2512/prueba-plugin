import type { PdfComment } from './comments.js';

export type SchemaIdentity = {
  schemaUid?: string;
  fileId?: string;
  fileTemplateId?: string;
  pageNumber?: number;
  createdBy?: string;
  createdAt?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: number;
  userColor?: string;
};

export type CollaborativeSchemaContract = SchemaIdentity & {
  ownerMode?: 'single' | 'multi' | 'shared';
  ownerRecipientId?: string;
  ownerRecipientIds?: string[];
  ownerRecipientName?: string;
  ownerColor?: string;
  comments?: PdfComment[];
};
