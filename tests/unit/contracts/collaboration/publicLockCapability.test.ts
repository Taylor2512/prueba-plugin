import { describe, expect, it } from 'vitest';
import { LockManager, DEFAULT_LOCK_TTL } from '@sisad-pdfme/collaboration/lockManager';
import { createSchemaLockGuard } from '@sisad-pdfme/collaboration/schemaLockGuard';

describe('collaboration lock capability', () => {
  it('exposes lock lifecycle and command guard contracts', () => {
    expect(typeof LockManager).toBe('function');
    expect(DEFAULT_LOCK_TTL.signature).toBeLessThan(DEFAULT_LOCK_TTL.default);
    expect(typeof createSchemaLockGuard).toBe('function');
  });
});
