import { describe, expect, test } from 'vitest';
import { createRecipientRegistry } from '@/sisad-pdfme/recipients/recipientRegistry.js';
import {
  buildAssignmentContextFromRegistry,
  buildCollaborationSyncFromRegistry,
  resolveOwnerRecipientId,
  resolveSchemaOwnerAppearance,
} from '@/sisad-pdfme/recipients/recipientResolver.js';
import { createRecipientPermissionResolver } from '@/sisad-pdfme/recipients/recipientPermissionResolver.js';

const makeRegistry = () =>
  createRecipientRegistry({
    recipients: [
      { id: 'client', label: 'Cliente Principal', color: '#2563EB' },
      { id: 'guarantor', label: 'Avalista', color: '#DC2626' },
      { id: 'off', label: 'Inactivo', color: '#CA8A04', disabled: true },
    ],
    activeRecipientId: 'client',
  });

describe('resolveOwnerRecipientId', () => {
  test('prioriza ownerRecipientId, luego lista, luego recipientId', () => {
    expect(resolveOwnerRecipientId({ ownerRecipientId: 'a', recipientId: 'b' })).toBe('a');
    expect(resolveOwnerRecipientId({ ownerRecipientIds: ['x', 'y'] })).toBe('x');
    expect(resolveOwnerRecipientId({ recipientId: 'z' })).toBe('z');
    expect(resolveOwnerRecipientId({})).toBeNull();
  });
});

describe('resolveSchemaOwnerAppearance', () => {
  test('resuelve owner del registry con label y color únicos', () => {
    const registry = makeRegistry();
    const appearance = resolveSchemaOwnerAppearance(
      { ownerRecipientId: 'guarantor' },
      registry,
    );

    expect(appearance.ownerRecipientId).toBe('guarantor');
    expect(appearance.ownerLabel).toBe('Avalista');
    expect(appearance.ownerColor).toBe('#DC2626');
    expect(appearance.isOwnedByActiveRecipient).toBe(false);
    expect(appearance.isShared).toBe(false);
    expect(appearance.isUnassigned).toBe(false);
  });

  test('el color explícito del schema gana sobre el color del recipient', () => {
    const registry = makeRegistry();
    const appearance = resolveSchemaOwnerAppearance(
      { ownerRecipientId: 'guarantor', ownerColor: '#000000' },
      registry,
    );
    expect(appearance.ownerColor).toBe('#000000');
  });

  test('marca ownership del recipient activo (id directo o en lista)', () => {
    const registry = makeRegistry();
    expect(
      resolveSchemaOwnerAppearance({ ownerRecipientId: 'client' }, registry)
        .isOwnedByActiveRecipient,
    ).toBe(true);
    expect(
      resolveSchemaOwnerAppearance({ ownerRecipientIds: ['guarantor', 'client'] }, registry)
        .isOwnedByActiveRecipient,
    ).toBe(true);
  });

  test('detecta shared y unassigned', () => {
    const registry = makeRegistry();
    expect(resolveSchemaOwnerAppearance({ ownerMode: 'shared' }, registry).isShared).toBe(true);
    const unassigned = resolveSchemaOwnerAppearance({}, registry);
    expect(unassigned.isUnassigned).toBe(true);
    expect(unassigned.ownerRecipientId).toBeNull();
  });

  test('owner desconocido conserva id y usa el nombre embebido del schema', () => {
    const registry = makeRegistry();
    const appearance = resolveSchemaOwnerAppearance(
      { ownerRecipientId: 'ghost', ownerRecipientName: 'Externo' },
      registry,
    );
    expect(appearance.ownerRecipientId).toBe('ghost');
    expect(appearance.ownerLabel).toBe('Externo');
  });
});

describe('buildCollaborationSyncFromRegistry', () => {
  test('deriva recipientOptions/users/activeRecipientId de la misma fuente', () => {
    const registry = makeRegistry();
    const sync = buildCollaborationSyncFromRegistry(registry, {
      base: { url: 'ws://collab', actorId: 'legacy-actor' },
      enabled: true,
    });

    expect(sync.enabled).toBe(true);
    expect(sync.url).toBe('ws://collab');
    expect(sync.activeRecipientId).toBe('client');
    expect(sync.actorId).toBe('client');
    expect(sync.actorColor).toBe('#2563EB');
    expect(sync.recipientOptions).toEqual(sync.users);
    expect(sync.recipientOptions).toEqual([
      { id: 'client', name: 'Cliente Principal', color: '#2563EB', role: null },
      { id: 'guarantor', name: 'Avalista', color: '#DC2626', role: null },
      { id: 'off', name: 'Inactivo', color: '#CA8A04', role: null },
    ]);
  });

  test('sin activo, conserva el actorId del base', () => {
    const registry = createRecipientRegistry({
      recipients: [{ id: 'a', label: 'A' }],
      config: { defaultOwnerStrategy: 'none' },
    });
    const sync = buildCollaborationSyncFromRegistry(registry, {
      base: { actorId: 'legacy-actor' },
    });
    expect(sync.activeRecipientId).toBeNull();
    expect(sync.actorId).toBe('legacy-actor');
  });
});

describe('buildAssignmentContextFromRegistry', () => {
  test('lista solo recipients asignables y expone el activo', () => {
    const registry = makeRegistry();
    const context = buildAssignmentContextFromRegistry(registry);

    expect(context.recipients.map((r) => r.id)).toEqual(['client', 'guarantor']);
    expect(context.activeRecipientId).toBe('client');
    expect(context.canReassign).toBe(true);
  });

  test('sin recipients asignables no permite reasignar', () => {
    const registry = createRecipientRegistry({
      recipients: [{ id: 'off', label: 'Inactivo', disabled: true }],
    });
    expect(buildAssignmentContextFromRegistry(registry).canReassign).toBe(false);
  });
});

describe('createRecipientPermissionResolver', () => {
  test('roles de lectura no editan estructura ni reasignan', () => {
    const permissions = createRecipientPermissionResolver();
    const viewer = { id: 'v', label: 'Viewer', role: 'viewer' };
    const editor = { id: 'e', label: 'Editor' };

    expect(permissions.canEditStructure(viewer)).toBe(false);
    expect(permissions.canEditStructure(editor)).toBe(true);
    expect(permissions.canAssign({}, viewer)).toBe(false);
    expect(permissions.canAssign({}, editor)).toBe(true);
  });

  test('el override explícito del host gana sobre la regla por rol', () => {
    const permissions = createRecipientPermissionResolver({ canEditStructure: false });
    expect(permissions.canEditStructure({ id: 'e', label: 'Editor' })).toBe(false);
  });

  test('un schema bloqueado no se reasigna', () => {
    const permissions = createRecipientPermissionResolver();
    expect(permissions.canAssign({ locked: true }, { id: 'e', label: 'Editor' })).toBe(false);
  });

  test('allowUnassigned/allowShared de config gobiernan unassign/share', () => {
    const permissions = createRecipientPermissionResolver({
      config: { allowUnassigned: false, allowShared: false },
    });
    const editor = { id: 'e', label: 'Editor' };
    expect(permissions.canUnassign(editor)).toBe(false);
    expect(permissions.canShare(editor)).toBe(false);
  });
});
