import { describe, expect, it } from 'vitest';

import {
  appendTemplatePages,
  buildExampleBundle,
  buildExampleHref,
  createCollaboration,
  createExample,
  createTemplate,
  createUploadedDocument,
  getExampleBundleFilename,
  normalizeExampleHostData,
} from '@/examples/index.jsx';

describe('sisad-pdfme/examples bundle and builder helpers', () => {
  it('normaliza el host ejemplo con recipients, documentos y providers', () => {
    const normalized = normalizeExampleHostData({
      id: 'host-1',
      title: 'Host',
      template: createTemplate([[]]),
      collaboration: {
        activeUserId: 'alice',
        users: [{ id: 'alice', color: '#3366ff' }],
      },
      runtimeOptions: {
        uploadedDocuments: [
          {
            id: 'doc-1',
            name: 'Documento 1',
            template: createTemplate([[]], { basePdf: new Uint8Array([1, 2, 3, 4]) }),
          },
        ],
        signatureProviders: [{ key: 'prov-1', label: 'Firma 1' }],
      },
    });

    expect(normalized.activeRecipientId).toBe('alice');
    expect(normalized.recipients).toHaveLength(1);
    expect(normalized.documents).toHaveLength(1);
    expect(normalized.signatureProviders).toHaveLength(1);
    expect(normalized.inputs).toBeTruthy();
  });

  it('createTemplate y appendTemplatePages preservan clones de páginas', () => {
    const template = createTemplate([[{ name: 'a', type: 'text' }]], { pageCount: 3 });
    const appended = appendTemplatePages(template, [[{ name: 'b', type: 'text' }]]);

    expect(template.schemas).toHaveLength(3);
    expect(template.schemas[1]).toEqual([]);
    expect(appended.schemas).toHaveLength(4);
    expect(appended.schemas[3]).not.toBe(appended.schemas[0]);
  });

  it('createUploadedDocument y createCollaboration mantienen el contrato base', () => {
    const document = createUploadedDocument({
      id: 'doc-2',
      name: 'Documento 2',
      pdfFileName: 'sample.pdf',
      pageCount: 2,
      schemas: [[]],
      pdfResolver: () => new Uint8Array([37, 80, 68, 70]),
    });
    const collaboration = createCollaboration('u1', [{ id: 'u1' }, { id: 'u2' }], {
      sessionId: 'session-1',
    });

    expect(document.template.basePdf).toBeInstanceOf(Uint8Array);
    expect(document.template.schemas).toHaveLength(2);
    expect(collaboration.sessionId).toBe('session-1');
    expect(collaboration.users).toHaveLength(2);
  });

  it('buildExampleBundle inlines assets and exports metadata', async () => {
    const example = createExample({
      id: 'my-id',
      path: '/p',
      title: 'T',
      description: 'D',
      status: 'S',
      template: createTemplate([[]], { basePdf: new Uint8Array([37, 80, 68, 70]) }),
      collaboration: {
        activeUserId: 'r1',
        users: [{ id: 'r1', color: '#3366ff' }],
      },
      runtimeOptions: {
        uploadedDocuments: [
          {
            id: 'doc-1',
            name: 'Doc 1',
            template: createTemplate([[]], { basePdf: new Uint8Array([37, 80, 68, 70]) }),
          },
        ],
      },
    });

    const bundle = await buildExampleBundle(example, {
      source: 'sisad-pdfme-lab',
      version: 2,
      getActions: () => ['open-example'],
    });

    expect(bundle.source).toBe('sisad-pdfme-lab');
    expect(bundle.version).toBe(2);
    expect(bundle.assetEncoding).toBe('base64-inline');
    expect(bundle.availableActions).toEqual(['open-example']);
    expect(bundle.example.id).toBe('my-id');
    expect(bundle.template.basePdf).toContain('data:application/pdf;base64,');
    expect(bundle.documents).toHaveLength(1);
    expect(bundle.documents[0].template?.basePdf).toContain('data:application/pdf;base64,');
    expect(bundle.config).toMatchObject({
      runtime: { mode: 'designer' },
      collaboration: { activeRecipientId: 'r1' },
      documents: { mode: 'single' },
    });
    expect(bundle.runtimeOptions?.uploadedDocuments).toBeUndefined();
    expect(getExampleBundleFilename(example)).toBe('my-id.json');
    await expect(buildExampleHref(example)).resolves.toContain('data:application/json;charset=utf-8,');
  });
});
