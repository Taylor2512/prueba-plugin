import { describe, expect, it } from 'vitest';
import {
  attachCommentToField,
  detachCommentFromField,
  getCommentsForSchema,
  moveCommentAnchor,
  reopenComment,
  resolveTopLevelComment,
} from '@/sisad-pdfme/comments';
import { schema, template } from '../fixtures/sisadFixtures';

const commentTemplate = () => template([[
  schema({
    comments: [{ id: 'inline-1', text: 'Inline', anchor: { id: 'inline-1', fileId: 'file-a', pageNumber: 1, schemaUid: 'schema-1', x: 1, y: 2 } }],
    commentAnchors: [{ id: 'inline-1', fileId: 'file-a', pageNumber: 1, schemaUid: 'schema-1', x: 1, y: 2 }],
  }),
]]) as any;

describe('comments lifecycle', () => {
  it('combina comentarios inline y top-level del schema', () => {
    const source = commentTemplate();
    source.pdfComments = [{
      id: 'top-1',
      comment: { id: 'top-1', text: 'Top', schemaUid: 'schema-1' },
      anchor: { id: 'top-1', fileId: 'file-a', pageNumber: 1, schemaUid: 'schema-1', x: 5, y: 6 },
    }];
    expect(getCommentsForSchema(source, 'schema-1')).toHaveLength(2);
  });

  it('mueve anchor inline y top-level sin mutar', () => {
    const source = commentTemplate();
    source.pdfComments = [{
      id: 'top-1', comment: { id: 'top-1' },
      anchor: { id: 'top-1', fileId: 'file-a', pageNumber: 1, x: 1, y: 2 },
    }];
    const movedInline = moveCommentAnchor(source, 'inline-1', { x: 20, y: 30, pageNumber: 2 });
    expect(movedInline.schemas[0][0].comments[0].anchor).toMatchObject({ x: 20, y: 30, pageNumber: 2 });
    const movedTop = moveCommentAnchor(source, 'top-1', { x: 10, schemaUid: 'schema-1' });
    expect(movedTop.pdfComments[0].anchor).toMatchObject({ x: 10, schemaUid: 'schema-1' });
    expect(source.pdfComments[0].anchor.x).toBe(1);
  });

  it('adjunta, resuelve y reabre comentario', () => {
    const source = commentTemplate();
    source.pdfComments = [{ id: 'top-1', comment: { id: 'top-1' }, anchor: { id: 'top-1', fileId: 'file-a', pageNumber: 1 } }];
    const attached = attachCommentToField(source, 'top-1', 'schema-1');
    expect(attached.pdfComments[0].anchor.schemaUid).toBe('schema-1');
    const resolved = resolveTopLevelComment(attached, 'top-1', true);
    expect(resolved.pdfComments[0].comment.resolved).toBe(true);
    expect(reopenComment(resolved, 'top-1').pdfComments[0].comment.resolved).toBe(false);
  });

  it.todo('detachCommentFromField elimina schemaUid del anchor en vez de conservarlo');

  it('documenta la conducta actual de detach mientras se corrige', () => {
    const source = commentTemplate();
    const detached = detachCommentFromField(source, 'inline-1');
    expect(detached.schemas[0][0].comments[0].anchor.schemaUid).toBe('schema-1');
  });
});
