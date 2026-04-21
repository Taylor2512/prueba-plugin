import { describe, expect, it } from 'vitest';
import {
  createSchemaComment,
  createSchemaCommentAnchor,
  removeById,
  upsertById,
} from '@sisad-pdfme/common';

describe('comment model helpers', () => {
  it('creates comments with stable author identity metadata', () => {
    const comment = createSchemaComment(' Revisar owner ', {
      authorId: 'sales-user-1',
      authorName: 'Ventas Ejecutivas',
      authorColor: '#2563EB',
      timestamp: 1700000000000,
    });

    expect(comment).toEqual(
      expect.objectContaining({
        authorId: 'sales-user-1',
        authorName: 'Ventas Ejecutivas',
        authorColor: '#2563EB',
        timestamp: 1700000000000,
        text: 'Revisar owner',
        resolved: false,
        replies: [],
      }),
    );
    expect(comment.id).toMatch(/^comment-/);
  });

  it('creates anchors with file/page coordinates and author color', () => {
    const anchor = createSchemaCommentAnchor(
      {
        schemaUid: 'schema-uid-1',
        fileId: 'file-a',
        pageNumber: 2,
        x: 12,
        y: 24,
      },
      {
        authorId: 'legal-user-1',
        authorColor: '#D946EF',
      },
    );

    expect(anchor).toEqual(
      expect.objectContaining({
        schemaUid: 'schema-uid-1',
        fileId: 'file-a',
        pageNumber: 2,
        x: 12,
        y: 24,
        authorId: 'legal-user-1',
        authorColor: '#D946EF',
      }),
    );
    expect(anchor.id).toMatch(/^anchor-/);
  });

  it('upserts and removes comment entities by id without duplicating records', () => {
    const first = createSchemaComment('Primero', { authorId: 'sales-user-1' }, { id: 'comment-1' });
    const second = createSchemaComment('Segundo', { authorId: 'legal-user-1' }, { id: 'comment-2' });

    const upserted = upsertById([first], { ...first, text: 'Actualizado' });
    expect(upserted).toHaveLength(1);
    expect(upserted[0].text).toBe('Actualizado');

    const appended = upsertById(upserted, second);
    expect(appended.map((comment) => comment.id)).toEqual(['comment-1', 'comment-2']);

    expect(removeById(appended, 'comment-1').map((comment) => comment.id)).toEqual(['comment-2']);
  });
});
