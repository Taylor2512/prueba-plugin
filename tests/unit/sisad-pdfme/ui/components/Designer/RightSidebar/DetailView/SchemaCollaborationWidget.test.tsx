import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import SchemaCollaborationWidget from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx', () => {
  const changeSchemas = vi.fn();

  beforeEach(() => {
    changeSchemas.mockClear();
  });

  it('renders a compact collaboration summary without concatenated text', () => {
    const activeSchema = {
      id: 'schema-1',
      name: 'signature_field',
      type: 'signature',
      position: { x: 12, y: 18 },
      width: 80,
      height: 24,
      ownerColor: '#D97706',
      ownerRecipientId: 'recipient-1',
      ownerRecipientName: 'Cliente Principal',
      state: 'locked',
      lock: { lockedBy: 'recipient-1' },
    } as SchemaForUI;

    render(<SchemaCollaborationWidget activeSchema={activeSchema} changeSchemas={changeSchemas} />);

    expect(screen.getByText('Estado de acceso')).toBeInTheDocument();
    expect(screen.getByText('Propietario, bloqueo y auditoría.')).toBeInTheDocument();
    expect(screen.getByText('Bloqueado por recipient-1')).toBeInTheDocument();
    expect(screen.getByTestId('schema-collaboration-widget')).toHaveAttribute('data-schema-owner-color', '#D97706');
    expect(screen.getByRole('button', { name: 'Cambiar propietario' })).toBeInTheDocument();
    expect(screen.queryByText('Estado')).toBeNull();
    expect(screen.queryByText(/Propietario y permi/i)).toBeNull();
  });

  it('switches to the assign state when no owner exists', () => {
    const activeSchema = {
      id: 'schema-2',
      name: 'attachment_field',
      type: 'attachment',
      position: { x: 14, y: 22 },
      width: 80,
      height: 24,
      state: 'draft',
    } as SchemaForUI;

    render(<SchemaCollaborationWidget activeSchema={activeSchema} changeSchemas={changeSchemas} />);

    expect(screen.getByText('Estado de acceso')).toBeInTheDocument();
    expect(screen.getByText('Propietario, bloqueo y auditoría.')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cambiar propietario' })).toBeInTheDocument();
  });

  it('applies owner changes to all selected schemas when selection commands are unavailable', () => {
    const activeSchema = {
      id: 'schema-3',
      name: 'approval_field',
      type: 'text',
      position: { x: 16, y: 24 },
      width: 90,
      height: 24,
      state: 'draft',
    } as SchemaForUI;
    const selectedA = document.createElement('div');
    selectedA.dataset.schemaId = 'schema-3';
    const selectedB = document.createElement('div');
    selectedB.dataset.schemaId = 'schema-4';
    const designerEngine = {
      collaboration: {
        users: [
          { id: 'recipient-1', name: 'Cliente Principal', color: '#2563eb' },
          { id: 'recipient-9', name: 'Nuevo Usuario', color: '#7c3aed' },
        ],
        activeUserId: 'recipient-1',
      },
    } as never;

    render(
      <SchemaCollaborationWidget
        activeSchema={activeSchema}
        changeSchemas={changeSchemas}
        activeElements={[selectedA, selectedB]}
        designerEngine={designerEngine}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar propietario' }));
    const ownerSelect = document.getElementById('collaboration-owner');
    expect(ownerSelect).toBeTruthy();
    fireEvent.mouseDown(ownerSelect as HTMLElement);
    fireEvent.click(screen.getByText('Nuevo Usuario'));

    expect(changeSchemas).toHaveBeenCalledTimes(1);
    const patch = changeSchemas.mock.calls[0]?.[0] as Array<{ key: string; value: unknown; schemaId: string }>;
    expect(patch).toEqual(
      expect.arrayContaining([
        { key: 'ownerRecipientId', value: 'recipient-9', schemaId: 'schema-3' },
        { key: 'ownerRecipientId', value: 'recipient-9', schemaId: 'schema-4' },
      ]),
    );
  });
});
