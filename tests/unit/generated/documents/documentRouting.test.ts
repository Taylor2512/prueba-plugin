import { describe, expect, it, vi } from 'vitest';
import {
  filterSchemasByFileAndPage,
  mergeDesignerDocumentIntoFile,
  normalizeDocuments,
  normalizeTemplatePagesForDocument,
  reconcileTemplateDocuments,
  resolveActiveDocument,
} from '@/sisad-pdfme/documents';
import { schema } from '../fixtures/sisadFixtures';

describe('document routing', () => {
  it('normaliza pageCount y crea páginas faltantes', () => {
    const normalized = normalizeTemplatePagesForDocument({ schemas: [[schema() as any]] } as any, 3, 'pdf-data' as any);
    expect(normalized.schemas).toHaveLength(3);
    expect(normalized.pageCount).toBe(3);
    expect(normalized.basePdf).toBe('pdf-data');
  });

  it('normaliza ids, fileId, title y activo', () => {
    const docs = normalizeDocuments([
      { fileTemplateId: 'file-a', name: 'Contrato' },
      { id: 'file-b', title: 'Anexo' },
    ] as any);
    expect(docs[0]).toMatchObject({ id: 'file-a', fileId: 'file-a', title: 'Contrato' });
    expect(resolveActiveDocument(docs, 'file-b')?.id).toBe('file-b');
    expect(resolveActiveDocument(docs, 'missing')?.id).toBe('file-a');
  });

  it('filtra schemas por file y página usando fallback del índice', () => {
    const pages = [
      [schema({ id: 'a', fileId: 'file-a', pageNumber: 1 }) as any],
      [schema({ id: 'b', fileId: 'file-b', pageNumber: 2 }) as any],
    ];
    expect(filterSchemasByFileAndPage(pages as any, 'file-b', 2).map((item) => item.id)).toEqual(['b']);
    expect(filterSchemasByFileAndPage(pages as any, 'file-a', 2)).toEqual([]);
  });

  it('reconcilia templates por documento', () => {
    const docs = reconcileTemplateDocuments(
      [{ id: 'file-a', name: 'A' }] as any,
      { 'file-a': { schemas: [[schema() as any]] } as any },
    );
    expect(docs[0].schemas).toHaveLength(1);
    expect(docs[0].template?.schemas[0][0].schemaUid).toBe('schema-1');
  });

  it('merge preserva assignments, originalForm y routing', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123);
    const merged = mergeDesignerDocumentIntoFile(
      { id: 'file-a', name: 'Anterior', assignments: { a: 1 } } as any,
      'file-a',
      { name: 'Nuevo', pageCount: 2, template: { schemas: [[schema() as any]] } as any } as any,
    ) as any;
    expect(merged).toMatchObject({ id: 'file-a', fileId: 'file-a', pageCount: 2, pages: 2, name: 'Nuevo', updatedAt: 123 });
    expect(merged.template.schemas).toHaveLength(2);
    expect(merged.originalForm.schemas).toHaveLength(2);
    expect(merged.assignments).toEqual({ a: 1 });
  });
});
