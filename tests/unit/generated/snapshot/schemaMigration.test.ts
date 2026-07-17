import { describe, expect, it } from 'vitest';
import {
  flattenV3ToLegacy,
  isDesignerConfigV3,
  migrateSchemaToV3,
} from '@/sisad-pdfme/shared/schemaMigration';

describe('schema designer metadata migration', () => {
  it('migra identidad, collaboration, bindings, ui y runtime', () => {
    const v3 = migrateSchemaToV3({
      schemaUid: 's1', templateVersion: '2', documentId: 'd1', pageNumber: 2,
      recipientId: 'r1', recipientName: 'Cliente', recipientColor: '#2563eb',
      assignment: { scope: 'recipient' }, ownership: { readonly: true },
      integration: { dataKey: 'name' }, group: { groupId: 'g1' },
      signature: { mode: 'draw' },
    } as any);
    expect(v3._v).toBe(3);
    expect(v3.identity.schemaUid).toBe('s1');
    expect(v3.collaboration?.recipientId).toBe('r1');
    expect(v3.bindings?.integration).toEqual({ dataKey: 'name' });
    expect(v3.ui?.group).toEqual({ groupId: 'g1' });
    expect(v3.runtime?.signature).toEqual({ mode: 'draw' });
    expect(isDesignerConfigV3(v3)).toBe(true);
  });

  it('flatten conserva campos legacy esenciales', () => {
    const legacy = flattenV3ToLegacy(migrateSchemaToV3({
      schemaUid: 's1', documentId: 'd1', pageNumber: 1, recipientId: 'r1',
    } as any));
    expect(legacy).toMatchObject({ schemaUid: 's1', documentId: 'd1', pageNumber: 1, recipientId: 'r1' });
  });

  it('type guard rechaza valores incompletos', () => {
    expect(isDesignerConfigV3(null)).toBe(false);
    expect(isDesignerConfigV3({ _v: 3, identity: {} })).toBe(false);
  });
});
