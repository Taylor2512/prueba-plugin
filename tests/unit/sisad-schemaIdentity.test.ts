/**
 * FASE 10 — Tests: Identidad de schema (sisad-pdfme)
 * Valida invariantes de SchemaDesignerMeta.
 */
import { describe, it, expect } from 'vitest';
import {
  createSchemaDesignerMeta,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
  type SchemaDesignerMeta,
} from '../../src/sisad-pdfme/shared/schemaDesignerMeta.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function makeMeta(overrides?: Partial<Parameters<typeof createSchemaDesignerMeta>[0]>): SchemaDesignerMeta {
  return createSchemaDesignerMeta({
    documentId: 'doc-1',
    pageNumber: 1,
    templateVersion: '2.0.0',
    recipientId: 'r-A',
    recipientName: 'Ana',
    recipientColor: '#3B82F6',
    ...overrides,
  });
}

describe('createSchemaDesignerMeta', () => {
  it('genera UUID v4 válido', () => {
    expect(makeMeta().schemaUid).toMatch(UUID_REGEX);
  });

  it('UIDs son únicos entre llamadas', () => {
    expect(makeMeta().schemaUid).not.toBe(makeMeta().schemaUid);
  });

  it('version inicia en 0', () => {
    expect(makeMeta().version).toBe(0);
  });

  it('assignment.scope = recipient cuando hay recipientId', () => {
    expect(makeMeta().assignment?.scope).toBe('recipient');
  });

  it('assignment.scope = global sin recipientId', () => {
    expect(makeMeta({ recipientId: undefined }).assignment?.scope).toBe('global');
  });
});

describe('duplicateSchemaDesignerMeta', () => {
  it('genera nuevo schemaUid', () => {
    const src = makeMeta();
    const dup = duplicateSchemaDesignerMeta(src);
    expect(dup.schemaUid).not.toBe(src.schemaUid);
    expect(dup.schemaUid).toMatch(UUID_REGEX);
  });

  it('preserva recipientId/Name/Color', () => {
    const src = makeMeta();
    const dup = duplicateSchemaDesignerMeta(src);
    expect(dup.recipientId).toBe(src.recipientId);
    expect(dup.recipientName).toBe(src.recipientName);
    expect(dup.recipientColor).toBe(src.recipientColor);
  });

  it('resetea version a 0', () => {
    const src = { ...makeMeta(), version: 7 };
    expect(duplicateSchemaDesignerMeta(src).version).toBe(0);
  });
});

describe('pasteSchemaDesignerMeta', () => {
  it('siempre genera nuevo schemaUid', () => {
    const src = makeMeta();
    const pasted = pasteSchemaDesignerMeta(src, { pageNumber: 2, documentId: 'doc-1' });
    expect(pasted.schemaUid).not.toBe(src.schemaUid);
  });

  it('actualiza pageNumber al destino', () => {
    const src = makeMeta();
    expect(pasteSchemaDesignerMeta(src, { pageNumber: 4, documentId: 'doc-1' }).pageNumber).toBe(4);
  });

  it('mantiene recipientId al pegar en otro documento', () => {
    const src = makeMeta();
    const pasted = pasteSchemaDesignerMeta(src, { pageNumber: 1, documentId: 'doc-99' });
    expect(pasted.recipientId).toBe(src.recipientId);
  });

  it('resetea integration al cambiar de documento', () => {
    const src: SchemaDesignerMeta = { ...makeMeta(), integration: { provider: 'oneshot', envelopeId: 'e-1' } };
    const pasted = pasteSchemaDesignerMeta(src, { pageNumber: 1, documentId: 'doc-99' });
    expect(pasted.integration).toEqual({});
  });

  it('preserva integration en el mismo documento', () => {
    const src: SchemaDesignerMeta = { ...makeMeta(), integration: { provider: 'oneshot', envelopeId: 'e-1' } };
    const pasted = pasteSchemaDesignerMeta(src, { pageNumber: 2, documentId: 'doc-1' });
    expect(pasted.integration).toEqual(src.integration);
  });
});
