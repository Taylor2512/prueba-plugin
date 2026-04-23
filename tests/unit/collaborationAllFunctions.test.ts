import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  SHARED_ASSIGNMENTS_BUCKET,
  buildSchemaAssignments,
  buildUserRecipientAssignments,
  buildUserSchemaAssignments,
  createSchemaComment,
  createSchemaCommentAnchor,
  filterSchemasByAuthorView,
  normalizeRecipientIds,
  removeById,
  resolveSchemaAuthorId,
  schemaMatchesAuthorView,
  upsertById,
  validateCollaborativeSchemas,
} from '../../src/sisad-pdfme/common/collaboration.js';

const makeSchema = (patch: Partial<SchemaForUI> = {}): SchemaForUI =>
  ({
    id: patch.id || 'schema-1',
    schemaUid: patch.schemaUid,
    name: patch.name || 'campo',
    type: patch.type || 'text',
    position: patch.position || { x: 0, y: 0 },
    width: patch.width || 10,
    height: patch.height || 10,
    ...patch,
  }) as SchemaForUI;

describe('collaboration.ts all exported functions', () => {
  it('normalizes recipient ids from array/string and removes duplicates', () => {
    expect(normalizeRecipientIds([' user-1 ', 'user-2', 'user-1'])).toEqual(['user-1', 'user-2']);
    expect(normalizeRecipientIds(' user-1, user-2, user-1 ')).toEqual(['user-1', 'user-2']);
    expect(normalizeRecipientIds(null)).toEqual([]);
  });

  it('resolves schema author id preferring createdBy over lastModifiedBy', () => {
    expect(resolveSchemaAuthorId(makeSchema({ createdBy: 'creator', lastModifiedBy: 'editor' }))).toBe('creator');
    expect(resolveSchemaAuthorId(makeSchema({ createdBy: '   ', lastModifiedBy: 'editor' }))).toBe('editor');
    expect(resolveSchemaAuthorId(makeSchema({ createdBy: '', lastModifiedBy: '' }))).toBe('');
  });

  it('matches author view by owner/author/shared/global rules', () => {
    const shared = makeSchema({ ownerMode: 'shared', createdBy: 'a', ownerRecipientId: 'x' });
    const owner = makeSchema({ createdBy: 'a', ownerRecipientId: 'owner-1' });

    expect(schemaMatchesAuthorView(shared, { activeUserId: 'unknown', isGlobalView: false })).toBe(true);
    expect(schemaMatchesAuthorView(owner, { activeUserId: 'owner-1', isGlobalView: false })).toBe(true);
    expect(schemaMatchesAuthorView(owner, { activeUserId: 'a', isGlobalView: false })).toBe(true);
    expect(schemaMatchesAuthorView(owner, { activeUserId: 'other', isGlobalView: false })).toBe(false);
    expect(schemaMatchesAuthorView(owner, { activeUserId: 'other', isGlobalView: true })).toBe(true);
  });

  it('filters schemas with author view helper', () => {
    const schemas = [
      makeSchema({ id: '1', createdBy: 'a' }),
      makeSchema({ id: '2', createdBy: 'b' }),
    ];
    const filtered = filterSchemasByAuthorView(schemas, { activeUserId: 'a', isGlobalView: false });
    expect(filtered.map((s) => s.id)).toEqual(['1']);
  });

  it('creates comments and anchors with normalized ids and metadata', () => {
    const comment = createSchemaComment(' Hola ', { authorId: 'u1', timestamp: 10 }, { schemaUid: 'su-1' });
    const anchor = createSchemaCommentAnchor({ schemaUid: 'su-1', pageNumber: 1, x: 1, y: 2 }, { authorId: 'u1' });

    expect(comment.text).toBe('Hola');
    expect(comment.schemaUid).toBe('su-1');
    expect(comment.fieldId).toBe('su-1');
    expect(comment.createdAt).toBe(10);
    expect(comment.replies).toEqual([]);
    expect(anchor.schemaUid).toBe('su-1');
    expect(anchor.fieldId).toBe('su-1');
    expect(anchor.pageNumber).toBe(1);
  });

  it('upserts and removes entities by id', () => {
    const items = [{ id: 'a', value: 1 }, { id: 'b', value: 2 }];
    expect(upsertById(items, { id: 'c', value: 3 })).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
      { id: 'c', value: 3 },
    ]);
    expect(upsertById(items, { id: 'b', value: 20 })).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 20 },
    ]);
    expect(removeById(items, 'a')).toEqual([{ id: 'b', value: 2 }]);
  });

  it('builds schema assignments by recipient and by author', () => {
    const schemas = [
      [
        makeSchema({ schemaUid: 's1', ownerRecipientId: 'r1', createdBy: 'u1', fileId: 'f1', pageNumber: 1 }),
        makeSchema({ schemaUid: 's2', ownerRecipientId: 'r1', createdBy: 'u2', fileId: 'f1', pageNumber: 1 }),
      ],
    ];

    const byRecipient = buildSchemaAssignments(schemas);
    expect(byRecipient.r1.f1['1']).toEqual(['s1', 's2']);

    const byAuthor = buildUserSchemaAssignments(schemas);
    expect(byAuthor.u1.f1['1']).toEqual(['s1']);
    expect(byAuthor.u2.f1['1']).toEqual(['s2']);
  });

  it('builds user-recipient assignments with options and shared toggle', () => {
    const schemas = [
      [
        makeSchema({
          schemaUid: 's-shared',
          ownerMode: 'shared',
          ownerRecipientIds: ['r1', 'r2'],
          createdBy: 'u1',
          fileId: 'f1',
          pageNumber: 1,
        }),
        makeSchema({
          schemaUid: 's-unassigned',
          createdBy: '',
          ownerRecipientId: '',
          fileId: 'f1',
          pageNumber: 1,
        }),
      ],
    ];

    const withShared = buildUserRecipientAssignments(schemas);
    expect(withShared.u1[SHARED_ASSIGNMENTS_BUCKET].f1['1']).toContain('s-shared');

    const withoutShared = buildUserRecipientAssignments(schemas, { includeSharedRecipientBucket: false });
    expect(withoutShared.u1[SHARED_ASSIGNMENTS_BUCKET]).toBeUndefined();

    const customKeys = buildUserRecipientAssignments(schemas, {
      unassignedUserKey: 'sin-autor',
      unassignedRecipientKey: 'sin-destinatario',
    });
    expect(customKeys['sin-autor']['sin-destinatario'].f1['1']).toContain('s-unassigned');
  });

  it('validates collaborative schemas requiring createdBy and userColor', () => {
    const schemas = [
      [
        makeSchema({ schemaUid: 'ok', createdBy: 'u1', userColor: '#111111' }),
        makeSchema({ schemaUid: 'missing-createdBy', userColor: '#111111', createdBy: '' }),
        makeSchema({ schemaUid: 'missing-userColor', createdBy: 'u2', userColor: '' }),
      ],
    ];

    const result = validateCollaborativeSchemas(schemas);

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual([
      { schemaUid: 'missing-createdBy', reason: 'missing-createdBy' },
      { schemaUid: 'missing-userColor', reason: 'missing-userColor' },
    ]);
  });
});
