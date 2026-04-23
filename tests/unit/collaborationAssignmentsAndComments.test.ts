import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  SHARED_ASSIGNMENTS_BUCKET,
  buildUserRecipientAssignments,
  createSchemaComment,
  createSchemaCommentAnchor,
  filterSchemasByAuthorView,
} from '../../src/sisad-pdfme/common/collaboration.js';

describe('collaboration assignments and comments', () => {
  it('builds assignments with user -> recipient -> file -> page shape', () => {
    const schemas = [
      [
        {
          id: '1',
          schemaUid: 'schema-1',
          name: 'texto_01',
          type: 'text',
          position: { x: 0, y: 0 },
          width: 10,
          height: 10,
          fileId: 'file-a',
          pageNumber: 1,
          createdBy: 'author-1',
          ownerRecipientId: 'recipient-1',
        } as SchemaForUI,
      ],
    ];

    const assignments = buildUserRecipientAssignments(schemas);

    expect(assignments['author-1']).toBeDefined();
    expect(assignments['author-1']['recipient-1']).toBeDefined();
    expect(assignments['author-1']['recipient-1']['file-a']).toBeDefined();
    expect(assignments['author-1']['recipient-1']['file-a']['1']).toEqual(['schema-1']);
  });

  it('adds shared recipient bucket when ownerMode is shared', () => {
    const schemas = [
      [
        {
          id: '2',
          schemaUid: 'schema-2',
          name: 'texto_02',
          type: 'text',
          position: { x: 0, y: 0 },
          width: 10,
          height: 10,
          fileId: 'file-a',
          pageNumber: 1,
          createdBy: 'author-1',
          ownerRecipientId: 'recipient-1',
          ownerMode: 'shared',
        } as SchemaForUI,
      ],
    ];

    const assignments = buildUserRecipientAssignments(schemas);

    expect(assignments['author-1'][SHARED_ASSIGNMENTS_BUCKET]['file-a']['1']).toContain('schema-2');
  });

  it('creates anchored comments with defaults and identity metadata', () => {
    const comment = createSchemaComment(
      'Comentario inicial',
      { authorId: 'reviewer-1', authorName: 'Revisor', authorColor: '#123456', timestamp: 1000 },
      {
        schemaUid: 'schema-1',
        fileId: 'file-a',
        pageNumber: 2,
        anchor: { id: 'anchor-1', x: 12, y: 33 },
      },
    );

    expect(comment.text).toBe('Comentario inicial');
    expect(comment.schemaUid).toBe('schema-1');
    expect(comment.fileId).toBe('file-a');
    expect(comment.pageNumber).toBe(2);
    expect(comment.authorId).toBe('reviewer-1');
    expect(comment.anchor?.x).toBe(12);
    expect(comment.replies).toEqual([]);
    expect(comment.createdAt).toBe(1000);
  });

  it('creates anchors and resolves fieldId from schemaUid when absent', () => {
    const anchor = createSchemaCommentAnchor(
      {
        schemaUid: 'schema-5',
        fileId: 'file-x',
        pageNumber: 3,
        x: 8,
        y: 9,
      },
      { authorId: 'user-1', authorColor: '#fff' },
    );

    expect(anchor.schemaUid).toBe('schema-5');
    expect(anchor.fieldId).toBe('schema-5');
    expect(anchor.fileId).toBe('file-x');
    expect(anchor.pageNumber).toBe(3);
    expect(anchor.authorId).toBe('user-1');
  });

  it('filters schemas by author view unless global view is enabled', () => {
    const schemas = [
      {
        id: '1',
        name: 'a',
        type: 'text',
        position: { x: 0, y: 0 },
        width: 10,
        height: 10,
        createdBy: 'author-1',
      } as SchemaForUI,
      {
        id: '2',
        name: 'b',
        type: 'text',
        position: { x: 0, y: 0 },
        width: 10,
        height: 10,
        createdBy: 'author-2',
      } as SchemaForUI,
    ];

    const filtered = filterSchemasByAuthorView(schemas, { activeUserId: 'author-1', isGlobalView: false });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');

    const global = filterSchemasByAuthorView(schemas, { activeUserId: 'author-1', isGlobalView: true });
    expect(global).toHaveLength(2);
  });
});
