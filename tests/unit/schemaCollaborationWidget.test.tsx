import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
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
  const widgetShellProps = {
    rootElement: document.createElement('div'),
    activeElements: [] as HTMLElement[],
    schemas: [] as never[],
    options: {} as never,
    theme: {} as never,
    i18n: (key: string) => key,
    value: '',
    onChange: vi.fn(),
    schema: {} as never,
    style: {} as never,
    id: 'schema-collaboration-widget',
    addons: {} as never,
  };

  it('keeps collaboration focused on owner and lock metadata', () => {
    render(
      <SchemaCollaborationWidget
        {...widgetShellProps}
        activeSchema={{
          id: 'schema-1',
          name: 'Campo colaborativo',
          type: 'text',
          schemaUid: 'schema-uid-1',
          ownerRecipientId: 'user-1',
          state: 'locked',
          commentsCount: 1,
          commentAnchors: [
            {
              id: 'anchor-1',
              scope: 'schema',
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
      />,
    );

    expect(screen.getByText('Comentarios: 1')).toBeVisible();
    expect(screen.getByText('Anchors: 1')).toBeVisible();
    expect(screen.getByText('Bloqueo activo')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Agregar comentario' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Agregar anchor' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Gestionar colaboración' }));
    const dialog = screen.getByRole('dialog', { name: 'Configurar colaboración del campo' });

    const metadataToggle = within(dialog).getByRole('button', { name: /Metadatos editables/ });
    expect(metadataToggle).toHaveAttribute('aria-expanded', 'false');
    expect(within(dialog).queryByDisplayValue('schema-uid-1')).toBeNull();

    fireEvent.click(metadataToggle);
    expect(within(dialog).getByDisplayValue('schema-uid-1')).toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: 'Agregar comentario' })).toBeNull();
    expect(within(dialog).queryByRole('button', { name: 'Agregar anchor' })).toBeNull();
  });

  it('writes file ids to both fileId and fileTemplateId', () => {
    const changeSchemas = vi.fn();

    render(
      <SchemaCollaborationWidget
        {...widgetShellProps}
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
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Gestionar colaboración' }));
    const dialog = screen.getByRole('dialog', { name: 'Configurar colaboración del campo' });
    fireEvent.click(within(dialog).getByRole('button', { name: /Metadatos editables/ }));

    fireEvent.change(within(dialog).getByPlaceholderText('file-01'), {
      target: { value: 'file-3' },
    });
    expect(changeSchemas).toHaveBeenLastCalledWith([
      { key: 'fileId', value: 'file-3', schemaId: 'schema-1' },
      { key: 'fileTemplateId', value: 'file-3', schemaId: 'schema-1' },
    ]);
  });

  it('renders resolved ownership state from collaboration context', () => {
    render(
      <SchemaCollaborationWidget
        {...widgetShellProps}
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
      />,
    );

    expect(screen.getByText('Compartido')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Gestionar colaboración' }));
    const dialog = screen.getByRole('dialog', { name: 'Configurar colaboración del campo' });

    fireEvent.click(within(dialog).getByRole('button', { name: /Metadatos editables/ }));
    expect(within(dialog).getByText('Autor sales-user-1')).toBeInTheDocument();
    expect(within(dialog).getByDisplayValue('Ventas Ejecutivas')).toBeInTheDocument();
  });
});
