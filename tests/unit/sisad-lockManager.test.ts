/**
 * Tests for collaboration/lockManager.ts
 *
 * Covers:
 *  - acquire: success, owned re-acquire, blocked by other
 *  - release: own lock, no-op for other's lock
 *  - releaseAll: releases all owned locks
 *  - heartbeat: renews TTL
 *  - isLockedByOther: correct for own, other, expired, absent
 *  - getLock: returns lock or null for expired/absent
 *  - purgeExpired: removes expired locks
 *  - applyRemoteLock / removeRemoteLock
 *  - subscribe: notifies on acquire/release
 *  - TTL differentiation: signature vs default
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  LockManager,
  DEFAULT_LOCK_TTL,
  type CurrentUserInfo,
  type SchemaLock,
} from '../../src/sisad-pdfme/collaboration/lockManager.js';

const me: CurrentUserInfo = { userId: 'user-me', displayName: 'Me', color: '#00ff00' };
describe('LockManager', () => {
  let manager: LockManager;

  beforeEach(() => {
    manager = new LockManager(me, DEFAULT_LOCK_TTL);
  });

  // ── acquire ─────────────────────────────────────────────────────────

  describe('acquire', () => {
    it('acquires a lock successfully', async () => {
      const result = await manager.acquire('s1');
      expect(result.acquired).toBe(true);
      if (result.acquired) {
        expect(result.lock.schemaUid).toBe('s1');
        expect(result.lock.ownerUserId).toBe('user-me');
      }
    });

    it('re-acquires own lock (renews)', async () => {
      await manager.acquire('s1');
      const result = await manager.acquire('s1');
      expect(result.acquired).toBe(true);
    });

    it('fails to acquire lock held by another user', async () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 30_000,
        heartbeatAt: Date.now(),
      });

      const result = await manager.acquire('s1');
      expect(result.acquired).toBe(false);
      if (!result.acquired) {
        expect(result.existingLock.ownerUserId).toBe('user-other');
      }
    });

    it('acquires lock after other user lock expires', async () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now() - 60_000,
        expiresAt: Date.now() - 1, // expired
        heartbeatAt: Date.now() - 60_000,
      });

      const result = await manager.acquire('s1');
      expect(result.acquired).toBe(true);
    });

    it('uses signature TTL for signature schemas', async () => {
      const result = await manager.acquire('sig-1', 'signature');
      expect(result.acquired).toBe(true);
      if (result.acquired) {
        // Signature TTL is 15s
        expect(result.lock.expiresAt - result.lock.acquiredAt).toBe(DEFAULT_LOCK_TTL.signature);
      }
    });

    it('uses default TTL for non-signature schemas', async () => {
      const result = await manager.acquire('text-1', 'text');
      expect(result.acquired).toBe(true);
      if (result.acquired) {
        expect(result.lock.expiresAt - result.lock.acquiredAt).toBe(DEFAULT_LOCK_TTL.default);
      }
    });
  });

  // ── release ─────────────────────────────────────────────────────────

  describe('release', () => {
    it('releases own lock', async () => {
      await manager.acquire('s1');
      expect(manager.getLock('s1')).not.toBeNull();
      await manager.release('s1');
      expect(manager.getLock('s1')).toBeNull();
    });

    it('does nothing for lock owned by another', async () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 30_000,
        heartbeatAt: Date.now(),
      });

      await manager.release('s1');
      expect(manager.getLock('s1')).not.toBeNull();
    });

    it('does nothing for non-existent lock', async () => {
      await manager.release('nonexistent'); // should not throw
    });
  });

  // ── releaseAll ──────────────────────────────────────────────────────

  describe('releaseAll', () => {
    it('releases all locks owned by current user', async () => {
      await manager.acquire('s1');
      await manager.acquire('s2');
      await manager.acquire('s3');
      expect(manager._getAllLocksForTest().size).toBe(3);

      await manager.releaseAll();
      expect(manager._getAllLocksForTest().size).toBe(0);
    });

    it('does not release locks owned by other users', async () => {
      await manager.acquire('s1');
      manager._injectLockForTest({
        schemaUid: 's-other',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 30_000,
        heartbeatAt: Date.now(),
      });

      await manager.releaseAll();
      expect(manager._getAllLocksForTest().size).toBe(1);
      expect(manager.getLock('s-other')).not.toBeNull();
    });
  });

  // ── isLockedByOther ─────────────────────────────────────────────────

  describe('isLockedByOther', () => {
    it('returns false for unlocked schema', () => {
      expect(manager.isLockedByOther('s1')).toBe(false);
    });

    it('returns false for own lock', async () => {
      await manager.acquire('s1');
      expect(manager.isLockedByOther('s1')).toBe(false);
    });

    it('returns true for lock by another user', () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 30_000,
        heartbeatAt: Date.now(),
      });
      expect(manager.isLockedByOther('s1')).toBe(true);
    });

    it('returns false for expired lock by another user', () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now() - 60_000,
        expiresAt: Date.now() - 1,
        heartbeatAt: Date.now() - 60_000,
      });
      expect(manager.isLockedByOther('s1')).toBe(false);
    });
  });

  // ── getLock ──────────────────────────────────────────────────────────

  describe('getLock', () => {
    it('returns null for absent lock', () => {
      expect(manager.getLock('nope')).toBeNull();
    });

    it('returns the lock when present and not expired', async () => {
      await manager.acquire('s1');
      const lock = manager.getLock('s1');
      expect(lock).not.toBeNull();
      expect(lock!.schemaUid).toBe('s1');
    });

    it('returns null and cleans up expired lock', () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-me',
        ownerDisplayName: 'Me',
        ownerColor: '#00ff00',
        acquiredAt: Date.now() - 60_000,
        expiresAt: Date.now() - 1,
        heartbeatAt: Date.now() - 60_000,
      });
      expect(manager.getLock('s1')).toBeNull();
    });
  });

  // ── heartbeat ───────────────────────────────────────────────────────

  describe('heartbeat', () => {
    it('renews TTL on own lock', async () => {
      const result = await manager.acquire('s1');
      if (!result.acquired) throw new Error('should acquire');
      const originalExpires = result.lock.expiresAt;

      // Small delay to ensure time advances
      await new Promise((r) => setTimeout(r, 5));
      await manager.heartbeat('s1');

      const renewed = manager.getLock('s1');
      expect(renewed!.expiresAt).toBeGreaterThan(originalExpires);
    });

    it('no-op if lock is owned by another', async () => {
      manager._injectLockForTest({
        schemaUid: 's1',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 30_000,
        heartbeatAt: Date.now(),
      });

      const before = manager.getLock('s1')!.expiresAt;
      await manager.heartbeat('s1');
      expect(manager.getLock('s1')!.expiresAt).toBe(before);
    });
  });

  // ── purgeExpired ────────────────────────────────────────────────────

  describe('purgeExpired', () => {
    it('removes all expired locks', () => {
      manager._injectLockForTest({
        schemaUid: 's-expired',
        ownerUserId: 'user-other',
        ownerDisplayName: 'Other',
        ownerColor: '#ff0000',
        acquiredAt: Date.now() - 60_000,
        expiresAt: Date.now() - 1,
        heartbeatAt: Date.now() - 60_000,
      });

      expect(manager._getAllLocksForTest().size).toBe(1);
      manager.purgeExpired();
      expect(manager._getAllLocksForTest().size).toBe(0);
    });
  });

  // ── Remote locks ────────────────────────────────────────────────────

  describe('applyRemoteLock / removeRemoteLock', () => {
    const remoteLock: SchemaLock = {
      schemaUid: 's-remote',
      ownerUserId: 'user-other',
      ownerDisplayName: 'Other',
      ownerColor: '#ff0000',
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    };

    it('applies a remote lock', () => {
      manager.applyRemoteLock(remoteLock);
      expect(manager.getLock('s-remote')).not.toBeNull();
      expect(manager.isLockedByOther('s-remote')).toBe(true);
    });

    it('removes a remote lock', () => {
      manager.applyRemoteLock(remoteLock);
      manager.removeRemoteLock('s-remote');
      expect(manager.getLock('s-remote')).toBeNull();
    });

    it('removeRemoteLock does not remove own lock', async () => {
      await manager.acquire('s1');
      manager.removeRemoteLock('s1');
      expect(manager.getLock('s1')).not.toBeNull();
    });
  });

  // ── subscribe ───────────────────────────────────────────────────────

  describe('subscribe', () => {
    it('notifies on acquire', async () => {
      const cb = vi.fn();
      manager.subscribe('s1', cb);
      await manager.acquire('s1');
      expect(cb).toHaveBeenCalledOnce();
      expect(cb.mock.calls[0][0]).toMatchObject({ schemaUid: 's1' });
    });

    it('notifies on release with null', async () => {
      const cb = vi.fn();
      manager.subscribe('s1', cb);
      await manager.acquire('s1');
      await manager.release('s1');
      expect(cb).toHaveBeenCalledTimes(2);
      expect(cb.mock.calls[1][0]).toBeNull();
    });

    it('unsubscribe stops notifications', async () => {
      const cb = vi.fn();
      const unsub = manager.subscribe('s1', cb);
      unsub();
      await manager.acquire('s1');
      expect(cb).not.toHaveBeenCalled();
    });
  });

  // ── onLockChange callback ───────────────────────────────────────────

  describe('onLockChange callback', () => {
    it('fires on acquire and release', async () => {
      const onChange = vi.fn();
      const mgr = new LockManager(me, DEFAULT_LOCK_TTL, onChange);
      await mgr.acquire('s1');
      expect(onChange).toHaveBeenCalledWith('s1', expect.objectContaining({ schemaUid: 's1' }));

      await mgr.release('s1');
      expect(onChange).toHaveBeenCalledWith('s1', null);
    });
  });
});
