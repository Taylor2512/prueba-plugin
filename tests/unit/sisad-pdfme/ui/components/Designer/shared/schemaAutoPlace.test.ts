import { describe, expect, it } from 'vitest';
import { buildAutoPlaceDescriptor, resolveSchemaAutoPlaceDescriptor } from '@/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.js';

describe('sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts', () => {
  it('builds and resolves descriptors with schema/document defaults', () => {
    const descriptor = buildAutoPlaceDescriptor('contract_name', {
      fieldType: 'text',
      schemaUid: 'schema-1',
      schemaName: 'contract_name',
      documentId: 'doc-1',
      pageIndex: 2,
    });

    expect(descriptor).toMatchObject({
      enabled: true,
      keyword: 'contract_name',
      fieldType: 'text',
      schemaUid: 'schema-1',
      schemaName: 'contract_name',
      documentId: 'doc-1',
      pageIndex: 2,
    });

    const resolved = resolveSchemaAutoPlaceDescriptor(
      { autoPlaceText: 'Nombre', type: 'text', id: 'schema-2', pageNumber: 3 },
      { documentId: 'doc-2', schemaName: 'Nombre' },
    );

    expect(resolved).toMatchObject({
      keyword: 'Nombre',
      documentId: 'doc-2',
      pageIndex: 2,
    });
  });
});
