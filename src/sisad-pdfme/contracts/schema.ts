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

// ── Re-exportación de contratos de Fase 1 ────────────────────────────────────
// SchemaDesignerMeta es la fuente de verdad de identidad de cada schema.
// Vive en shared/schemaDesignerMeta.ts para evitar dependencias circulares.
export type { SchemaDesignerMeta } from '../shared/schemaDesignerMeta.js';
export {
  createSchemaDesignerMeta,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
} from '../shared/schemaDesignerMeta.js';
