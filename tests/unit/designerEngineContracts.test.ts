import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  DEFAULT_SCHEMA_CONFIG_STORAGE_KEY,
  DesignerEngineBuilder,
  applySchemaCollaborativeDefaults,
  applySchemaCreationHook,
  attachSchemaIdentity,
  createSchemaCreationContext,
  getSchemaConfigStorageKey,
  getSchemaDesignerConfig,
  mergeSchemaCollaborativeMetadata,
  mergeSchemaDesignerConfig,
  refreshSchemaCollaborativeMetadata,
  resolveDesignerEngine,
  resolveDesignerHttpClientConfig,
  resolveSchemaCollaborativeMetadata,
  setSchemaDesignerConfig,
} from '../../src/sisad-pdfme/ui/designerEngine.js';

const schema = (patch: Partial<SchemaForUI> = {}): SchemaForUI =>
  ({
    id: patch.id || 'schema-1',
    name: patch.name || 'texto_01',
    type: patch.type || 'text',
    position: patch.position || { x: 0, y: 0 },
    width: patch.width || 10,
    height: patch.height || 10,
    ...patch,
  }) as SchemaForUI;

describe('designerEngine contracts and helpers', () => {
  it('creates schema creation context with normalized owner ids', () => {
    const context = createSchemaCreationContext({
      pageIndex: 2,
      totalPages: 5,
      collaboration: {
        actorId: 'u-1',
        ownerRecipientId: 'u-1',
        ownerRecipientIds: ['u-1', 'u-2', 'u-1'],
      },
    });

    expect(context.pageNumber).toBe(3);
    expect(context.actorId).toBe('u-1');
    expect(context.ownerRecipientId).toBe('u-1');
    expect(context.ownerRecipientIds).toEqual(['u-1', 'u-2']);
  });

  it('merges collaborative metadata preserving lock and normalized recipients', () => {
    const merged = mergeSchemaCollaborativeMetadata(
      {
        ownerRecipientIds: ['a'],
        lock: { lockedBy: 'x', lockedAt: 1 },
      },
      {
        ownerRecipientIds: ['a', 'b', 'b'],
        lock: { reason: 'editing' },
      },
    );

    expect(merged?.ownerRecipientIds).toEqual(['a', 'b']);
    expect(merged?.lock).toEqual({ lockedBy: 'x', lockedAt: 1, reason: 'editing' });
  });

  it('resolves collaboration metadata from schema fields + designer config', () => {
    const base = schema({ createdBy: 'user-a', ownerRecipientIds: ['r1'], commentsCount: 1 });
    const withConfig = mergeSchemaDesignerConfig(base, {
      collaboration: { ownerRecipientIds: ['r1', 'r2'], ownerMode: 'multi' },
    });

    const resolved = resolveSchemaCollaborativeMetadata(withConfig);
    expect(resolved?.createdBy).toBe('user-a');
    expect(resolved?.ownerMode).toBe('multi');
    expect(resolved?.ownerRecipientIds).toEqual(['r1', 'r2']);
  });

  it('applies collaborative defaults and refreshes metadata timestamps', () => {
    const context = createSchemaCreationContext({
      pageIndex: 0,
      totalPages: 1,
      timestamp: 100,
      fileId: 'file-1',
      collaboration: { actorId: 'author-1', ownerRecipientId: 'recipient-1', ownerColor: '#111' },
    });

    const applied = applySchemaCollaborativeDefaults(schema(), context);
    expect(applied.schemaUid).toBe(applied.id);
    expect(applied.fileId).toBe('file-1');
    expect(applied.createdBy).toBe('author-1');
    expect(applied.lastModifiedBy).toBe('author-1');

    const refreshed = refreshSchemaCollaborativeMetadata(applied, { ...context, timestamp: 200 });
    expect(refreshed.updatedAt).toBe(200);
    expect(refreshed.lastModifiedAt).toBe(200);
  });

  it('resolves engine from options and schema config storage keys', () => {
    const engine = resolveDesignerEngine({
      designerEngine: {
        schema: { configStorageKey: '__custom__' },
      },
    });

    expect(getSchemaConfigStorageKey(engine)).toBe('__custom__');
    expect(getSchemaConfigStorageKey()).toBe(DEFAULT_SCHEMA_CONFIG_STORAGE_KEY);
  });

  it('sets and reads schema designer config with merge behavior', () => {
    const base = schema();
    const configured = setSchemaDesignerConfig(base, { metadata: { source: 'test' } });
    expect(getSchemaDesignerConfig(configured)?.metadata).toEqual({ source: 'test' });

    const merged = mergeSchemaDesignerConfig(configured, {
      metadata: { origin: 'suite' },
      identity: { id: 'identity-1' },
      prefill: { enabled: true },
    });

    expect(getSchemaDesignerConfig(merged)?.metadata).toEqual({ source: 'test', origin: 'suite' });
    expect(getSchemaDesignerConfig(merged)?.identity?.id).toBe('identity-1');
    expect(getSchemaDesignerConfig(merged)?.prefill?.enabled).toBe(true);
  });

  it('resolves http config with inherit, merge headers and auth precedence', () => {
    const engine = new DesignerEngineBuilder()
      .withHttpAxiosConfig({
        baseURL: 'https://api.system',
        headers: { Authorization: 'Bearer system', 'X-System': '1' },
        auth: { mode: 'manual', type: 'bearer', token: 'system-token' },
      })
      .build();

    const resolved = resolveDesignerHttpClientConfig(
      {
        api: {
          http: {
            inheritSystem: true,
            headers: { 'X-Field': '2' },
            auth: { mode: 'inherit' },
          },
        },
      },
      engine,
    );

    expect(resolved?.headers).toMatchObject({ Authorization: 'Bearer system', 'X-System': '1', 'X-Field': '2' });
    expect(resolved?.auth?.type).toBe('bearer');
  });

  it('attaches identity automatically and supports custom identityFactory', () => {
    const context = createSchemaCreationContext({ pageIndex: 0, totalPages: 1 });

    const auto = attachSchemaIdentity(schema(), context, new DesignerEngineBuilder().build());
    expect(getSchemaDesignerConfig(auto)?.identity?.id).toBe('schema-1');

    const customEngine = new DesignerEngineBuilder()
      .withSchemaIdentityFactory((nextSchema) => ({
        id: `custom-${nextSchema.id}`,
        key: nextSchema.name,
        namespace: 'x',
        version: '2',
      }))
      .build();
    const custom = attachSchemaIdentity(schema(), context, customEngine);
    expect(getSchemaDesignerConfig(custom, customEngine)?.identity?.id).toBe('custom-schema-1');
  });

  it('applies schema creation hook when configured', () => {
    const hook = vi.fn((s: SchemaForUI) => ({ ...s, name: `${s.name}_hooked` }));
    const engine = new DesignerEngineBuilder().withSchemaCreationHook(hook).build();
    const context = createSchemaCreationContext({ pageIndex: 0, totalPages: 1 });

    const output = applySchemaCreationHook(schema(), context, engine);

    expect(hook).toHaveBeenCalledTimes(1);
    expect(output.name).toBe('texto_01_hooked');
  });
});
