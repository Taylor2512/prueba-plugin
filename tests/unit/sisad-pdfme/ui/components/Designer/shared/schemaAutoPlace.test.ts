import { describe, expect, it } from 'vitest';
import {
  buildAutoPlaceDescriptor,
  resolveSchemaAutoPlaceDescriptor,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.js';

describe('buildAutoPlaceDescriptor', () => {
  it('builds descriptor with all explicit options', () => {
    const d = buildAutoPlaceDescriptor('contract_name', {
      fieldType: 'text',
      schemaUid: 'schema-1',
      schemaName: 'contract_name',
      documentId: 'doc-1',
      pageIndex: 2,
    });

    expect(d).toMatchObject({
      enabled: true,
      keyword: 'contract_name',
      fieldType: 'text',
      schemaUid: 'schema-1',
      schemaName: 'contract_name',
      documentId: 'doc-1',
      pageIndex: 2,
    });
  });

  it('returns null when keyword is empty', () => {
    expect(buildAutoPlaceDescriptor('')).toBeNull();
    expect(buildAutoPlaceDescriptor('   ')).toBeNull();
  });

  it('returns null when keyword is non-string', () => {
    expect(buildAutoPlaceDescriptor(null)).toBeNull();
    expect(buildAutoPlaceDescriptor(undefined)).toBeNull();
  });

  it('applies default scope and matchMode when not provided', () => {
    const d = buildAutoPlaceDescriptor('field');
    expect(d?.scope).toBe('document');
    expect(d?.matchMode).toBe('contains');
  });

  it('trims whitespace from keyword', () => {
    const d = buildAutoPlaceDescriptor('  firma  ');
    expect(d?.keyword).toBe('firma');
  });

  it('preserves custom scope and matchMode', () => {
    const d = buildAutoPlaceDescriptor('name', { scope: 'page', matchMode: 'exact' });
    expect(d?.scope).toBe('page');
    expect(d?.matchMode).toBe('exact');
  });
});

describe('resolveSchemaAutoPlaceDescriptor', () => {
  it('resolves from schema autoPlaceText', () => {
    const d = resolveSchemaAutoPlaceDescriptor(
      { autoPlaceText: 'Nombre', type: 'text', id: 'schema-2', pageNumber: 3 },
      { documentId: 'doc-2', schemaName: 'Nombre' },
    );
    expect(d).not.toBeNull();
    expect(d?.keyword).toBe('Nombre');
    expect(d?.documentId).toBe('doc-2');
  });

  it('returns null when schema has no autoPlaceText or __designer.autoPlace', () => {
    const d = resolveSchemaAutoPlaceDescriptor({ id: 'x', type: 'text' }, {});
    expect(d).toBeNull();
  });

  it('resolves from __designer.autoPlace.keyword', () => {
    const d = resolveSchemaAutoPlaceDescriptor({
      id: 'y',
      __designer: { autoPlace: { keyword: 'empresa' } },
    });
    expect(d?.keyword).toBe('empresa');
  });

  it('passes fieldType from schema type', () => {
    const d = resolveSchemaAutoPlaceDescriptor(
      { autoPlaceText: 'date_signed', type: 'dateSigned' },
      {},
    );
    expect(d?.fieldType).toBe('dateSigned');
  });
});
