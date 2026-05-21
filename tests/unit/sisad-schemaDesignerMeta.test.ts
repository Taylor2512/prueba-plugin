/**
 * Tests for shared/schemaDesignerMeta.ts
 *
 * Covers:
 *  - createSchemaDesignerMeta: structure, UUID uniqueness, timestamps, assignment scope
 *  - createDesignerConfigV3: V3 structure, identity.schemaUid, collaboration
 *  - duplicateSchemaDesignerMeta: new UUID, reset version/timestamps, preserves rest
 *  - pasteSchemaDesignerMeta: new UUID, target page/doc, integration reset on cross-doc
 *  - GroupMeta type conformance
 */

import { describe, expect, it } from 'vitest';
import {
  createSchemaDesignerMeta,
  createDesignerConfigV3,
  duplicateSchemaDesignerMeta,
  pasteSchemaDesignerMeta,
  type SchemaDesignerMeta,
  type GroupMeta,
} from '../../src/sisad-pdfme/shared/schemaDesignerMeta.js';

// ── createSchemaDesignerMeta ──────────────────────────────────────────────────

describe('createSchemaDesignerMeta', () => {
  const base = {
    documentId: 'doc-1',
    pageNumber: 1,
    templateVersion: '2.0.0',
  };

  it('generates a schemaUid as a non-empty string', () => {
    const meta = createSchemaDesignerMeta(base);
    expect(typeof meta.schemaUid).toBe('string');
    expect(meta.schemaUid.length).toBeGreaterThan(0);
  });

  it('generates unique schemaUid on each call', () => {
    const a = createSchemaDesignerMeta(base);
    const b = createSchemaDesignerMeta(base);
    expect(a.schemaUid).not.toBe(b.schemaUid);
  });

  it('sets documentId and pageNumber from params', () => {
    const meta = createSchemaDesignerMeta({ ...base, pageNumber: 3 });
    expect(meta.documentId).toBe('doc-1');
    expect(meta.pageNumber).toBe(3);
  });

  it('sets templateVersion from params', () => {
    const meta = createSchemaDesignerMeta(base);
    expect(meta.templateVersion).toBe('2.0.0');
  });

  it('initializes version to 0', () => {
    const meta = createSchemaDesignerMeta(base);
    expect(meta.version).toBe(0);
  });

  it('sets createdAt and updatedAt as ISO strings', () => {
    const meta = createSchemaDesignerMeta(base);
    expect(meta.createdAt).toBeDefined();
    expect(meta.updatedAt).toBeDefined();
    // Should be valid ISO date
    expect(new Date(meta.createdAt!).toISOString()).toBe(meta.createdAt);
    expect(new Date(meta.updatedAt!).toISOString()).toBe(meta.updatedAt);
  });

  it('sets assignment scope to "global" when no recipientId', () => {
    const meta = createSchemaDesignerMeta(base);
    expect(meta.assignment?.scope).toBe('global');
    expect(meta.recipientId).toBeUndefined();
  });

  it('sets assignment scope to "recipient" with recipientIds when recipientId is provided', () => {
    const meta = createSchemaDesignerMeta({ ...base, recipientId: 'rec-a', recipientName: 'Alice' });
    expect(meta.assignment?.scope).toBe('recipient');
    expect(meta.assignment?.recipientIds).toEqual(['rec-a']);
    expect(meta.recipientId).toBe('rec-a');
    expect(meta.recipientName).toBe('Alice');
  });

  it('stores recipientColor when provided', () => {
    const meta = createSchemaDesignerMeta({ ...base, recipientId: 'rec-a', recipientColor: '#ff0000' });
    expect(meta.recipientColor).toBe('#ff0000');
  });
});

// ── createDesignerConfigV3 ────────────────────────────────────────────────────

describe('createDesignerConfigV3', () => {
  const base = {
    documentId: 'doc-v3',
    pageNumber: 2,
    templateVersion: '3.0.0',
  };

  it('creates a config with _v === 3', () => {
    const config = createDesignerConfigV3(base);
    expect(config._v).toBe(3);
  });

  it('identity contains schemaUid, documentId, pageNumber', () => {
    const config = createDesignerConfigV3(base);
    expect(config.identity.schemaUid).toBeDefined();
    expect(config.identity.documentId).toBe('doc-v3');
    expect(config.identity.pageNumber).toBe(2);
    expect(config.identity.templateVersion).toBe('3.0.0');
  });

  it('identity.schemaUid is unique per call', () => {
    const a = createDesignerConfigV3(base);
    const b = createDesignerConfigV3(base);
    expect(a.identity.schemaUid).not.toBe(b.identity.schemaUid);
  });

  it('collaboration has "global" scope when no recipientId', () => {
    const config = createDesignerConfigV3(base);
    expect(config.collaboration?.assignment?.scope).toBe('global');
  });

  it('collaboration has "recipient" scope with recipientId when provided', () => {
    const config = createDesignerConfigV3({ ...base, recipientId: 'r1', recipientName: 'Bob', recipientColor: '#00ff00' });
    expect(config.collaboration?.recipientId).toBe('r1');
    expect(config.collaboration?.recipientName).toBe('Bob');
    expect(config.collaboration?.recipientColor).toBe('#00ff00');
    expect(config.collaboration?.assignment?.scope).toBe('recipient');
    expect(config.collaboration?.assignment?.recipientIds).toEqual(['r1']);
  });
});

// ── duplicateSchemaDesignerMeta ───────────────────────────────────────────────

describe('duplicateSchemaDesignerMeta', () => {
  const source: SchemaDesignerMeta = {
    schemaUid: 'original-uid',
    templateVersion: '1.0.0',
    documentId: 'doc-dup',
    pageNumber: 1,
    recipientId: 'rec-x',
    recipientName: 'Xena',
    assignment: { scope: 'recipient', recipientIds: ['rec-x'] },
    version: 5,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
  };

  it('generates a NEW schemaUid different from the source', () => {
    const dup = duplicateSchemaDesignerMeta(source);
    expect(dup.schemaUid).not.toBe('original-uid');
    expect(dup.schemaUid.length).toBeGreaterThan(0);
  });

  it('resets version to 0', () => {
    const dup = duplicateSchemaDesignerMeta(source);
    expect(dup.version).toBe(0);
  });

  it('resets createdAt and updatedAt to now', () => {
    const dup = duplicateSchemaDesignerMeta(source);
    expect(dup.createdAt).not.toBe('2025-01-01T00:00:00.000Z');
    expect(dup.updatedAt).not.toBe('2025-06-01T00:00:00.000Z');
  });

  it('preserves recipientId and assignment', () => {
    const dup = duplicateSchemaDesignerMeta(source);
    expect(dup.recipientId).toBe('rec-x');
    expect(dup.recipientName).toBe('Xena');
    expect(dup.assignment).toEqual({ scope: 'recipient', recipientIds: ['rec-x'] });
  });

  it('preserves documentId and pageNumber', () => {
    const dup = duplicateSchemaDesignerMeta(source);
    expect(dup.documentId).toBe('doc-dup');
    expect(dup.pageNumber).toBe(1);
  });

  it('does not mutate the source', () => {
    duplicateSchemaDesignerMeta(source);
    expect(source.schemaUid).toBe('original-uid');
    expect(source.version).toBe(5);
  });
});

// ── pasteSchemaDesignerMeta ───────────────────────────────────────────────────

describe('pasteSchemaDesignerMeta', () => {
  const source: SchemaDesignerMeta = {
    schemaUid: 'paste-source-uid',
    templateVersion: '1.0.0',
    documentId: 'doc-source',
    pageNumber: 1,
    recipientId: 'rec-src',
    assignment: { scope: 'recipient', recipientIds: ['rec-src'] },
    integration: { provider: 'oneshot', envelopeId: 'env-123' },
    version: 3,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
  };

  it('generates a NEW schemaUid', () => {
    const pasted = pasteSchemaDesignerMeta(source, { pageNumber: 2, documentId: 'doc-source' });
    expect(pasted.schemaUid).not.toBe('paste-source-uid');
  });

  it('applies target pageNumber and documentId', () => {
    const pasted = pasteSchemaDesignerMeta(source, { pageNumber: 5, documentId: 'doc-target' });
    expect(pasted.pageNumber).toBe(5);
    expect(pasted.documentId).toBe('doc-target');
  });

  it('resets version to 0', () => {
    const pasted = pasteSchemaDesignerMeta(source, { pageNumber: 1, documentId: 'doc-source' });
    expect(pasted.version).toBe(0);
  });

  it('preserves integration when pasting within the same document', () => {
    const pasted = pasteSchemaDesignerMeta(source, { pageNumber: 2, documentId: 'doc-source' });
    expect(pasted.integration).toEqual({ provider: 'oneshot', envelopeId: 'env-123' });
  });

  it('resets integration when pasting to a DIFFERENT document', () => {
    const pasted = pasteSchemaDesignerMeta(source, { pageNumber: 1, documentId: 'doc-different' });
    expect(pasted.integration).toEqual({});
  });

  it('preserves recipient assignment', () => {
    const pasted = pasteSchemaDesignerMeta(source, { pageNumber: 1, documentId: 'doc-source' });
    expect(pasted.recipientId).toBe('rec-src');
    expect(pasted.assignment).toEqual({ scope: 'recipient', recipientIds: ['rec-src'] });
  });
});

// ── GroupMeta shape ───────────────────────────────────────────────────────────

describe('GroupMeta type shape', () => {
  it('accepts all valid groupType values', () => {
    const validTypes: GroupMeta['groupType'][] = ['visual', 'radio', 'checkbox', 'signatureBlock', 'table', 'repeatable'];
    for (const type of validTypes) {
      const group: GroupMeta = { groupId: 'grp-1', groupType: type };
      expect(group.groupType).toBe(type);
    }
  });

  it('accepts optional fields', () => {
    const group: GroupMeta = {
      groupId: 'grp-full',
      groupType: 'visual',
      groupName: 'My Group',
      parentGroupId: 'grp-parent',
      order: 2,
      lockedAsGroup: true,
    };
    expect(group.lockedAsGroup).toBe(true);
    expect(group.order).toBe(2);
  });
});
