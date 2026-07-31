import { describe, expect, it } from 'vitest';
import {
  appendTemplatePages,
  createCollaboration,
  createExample,
  createTemplate,
  createUploadedDocument,
  cloneExample,
} from '@/sisad-pdfme/labs';

describe('sisad-pdfme/examples/exampleBuilder', () => {
  it('pads templates to the requested page count', () => {
    const template = createTemplate([[{ name: 'field', type: 'text' }]], { pageCount: 3 });

    expect(template.schemas).toHaveLength(3);
    expect(template.schemas[1]).toEqual([]);
  });

  it('creates a collaborative example with derived inputs', () => {
    const example = createExample({
      id: 'example-1',
      path: '/example-1',
      title: 'Example',
      description: 'Demo',
      status: 'ready',
      collaboration: { users: [{ id: 'u1', color: '#3366ff' }] },
      template: createTemplate([[{ name: 'owner', type: 'text', ownerRecipientId: 'u1' }]]),
    });

    expect(example.template.schemas[0][0].ownerColor).toBe('#3366ff');
    expect(example.inputs).toBeTruthy();
  });

  it('clones example payloads defensively', () => {
    const source = createExample({
      id: 'example-2',
      path: '/example-2',
      title: 'Example 2',
      description: 'Demo 2',
      status: 'ready',
      template: createTemplate([[]]),
    });
    const cloned = cloneExample(source);

    expect(cloned).not.toBe(source);
    expect(cloned.template).not.toBe(source.template);
  });

  it('creates uploaded documents using the supplied resolver', () => {
    const document = createUploadedDocument({
      id: 'doc-1',
      name: 'Doc 1',
      pdfFileName: 'sample.pdf',
      pageCount: 2,
      schemas: [[]],
      pdfResolver: (fileName) => `/files/${fileName}`,
    });

    expect(document.template.basePdf).toBe('/files/sample.pdf');
    expect(document.template.schemas).toHaveLength(2);
  });

  it('creates a collaboration snapshot with default session metadata', () => {
    const collaboration = createCollaboration('u1', [{ id: 'u1' }], {});

    expect(collaboration.sessionId).toBe('lab-u1');
    expect(collaboration.enabled).toBe(true);
  });

  it('appends extra pages without mutating the source template', () => {
    const template = createTemplate([[]]);
    const extra = [[{ name: 'extra', type: 'text' }]];
    const appended = appendTemplatePages(template, extra);

    expect(appended.schemas).toHaveLength(2);
    expect(appended.schemas[1]).not.toBe(extra[0]);
  });
});
