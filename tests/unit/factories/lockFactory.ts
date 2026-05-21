import type { CurrentUserInfo, SchemaLock } from '../../../src/sisad-pdfme/collaboration/lockManager.js';
import { DEFAULT_LOCK_TTL } from '../../../src/sisad-pdfme/collaboration/lockManager.js';
import { fixedMs, stableId } from './_shared.js';

export interface LockFactoryOptions {
  schemaUid?: string;
  ownerUserId?: string;
  ownerDisplayName?: string;
  ownerColor?: string;
  acquiredAt?: number;
  expiresAt?: number;
  heartbeatAt?: number;
  schemaType?: string;
}

export function makeCurrentUser(overrides: Partial<CurrentUserInfo> = {}): CurrentUserInfo {
  return {
    userId: overrides.userId ?? 'user-me',
    displayName: overrides.displayName ?? 'Me',
    color: overrides.color ?? '#00ff00',
  };
}

export function makeLock(overrides: LockFactoryOptions = {}): SchemaLock {
  const acquiredAt = overrides.acquiredAt ?? fixedMs();
  const ttl = overrides.schemaType === 'signature'
    ? DEFAULT_LOCK_TTL.signature
    : DEFAULT_LOCK_TTL.default;

  return {
    schemaUid: overrides.schemaUid ?? stableId('lock', overrides.schemaType ?? 'text', overrides.ownerUserId ?? 'user-me'),
    ownerUserId: overrides.ownerUserId ?? 'user-me',
    ownerDisplayName: overrides.ownerDisplayName ?? 'Me',
    ownerColor: overrides.ownerColor ?? '#00ff00',
    acquiredAt,
    expiresAt: overrides.expiresAt ?? (acquiredAt + ttl),
    heartbeatAt: overrides.heartbeatAt ?? acquiredAt,
    schemaType: overrides.schemaType,
  };
}

export function makeExpiredLock(overrides: LockFactoryOptions = {}): SchemaLock {
  const now = fixedMs();
  return makeLock({
    acquiredAt: overrides.acquiredAt ?? (now - 60_000),
    expiresAt: overrides.expiresAt ?? (now - 1),
    heartbeatAt: overrides.heartbeatAt ?? (now - 60_000),
    ...overrides,
  });
}

export function makeActiveTtlLock(overrides: LockFactoryOptions = {}): SchemaLock {
  return makeLock(overrides);
}

export function makeExpiredTtlLock(overrides: LockFactoryOptions = {}): SchemaLock {
  return makeExpiredLock(overrides);
}
