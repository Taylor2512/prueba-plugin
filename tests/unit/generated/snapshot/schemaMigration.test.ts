import { describe, expect, it } from 'vitest';
import {
  isDesignerConfig,
  migrateDesignerMetaToConfig,
  serializeDesignerConfig,
} from '@/sisad-pdfme/shared/schemaMigration';

describe('schema designer metadata migration', () => {
  it('migra identidad, collaboration, bindings, ui y runtime', () => {
    const config = migrateDesignerMetaToConfig({
      schemaUid: 's1', templateVersion: '2', documentId: 'd1', pageNumber: 2,
      recipientId: 'r1', recipientName: 'Cliente', recipientColor: '#2563eb',
      assignment: { scope: 'recipient' }, ownership: { readonly: true },
      integration: { dataKey: 'name' }, group: { groupId: 'g1' },
      signature: { mode: 'draw' },
    } as any);
    expect(config._v).toBe(3);
    expect(config.identity.schemaUid).toBe('s1');
    expect(config.collaboration?.recipientId).toBe('r1');
    expect(config.bindings?.integration).toEqual({ dataKey: 'name' });
    expect(config.ui?.group).toEqual({ groupId: 'g1' });
    expect(config.runtime?.signature).toEqual({ mode: 'draw' });
    expect(isDesignerConfig(config)).toBe(true);
  });

  it('serialize conserva campos del contrato actual', () => {
    const serialized = serializeDesignerConfig(migrateDesignerMetaToConfig({
      schemaUid: 's1', documentId: 'd1', pageNumber: 1, recipientId: 'r1',
    } as any));
    expect(serialized).toMatchObject({ schemaUid: 's1', documentId: 'd1', pageNumber: 1, recipientId: 'r1' });
  });

  it('type guard rechaza valores incompletos', () => {
    expect(isDesignerConfig(null)).toBe(false);
    expect(isDesignerConfig({ _v: 3, identity: {} })).toBe(false);
  });
});
