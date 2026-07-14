import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/externalForms/externalFormRunner';
import { makeEmptySnapshot } from '@/sisad-pdfme/shared/snapshot';

describe('sisad-pdfme/externalForms/externalFormRunner.ts', () => {
  const designer = (schemaUid: string, pageNumber = 1) => ({
    schemaUid,
    templateVersion: '2.0.0',
    documentId: 'doc-1',
    pageNumber,
  });

  it('imports without crashing', () => {
    expect(moduleUnderTest).toBeTruthy();
  });

  it('resolves editable/readonly/hidden schema state from snapshot assignments', () => {
    const snapshot = makeEmptySnapshot({
      assignments: [
        { schemaUid: 'customer-name', recipientId: 'client', scope: 'recipient' },
        { schemaUid: 'guarantor-name', recipientId: 'guarantor', scope: 'recipient' },
        { schemaUid: 'signature-block', recipientId: 'client', scope: 'recipient' },
      ],
      documents: [
        {
          documentId: 'doc-1',
          name: 'Doc 1',
          order: 1,
          pages: [
            {
              pageNumber: 1,
              background: { type: 'none' },
              schemas: [
                { id: 'customer-name', type: 'text', __designer: designer('customer-name') },
                { id: 'guarantor-name', type: 'text', __designer: designer('guarantor-name') },
                {
                  id: 'signature-block',
                  type: 'signature',
                  __designer: {
                    ...designer('signature-block'),
                    signature: { mode: 'provider', providerKey: 'oneshot' },
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const storage = new moduleUnderTest.InMemoryExternalFormStorage();
    storage.saveInput('customer-name', 'Jane Doe');
    storage.saveInput('signature-block', 'signed');

    const state = moduleUnderTest.resolveExternalFormRuntimeState({
      snapshot,
      currentRecipientId: 'client',
      flowState: { completedRecipients: [], currentStep: 1, totalSteps: 2 },
      storage,
    });

    expect(state.mode).toBe('form');
    expect(state.editableSchemaUids).toEqual(['customer-name']);
    expect(state.readonlySchemaUids).toEqual(['signature-block']);
    expect(state.hiddenSchemaUids).toEqual(['guarantor-name']);
    expect(state.documents).toEqual([
      expect.objectContaining({
        documentId: 'doc-1',
        name: 'Doc 1',
        order: 1,
        pageCount: 1,
        canRenderForm: true,
      }),
    ]);
    expect(state.pages).toEqual([
      expect.objectContaining({
        documentId: 'doc-1',
        pageNumber: 1,
        editableSchemaUids: ['customer-name'],
        readonlySchemaUids: ['signature-block'],
        hiddenSchemaUids: ['guarantor-name'],
        canRenderForm: true,
      }),
    ]);
    expect(state.canComplete).toBe(true);
    expect(state.schemaStates).toHaveLength(3);
  });

  it('falls back to viewer mode once the recipient completed the turn', () => {
    const snapshot = makeEmptySnapshot({
      assignments: [{ schemaUid: 'customer-name', recipientId: 'client', scope: 'recipient' }],
      documents: [
        {
          documentId: 'doc-1',
          name: 'Doc 1',
          order: 1,
          pages: [
            {
              pageNumber: 1,
              background: { type: 'none' },
              schemas: [{ id: 'customer-name', type: 'text', __designer: designer('customer-name') }],
            },
          ],
        },
      ],
    });

    const state = moduleUnderTest.resolveExternalFormRuntimeState({
      snapshot,
      currentRecipientId: 'client',
      flowState: { completedRecipients: ['client'], currentStep: 2, totalSteps: 2 },
      storage: new moduleUnderTest.InMemoryExternalFormStorage(),
    });

    expect(state.mode).toBe('viewer');
    expect(state.editableSchemaUids).toHaveLength(0);
    expect(state.readonlySchemaUids).toEqual(['customer-name']);
    expect(state.documents[0]).toEqual(expect.objectContaining({
      documentId: 'doc-1',
      pageCount: 1,
      canRenderForm: false,
    }));
    expect(state.pages[0]).toEqual(expect.objectContaining({
      documentId: 'doc-1',
      pageNumber: 1,
      editableSchemaUids: [],
      readonlySchemaUids: ['customer-name'],
      hiddenSchemaUids: [],
      canRenderForm: false,
    }));
    expect(state.canComplete).toBe(true);
  });
});
