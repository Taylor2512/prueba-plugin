import { expect } from 'vitest';
import { snapshotAdapter, type DesignerState } from '../../../src/sisad-pdfme/shared/snapshotAdapter.js';
import type { OfficialTemplateSnapshot } from '../../../src/sisad-pdfme/shared/snapshot.js';

export function expectSnapshotRoundTrip(
  state: DesignerState,
  metadata: OfficialTemplateSnapshot['metadata'],
): OfficialTemplateSnapshot {
  const snapshot = snapshotAdapter.serialize(state, metadata);
  const restored = snapshotAdapter.deserialize(snapshot);
  const snapshot2 = snapshotAdapter.serialize(restored, metadata);

  expect(snapshot2.documents).toEqual(snapshot.documents);
  expect(snapshot2.recipients).toEqual(snapshot.recipients);
  expect(snapshot2.assignments).toEqual(snapshot.assignments);
  expect(snapshot2.signatureConfig).toEqual(snapshot.signatureConfig);
  expect(snapshot2.providerConfig).toEqual(snapshot.providerConfig);
  expect(snapshot2.comments).toEqual(snapshot.comments);

  return snapshot;
}

export function expectSnapshotValid(snapshot: OfficialTemplateSnapshot) {
  const result = snapshotAdapter.validate(snapshot);
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
}
