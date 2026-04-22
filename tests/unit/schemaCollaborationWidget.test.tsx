import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import SchemaCollaborationWidget, {
  joinRecipientIds,
  normalizeRecipientIds,
  resolveOwnerMode,
} from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.js';

describe('SchemaCollaborationWidget helpers', () => {
  it('normalizes recipient identifiers and infers owner mode from them', () => {
    expect(normalizeRecipientIds([' recipient-1 ', 'recipient-1', '', 'recipient-2 '])).toEqual([
      'recipient-1',
      'recipient-2',
    ]);
    expect(normalizeRecipientIds(' recipient-1 , recipient-2 , recipient-1 ')).toEqual([
      'recipient-1',
      'recipient-2',
    ]);
    expect(joinRecipientIds(['recipient-1', 'recipient-2'])).toBe('recipient-1, recipient-2');
    expect(resolveOwnerMode([])).toBeUndefined();
    expect(resolveOwnerMode(['recipient-1'])).toBe('single');
    expect(resolveOwnerMode(['recipient-1', 'recipient-2'])).toBe('multi');
  });
});

describe('SchemaCollaborationWidget', () => {
  it('keeps comment and anchor sections compact while exposing their counts', () => {
    render(
      <SchemaCollaborationWidget
        activeSchema={{
          id: 'schema-1',
          name: 'Campo colaborativo',
          type: 'text',
          schemaUid: 'schema-uid-1',
          ownerRecipientId: 'user-1',
          state: 'locked',
          commentsCount: 1,
          comments: [
            {
              id: 'comment-1',
              authorId: 'user-2',
              authorName: 'Ana',
              timestamp: 1700000000000,
              text: 'Revisar este campo',
              resolved: false,
              replies: [],
            },
          ],
          commentAnchors: [
            {
              id: 'anchor-1',
              schemaUid: 'schema-uid-1',
              fileId: 'file-1',
              pageNumber: 2,
              x: 12,
              y: 24,
              resolved: false,
            },
          ],
          lock: {
            lockedBy: 'user-3',
            lockedAt: 1700000000123,
            reason: 'Edición concurrente',
          },
        } as SchemaForUI}
        changeSchemas={vi.fn()}
        designerEngine={undefined}
        rootElement={document.createElement('div')}
        activeElements={[]}
        schemas={[]}
        options={{} as never}
        theme={{} as never}
        i18n={(key) => key}
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Comentarios: 1')).toBeVisible();
    expect(screen.getByText('Anchors: 1')).toBeVisible();
    expect(screen.getByRole('button', { name: /Comentarios 1/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Anchors 1/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Revisar este campo')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Comentarios 1/ }));

    expect(screen.getByText('Revisar este campo')).toBeVisible();
  });

  it('writes file ids to both fileId and fileTemplateId and can create comments and anchors', () => {
    const changeSchemas = vi.fn();

    render(
      <SchemaCollaborationWidget
        activeSchema={{
          id: 'schema-1',
          name: 'Campo colaborativo',
          type: 'text',
          schemaUid: 'schema-uid-1',
          pageNumber: 2,
          fileId: 'file-2',
        } as SchemaForUI}
        changeSchemas={changeSchemas}
        designerEngine={{
          collaboration: {
            actorId: 'sales-user-1',
            activeRecipientId: 'sales-user-1',
            recipientOptions: [
              { id: 'sales-user-1', name: 'Ventas Ejecutivas', color: '#2563EB' },
            ],
          },
        } as never}
        rootElement={document.createElement('div')}
        activeElements={[]}
        schemas={[]}
        options={{} as never}
        theme={{} as never}
        i18n={(key) => key}
        value=""
        onChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('file-01'), {
      target: { value: 'file-3' },
    });
    expect(changeSchemas).toHaveBeenLastCalledWith([
      { key: 'fileId', value: 'file-3', schemaId: 'schema-1' },
      { key: 'fileTemplateId', value: 'file-3', schemaId: 'schema-1' },
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Agregar comentario' }));
    expect(changeSchemas).toHaveBeenLastCalledWith([
      expect.objectContaining({
        key: 'comments',
        schemaId: 'schema-1',
        value: [
          expect.objectContaining({
            authorId: 'sales-user-1',
            authorName: 'Ventas Ejecutivas',
            authorColor: '#2563EB',
          }),
        ],
      }),
      expect.objectContaining({ key: 'commentsCount', value: 1, schemaId: 'schema-1' }),
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Agregar anchor' }));
    expect(changeSchemas).toHaveBeenLastCalledWith([
      expect.objectContaining({
        key: 'commentAnchors',
        schemaId: 'schema-1',
        value: [
          expect.objectContaining({
            schemaUid: 'schema-uid-1',
            fileId: 'file-2',
            pageNumber: 2,
            authorId: 'sales-user-1',
            authorColor: '#2563EB',
          }),
        ],
      }),
      expect.objectContaining({
        key: 'commentsAnchors',
        schemaId: 'schema-1',
        value: [
          expect.objectContaining({
            schemaUid: 'schema-uid-1',
            pageNumber: 2,
          }),
        ],
      }),
    ]);
  });

  it('renders resolved ownership state from collaboration context', () => {
    render(
      <SchemaCollaborationWidget
        activeSchema={{
          id: 'schema-1',
          name: 'Campo colaborativo',
          type: 'text',
          schemaUid: 'schema-uid-1',
          ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
          ownerMode: 'shared',
          createdBy: 'sales-user-1',
        } as SchemaForUI}
        changeSchemas={vi.fn()}
        designerEngine={{
          collaboration: {
            actorId: 'sales-user-1',
            activeRecipientId: 'sales-user-1',
            recipientOptions: [
              { id: 'sales-user-1', name: 'Ventas Ejecutivas', color: '#2563EB' },
              { id: 'legal-user-1', name: 'Revisor Legal', color: '#D946EF' },
            ],
          },
        } as never}
        rootElement={document.createElement('div')}
        activeElements={[]}
        schemas={[]}
        options={{} as never}
        theme={{} as never}
        i18n={(key) => key}
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Compartido')).toBeVisible();
    expect(screen.getByText('Autor sales-user-1')).toBeVisible();
    expect(screen.getByDisplayValue('Ventas Ejecutivas')).toBeVisible();
  });
});
