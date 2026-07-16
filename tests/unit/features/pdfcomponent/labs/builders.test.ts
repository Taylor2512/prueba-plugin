import { describe, it, expect } from 'vitest';
import {
  sanitizeIdentifier,
  chunkItems,
  createSchema,
  createAuditMetadata,
  DEFAULT_AUDIT_BASE_TIMESTAMP,
  createCommentAnchor,
} from '@/features/pdfcomponent/labs/builders/schemaFactory';
import {
  mergeSchemaPages,
  rectsIntersect,
  createSchemaShowcasePages,
  SHOWCASE_GRID_POSITIONS,
} from '@/features/pdfcomponent/labs/builders/schemaShowcase';
import {
  createTemplate,
  appendTemplatePages,
  createUploadedDocument,
  createCollaboration,
  createExample,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate';
import { buildExampleBundle, getExampleBundleFilename } from '@/features/pdfcomponent/labs/export/buildExampleBundle';

describe('schemaFactory', () => {
  it('sanitizeIdentifier slugs', () => {
    expect(sanitizeIdentifier('Hello World!')).toBe('hello-world');
    expect(sanitizeIdentifier('')).toBe('lab-example');
  });
  it('chunkItems', () => {
    expect(chunkItems([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  it('createSchema deep-merges clones', () => {
    const base = { a: 1, nested: { x: 1 } };
    const out = createSchema(base, { b: 2 });
    expect(out).toEqual({ a: 1, nested: { x: 1 }, b: 2 });
    expect(out.nested).not.toBe(base.nested);
  });
  it('createAuditMetadata uses default base timestamp', () => {
    const m = createAuditMetadata('u1', 'u2', 1000);
    expect(m).toEqual({
      createdBy: 'u1',
      lastModifiedBy: 'u2',
      createdAt: DEFAULT_AUDIT_BASE_TIMESTAMP + 1000,
      updatedAt: DEFAULT_AUDIT_BASE_TIMESTAMP + 61000,
    });
  });
  it('createCommentAnchor', () => {
    expect(createCommentAnchor({ schemaUid: 's', pageNumber: 2 })).toMatchObject({
      id: 's-anchor-2',
      schemaUid: 's',
      resolved: false,
    });
  });
});

describe('schemaShowcase', () => {
  it('rectsIntersect detects overlap', () => {
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 0, width: 10, height: 10 })).toBe(false);
  });
  it('mergeSchemaPages shifts colliding extra pages right', () => {
    const base = [[{ position: { x: 0, y: 0 }, width: 10, height: 10 }]];
    const extra = [[{ position: { x: 0, y: 0 }, width: 10, height: 10 }]];
    const out = mergeSchemaPages(base, extra, 1, 120);
    expect(out[0][1].position.x).toBe(120);
  });
  it('createSchemaShowcasePages chunks by grid and tags pages', () => {
    const defs = Array.from({ length: SHOWCASE_GRID_POSITIONS.length + 1 }, () => ({ type: 'text' }));
    const pages = createSchemaShowcasePages({ definitions: defs, scope: 'demo', ownerRecipientId: 'r1', startingPageNumber: 3 });
    expect(pages).toHaveLength(2);
    expect(pages[0]).toHaveLength(SHOWCASE_GRID_POSITIONS.length);
    expect(pages[0][0].pageNumber).toBe(3);
    expect(pages[1][0].pageNumber).toBe(4);
    expect(pages[0][0].ownerRecipientId).toBe('r1');
  });
});

describe('exampleTemplate + bundle', () => {
  it('createTemplate pads pages to pageCount', () => {
    const t = createTemplate([[{ name: 'a', type: 'text' }]], { pageCount: 3 });
    expect(t.schemas).toHaveLength(3);
    expect(t.schemas[1]).toEqual([]);
  });
  it('appendTemplatePages clones extra pages', () => {
    const t = createTemplate([[]]);
    const extra = [[{ name: 'x', type: 'text' }]];
    const out = appendTemplatePages(t, extra);
    expect(out.schemas).toHaveLength(2);
    expect(out.schemas[1]).not.toBe(extra[0]);
  });
  it('createUploadedDocument resolves basePdf via pdfResolver', () => {
    const doc = createUploadedDocument({
      id: 'd1', name: 'Doc', pdfFileName: 'a.pdf', pageCount: 2, schemas: [[]],
      pdfResolver: (f) => `/templates/${f}`,
    });
    expect(doc.template.basePdf).toBe('/templates/a.pdf');
    expect(doc.template.schemas).toHaveLength(2);
  });
  it('createCollaboration decorates users with palette', () => {
    const collab = createCollaboration('u1', [{ id: 'u1' }, { id: 'u2' }], { sessionId: 's' });
    expect(collab.activeUserId).toBe('u1');
    expect(collab.users[0].color).toBeTruthy();
  });
  it('createExample decorates template + derives inputs', () => {
    const ex = createExample({
      id: 'e1', path: '/e1', title: 'T', description: 'D', status: 'S',
      collaboration: { users: [{ id: 'r1', color: '#AA0000' }] },
      template: createTemplate([[{ name: 'f', type: 'text', ownerRecipientId: 'r1' }]]),
    });
    expect(ex.template.schemas[0][0].ownerColor).toBe('#AA0000');
    expect(ex.inputs).toBeTruthy();
  });
  it('buildExampleBundle injects source/version/actions', async () => {
    const ex = createExample({
      id: 'my-id', path: '/p', title: 'T', description: 'D', status: 'S',
      template: createTemplate([[]]),
      collaboration: { users: [{ id: 'r1', color: '#3366ff' }], activeUserId: 'r1' },
      runtimeOptions: {
        uploadedDocuments: [
          {
            id: 'doc-1',
            name: 'Doc 1',
            template: createTemplate([[]]),
          },
        ],
      },
    });
    const bundle = await buildExampleBundle(ex, { source: 'sisad-pdfme-lab', version: 2, getActions: () => ['open-example'] });
    expect(bundle.source).toBe('sisad-pdfme-lab');
    expect(bundle.version).toBe(2);
    expect(bundle.assetEncoding).toBe('base64-inline');
    expect(bundle.availableActions).toEqual(['open-example']);
    expect(bundle.recipients).toHaveLength(1);
    expect(bundle.documents).toHaveLength(1);
    expect(bundle.config).toMatchObject({
      runtime: { mode: 'designer' },
      collaboration: { activeRecipientId: 'r1' },
      documents: { mode: 'single' },
    });
    expect(bundle.runtimeOptions?.uploadedDocuments).toBeUndefined();
    expect(getExampleBundleFilename(ex)).toBe('my-id.json');
  });
});
