/**
 * Tests for collaboration/schemaLockGuard.ts
 *
 * Covers:
 *  - Passthrough commands are never blocked
 *  - Commands with no schema UIDs are not blocked
 *  - Commands targeting unlocked schemas are allowed
 *  - Commands targeting schemas locked by other users are blocked
 *  - onBlocked callback is invoked with correct arguments
 *  - Additional passthrough IDs are respected
 *  - Mixed locks: at least one locked → block
 *  - Integration with LockManager
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createSchemaLockGuard, type SchemaUidResolver } from '../../src/sisad-pdfme/collaboration/schemaLockGuard.js';
import { LockManager, DEFAULT_LOCK_TTL, type CurrentUserInfo } from '../../src/sisad-pdfme/collaboration/lockManager.js';
import type { Command } from '../../src/sisad-pdfme/contracts/commands.js';

const makeCommand = (id: string, schemaUids: string[] = []): Command & { _schemaUids: string[] } => ({
  id,
  label: id,
  execute: vi.fn(),
  undo: vi.fn(),
  _schemaUids: schemaUids,
});

const currentUser: CurrentUserInfo = { userId: 'user-me', displayName: 'Me', color: '#00ff00' };
const otherUser: CurrentUserInfo = { userId: 'user-other', displayName: 'Other', color: '#ff0000' };

const resolver: SchemaUidResolver = (cmd) => {
  return (cmd as ReturnType<typeof makeCommand>)._schemaUids || [];
};

describe('createSchemaLockGuard', () => {
  let lockManager: LockManager;

  beforeEach(() => {
    lockManager = new LockManager(currentUser, DEFAULT_LOCK_TTL);
  });

  // ── Passthrough ─────────────────────────────────────────────────────

  it('allows passthrough commands regardless of locks', () => {
    const otherLockManager = new LockManager(otherUser, DEFAULT_LOCK_TTL);
    // Inject a lock from another user
    otherLockManager._injectLockForTest({
      schemaUid: 'schema-1',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    // But using currentUser's lock manager where that schema appears locked by other
    lockManager._injectLockForTest({
      schemaUid: 'schema-1',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    const guard = createSchemaLockGuard(lockManager, resolver);

    const passthroughIds = ['selectSchema', 'selectAll', 'zoomIn', 'zoomOut', 'openProperties'];
    for (const id of passthroughIds) {
      const cmd = makeCommand(id, ['schema-1']);
      expect(guard(cmd), `${id} should pass through`).toBe(true);
    }
  });

  // ── No schemas ──────────────────────────────────────────────────────

  it('allows commands with no targeted schemas', () => {
    const guard = createSchemaLockGuard(lockManager, resolver);
    const cmd = makeCommand('deleteField', []);
    expect(guard(cmd)).toBe(true);
  });

  // ── Unlocked schemas ────────────────────────────────────────────────

  it('allows commands when targeted schemas are not locked', () => {
    const guard = createSchemaLockGuard(lockManager, resolver);
    const cmd = makeCommand('deleteField', ['schema-1', 'schema-2']);
    expect(guard(cmd)).toBe(true);
  });

  it('allows commands when targeted schemas are locked by current user', async () => {
    await lockManager.acquire('schema-1');
    const guard = createSchemaLockGuard(lockManager, resolver);
    const cmd = makeCommand('deleteField', ['schema-1']);
    expect(guard(cmd)).toBe(true);
  });

  // ── Locked by other ─────────────────────────────────────────────────

  it('blocks commands when targeted schema is locked by another user', () => {
    lockManager._injectLockForTest({
      schemaUid: 'schema-locked',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    const guard = createSchemaLockGuard(lockManager, resolver);
    const cmd = makeCommand('deleteField', ['schema-locked']);
    expect(guard(cmd)).toBe(false);
  });

  it('blocks when at least one schema in the set is locked by another', () => {
    lockManager._injectLockForTest({
      schemaUid: 'schema-2',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    const guard = createSchemaLockGuard(lockManager, resolver);
    const cmd = makeCommand('moveField', ['schema-1', 'schema-2']);
    expect(guard(cmd)).toBe(false);
  });

  // ── Expired locks ───────────────────────────────────────────────────

  it('allows commands when lock has expired', () => {
    lockManager._injectLockForTest({
      schemaUid: 'schema-expired',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now() - 60_000,
      expiresAt: Date.now() - 1, // already expired
      heartbeatAt: Date.now() - 60_000,
    });

    const guard = createSchemaLockGuard(lockManager, resolver);
    const cmd = makeCommand('deleteField', ['schema-expired']);
    expect(guard(cmd)).toBe(true);
  });

  // ── onBlocked callback ──────────────────────────────────────────────

  it('invokes onBlocked callback with command and locked UIDs', () => {
    lockManager._injectLockForTest({
      schemaUid: 'schema-blocked',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    const onBlocked = vi.fn();
    const guard = createSchemaLockGuard(lockManager, resolver, { onBlocked });
    const cmd = makeCommand('deleteField', ['schema-blocked']);
    guard(cmd);

    expect(onBlocked).toHaveBeenCalledOnce();
    expect(onBlocked).toHaveBeenCalledWith(cmd, ['schema-blocked']);
  });

  it('does NOT invoke onBlocked when command is allowed', () => {
    const onBlocked = vi.fn();
    const guard = createSchemaLockGuard(lockManager, resolver, { onBlocked });
    const cmd = makeCommand('deleteField', ['schema-free']);
    guard(cmd);
    expect(onBlocked).not.toHaveBeenCalled();
  });

  // ── Additional passthrough IDs ──────────────────────────────────────

  it('respects additionalPassthroughIds', () => {
    lockManager._injectLockForTest({
      schemaUid: 'schema-locked',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    const guard = createSchemaLockGuard(lockManager, resolver, {
      additionalPassthroughIds: ['myCustomReadOnlyCommand'],
    });
    const cmd = makeCommand('myCustomReadOnlyCommand', ['schema-locked']);
    expect(guard(cmd)).toBe(true);
  });

  // ── Integration with CommandBus ─────────────────────────────────────

  it('works as a CommandBus guard (integration)', async () => {
    // Import CommandBus dynamically to keep this test lightweight
    const { CommandBus } = await import('../../src/sisad-pdfme/ui/commands/commandBus.js');
    const bus = new CommandBus();

    lockManager._injectLockForTest({
      schemaUid: 'schema-guarded',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    });

    bus.addGuard(createSchemaLockGuard(lockManager, resolver));

    const exec = vi.fn();
    await bus.execute(makeCommand('deleteField', ['schema-guarded']) as unknown as Command & { execute: typeof exec; undo: typeof vi.fn });
    expect(exec).not.toHaveBeenCalled();
  });
});
