import { expect } from 'vitest';
import type { SchemaDesignerMeta } from '../../../src/sisad-pdfme/shared/schemaDesignerMeta.js';

export function expectSchemaIdentity(meta: SchemaDesignerMeta, expected: Partial<SchemaDesignerMeta>) {
  expect(meta.schemaUid).toBe(expected.schemaUid ?? meta.schemaUid);
  expect(meta.documentId).toBe(expected.documentId ?? meta.documentId);
  expect(meta.pageNumber).toBe(expected.pageNumber ?? meta.pageNumber);
  if (expected.templateVersion) {
    expect(meta.templateVersion).toBe(expected.templateVersion);
  }
}

export function expectStableSchemaIdentity(before: SchemaDesignerMeta, after: SchemaDesignerMeta) {
  expect(after.schemaUid).toBe(before.schemaUid);
  expect(after.createdAt).toBe(before.createdAt);
  expect(after.version).toBe(before.version);
}

export function expectNewSchemaIdentity(before: SchemaDesignerMeta, after: SchemaDesignerMeta) {
  expect(after.schemaUid).not.toBe(before.schemaUid);
  expect(after.createdAt).not.toBe(before.createdAt);
  expect(after.updatedAt).not.toBe(before.updatedAt);
}
