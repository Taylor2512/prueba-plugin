/**
 * FASE 10 — Tests: Sistema de locks
 * Cubre LockManager: acquire, release, heartbeat, TTL, purgeExpired.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createLockManager,
  type LockManager,
  type SchemaLock,
} from '../../src/sisad-pdfme/collaboration/lockManager.js';

const USER_A = { userId: 'user-A', displayName: 'Alice', color: '#3B82F6' };
const USER_B = { userId: 'user-B', displayName: 'Bob', color: '#EF4444' };

let lmA: LockManager;
let lmB: LockManager;

beforeEach(() => {
  vi.useFakeTimers();
  lmA = createLockManager(USER_A, { ttlConfig: { default: 30_000, signature: 15_000, heartbeatInterval: 10_000 } });
  lmB = createLockManager(USER_B);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('acquire', () => {
  it('adquiere lock correctamente cuando está libre', async () => {
    const result = await lmA.acquire('schema-1');
    expect(result.acquired).toBe(true);
    if (result.acquired) {
      expect(result.lock.ownerUserId).toBe(USER_A.userId);
      expect(result.lock.schemaUid).toBe('schema-1');
    }
  });

  it('falla si otro usuario ya tiene el lock', async () => {
    await lmA.acquire('schema-1');
    const resultB = createLockManager(USER_B);

    // Simular lock de otro usuario mediante _injectLockForTest
    const managerB = createLockManager(USER_B);
    const fakeLock: SchemaLock = {
      schemaUid: 'schema-2',
      ownerUserId: USER_A.userId,
      ownerDisplayName: USER_A.displayName,
      ownerColor: USER_A.color,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    };
    managerB._injectLockForTest(fakeLock);
    const result = await managerB.acquire('schema-2');
    expect(result.acquired).toBe(false);
    if (!result.acquired) {
      expect(result.existingLock.ownerUserId).toBe(USER_A.userId);
    }
  });
});

describe('release', () => {
  it('libera el lock del usuario actual', async () => {
    await lmA.acquire('schema-1');
    expect(lmA.getLock('schema-1')).not.toBeNull();
    await lmA.release('schema-1');
    expect(lmA.getLock('schema-1')).toBeNull();
  });

  it('no libera el lock de otro usuario', async () => {
    const fakeLock: SchemaLock = {
      schemaUid: 'schema-9',
      ownerUserId: USER_B.userId,
      ownerDisplayName: USER_B.displayName,
      ownerColor: USER_B.color,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    };
    lmA._injectLockForTest(fakeLock);
    await lmA.release('schema-9'); // user-A intenta liberar lock de user-B
    // El lock debe seguir ahí
    const lock = lmA._getAllLocksForTest().get('schema-9');
    expect(lock?.ownerUserId).toBe(USER_B.userId);
  });
});

describe('releaseAll', () => {
  it('libera todos los locks del usuario actual', async () => {
    await lmA.acquire('schema-1');
    await lmA.acquire('schema-2');
    await lmA.releaseAll();
    expect(lmA.getLock('schema-1')).toBeNull();
    expect(lmA.getLock('schema-2')).toBeNull();
  });
});

describe('TTL y heartbeat', () => {
  it('lock expira después del TTL sin heartbeat', async () => {
    await lmA.acquire('schema-1');
    expect(lmA.getLock('schema-1')).not.toBeNull();

    vi.advanceTimersByTime(31_000); // > 30s default TTL
    lmA.purgeExpired();

    expect(lmA.getLock('schema-1')).toBeNull();
  });

  it('heartbeat renueva el TTL', async () => {
    await lmA.acquire('schema-1');
    vi.advanceTimersByTime(25_000); // 25s — cerca de expirar
    await lmA.heartbeat('schema-1');
    vi.advanceTimersByTime(10_000); // total: 35s pero heartbeat renovó
    lmA.purgeExpired();
    // Después del heartbeat, el TTL se reinició desde el momento del heartbeat
    expect(lmA.getLock('schema-1')).not.toBeNull();
  });

  it('lock de firma (signature) expira en 15s', async () => {
    await lmA.acquire('schema-sig', 'signature');
    vi.advanceTimersByTime(16_000); // > 15s
    lmA.purgeExpired();
    expect(lmA.getLock('schema-sig')).toBeNull();
  });

  it('lock de firma sobrevive menos de 15s con heartbeat', async () => {
    await lmA.acquire('schema-sig', 'signature');
    vi.advanceTimersByTime(10_000);
    await lmA.heartbeat('schema-sig');
    vi.advanceTimersByTime(10_000);
    lmA.purgeExpired();
    expect(lmA.getLock('schema-sig')).not.toBeNull();
  });
});

describe('isLockedByOther', () => {
  it('retorna true cuando hay lock de otro usuario activo', () => {
    const fakeLock: SchemaLock = {
      schemaUid: 'schema-x',
      ownerUserId: USER_B.userId,
      ownerDisplayName: USER_B.displayName,
      ownerColor: USER_B.color,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + 30_000,
      heartbeatAt: Date.now(),
    };
    lmA._injectLockForTest(fakeLock);
    expect(lmA.isLockedByOther('schema-x')).toBe(true);
  });

  it('retorna false para lock propio', async () => {
    await lmA.acquire('schema-mine');
    expect(lmA.isLockedByOther('schema-mine')).toBe(false);
  });

  it('retorna false para lock expirado de otro usuario', () => {
    const expiredLock: SchemaLock = {
      schemaUid: 'schema-exp',
      ownerUserId: USER_B.userId,
      ownerDisplayName: USER_B.displayName,
      ownerColor: USER_B.color,
      acquiredAt: Date.now() - 40_000,
      expiresAt: Date.now() - 10_000, // ya expiró
      heartbeatAt: Date.now() - 40_000,
    };
    lmA._injectLockForTest(expiredLock);
    expect(lmA.isLockedByOther('schema-exp')).toBe(false);
  });
});

describe('purgeExpired', () => {
  it('limpia locks huérfanos expirados', () => {
    const staleLock: SchemaLock = {
      schemaUid: 'schema-ghost',
      ownerUserId: 'ghost-user',
      ownerDisplayName: 'Ghost',
      ownerColor: '#000',
      acquiredAt: Date.now() - 60_000,
      expiresAt: Date.now() - 30_000,
      heartbeatAt: Date.now() - 60_000,
    };
    lmA._injectLockForTest(staleLock);
    expect(lmA._getAllLocksForTest().has('schema-ghost')).toBe(true);
    lmA.purgeExpired();
    expect(lmA._getAllLocksForTest().has('schema-ghost')).toBe(false);
  });
});

describe('subscribe', () => {
  it('notifica al suscriptor cuando se adquiere un lock', async () => {
    let received: SchemaLock | null = null;
    lmA.subscribe('schema-watch', (lock) => { received = lock; });
    await lmA.acquire('schema-watch');
    expect(received).not.toBeNull();
    expect(received!.ownerUserId).toBe(USER_A.userId);
  });

  it('notifica con null al liberar', async () => {
    let received: SchemaLock | null = { schemaUid: 'placeholder' } as SchemaLock;
    lmA.subscribe('schema-watch2', (lock) => { received = lock; });
    await lmA.acquire('schema-watch2');
    await lmA.release('schema-watch2');
    expect(received).toBeNull();
  });
});
