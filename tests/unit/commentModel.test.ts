import { describe, expect, it } from 'vitest';
import {
  addCommentWithAnchorToTemplate,
  createSchemaComment,
  createSchemaCommentAnchor,
  filterCommentsByFileAndPage,
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

  it('creates anchored comments with a shared anchor id and can filter them by file/page', () => {
    const template = {
      basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
      schemas: [[{
        id: 'schema-1',
        schemaUid: 'schema-uid-1',
        name: 'field-a',
        type: 'text',
        position: { x: 0, y: 0 },
        width: 40,
        height: 10,
      }]],
    } as any;

    const nextTemplate = addCommentWithAnchorToTemplate(
      template,
      {
        schemaUid: 'schema-uid-1',
        fileId: 'file-a',
        pageNumber: 2,
        x: 12,
        y: 24,
      },
      'Revisar este campo',
      { authorId: 'reviewer-1', authorColor: '#2563EB' },
    );

    const schema = nextTemplate.schemas[0][0] as any;
    expect(schema.comments).toHaveLength(1);
    expect(schema.commentAnchors).toHaveLength(1);
    expect(schema.comments[0].id).toBe(schema.commentAnchors[0].id);
    expect(schema.comments[0].anchor).toEqual(
      expect.objectContaining({
        id: schema.comments[0].id,
        fileId: 'file-a',
        pageNumber: 2,
        x: 12,
        y: 24,
      }),
    );

    const filtered = filterCommentsByFileAndPage(nextTemplate, 'file-a', 2);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].comment.id).toBe(schema.comments[0].id);
    expect(filtered[0].anchor?.id).toBe(schema.comments[0].id);
  });

  it('deduplicates top-level fallback comments by id and keeps mixed comment views unique', () => {
    const template = {
      basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
      schemas: [[{
        id: 'schema-1',
        schemaUid: 'schema-uid-1',
        name: 'field-a',
        type: 'text',
        position: { x: 0, y: 0 },
        width: 40,
        height: 10,
      }]],
    } as any;

    const fallbackAnchor = {
      id: 'comment-mixed',
      fileId: 'file-a',
      pageNumber: 2,
      x: 12,
      y: 24,
    };

    const withFallbackOnce = addCommentWithAnchorToTemplate(
      template,
      fallbackAnchor,
      'Fallback comment',
      { authorId: 'reviewer-1', authorColor: '#2563EB' },
    );
    const withFallbackTwice = addCommentWithAnchorToTemplate(
      withFallbackOnce,
      fallbackAnchor,
      'Fallback comment updated',
      { authorId: 'reviewer-1', authorColor: '#2563EB' },
    );

    expect((withFallbackTwice as any).__commentAnchors).toHaveLength(1);
    expect((withFallbackTwice as any).__commentAnchors[0].comment.text).toBe('Fallback comment updated');

    const schema = withFallbackTwice.schemas[0][0] as any;
    schema.comments = [
      createSchemaComment(
        'Schema-bound comment',
        { authorId: 'reviewer-1', authorColor: '#2563EB' },
        {
          id: 'comment-mixed',
          anchor: {
            id: 'comment-mixed',
            fileId: 'file-a',
            pageNumber: 2,
            x: 12,
            y: 24,
          },
        },
      ),
    ];
    schema.commentAnchors = [
      createSchemaCommentAnchor(
        {
          id: 'comment-mixed',
          fileId: 'file-a',
          pageNumber: 2,
          x: 12,
          y: 24,
        },
        { authorId: 'reviewer-1', authorColor: '#2563EB' },
      ),
    ];

    const filtered = filterCommentsByFileAndPage(withFallbackTwice, 'file-a', 2);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].comment.id).toBe('comment-mixed');
  });
});
