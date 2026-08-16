import { describe, expect, it } from 'vitest';
import { createLocalModeConfig, diagnoseLocalMode } from '@sisad-pdfme/shared/localMode';
import { createLocalFormStorage } from '@sisad-pdfme/shared/localFormStorage';
import { LocalSnapshotStoreImpl } from '@sisad-pdfme/shared/localSnapshotStore';

describe('local mode public capability', () => {
  it('exposes the high-level local runtime and persistence facades', () => {
    expect(typeof createLocalModeConfig).toBe('function');
    expect(typeof diagnoseLocalMode).toBe('function');
    expect(typeof createLocalFormStorage).toBe('function');
    expect(typeof LocalSnapshotStoreImpl).toBe('function');
  });
});
