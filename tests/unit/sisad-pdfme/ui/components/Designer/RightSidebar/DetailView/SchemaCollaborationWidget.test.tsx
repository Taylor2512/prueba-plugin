import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import SchemaCollaborationWidget from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx', () => {
  const changeSchemas = vi.fn();

  it('renders a compact collaboration summary without concatenated text', () => {
    const activeSchema = {
      id: 'schema-1',
      name: 'signature_field',
      type: 'signature',
      position: { x: 12, y: 18 },
      width: 80,
      height: 24,
      ownerRecipientId: 'recipient-1',
      ownerRecipientName: 'Cliente Principal',
      state: 'locked',
      lock: { lockedBy: 'recipient-1' },
    } as SchemaForUI;

    render(<SchemaCollaborationWidget activeSchema={activeSchema} changeSchemas={changeSchemas} />);

    expect(screen.getByText('Asignación y bloqueo')).toBeInTheDocument();
    expect(screen.getByText('Propietario y acceso.')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Bloqueado para edición')).toBeInTheDocument();
    expect(screen.getByText('Asignado a')).toBeInTheDocument();
    expect(screen.getAllByText('Cliente Principal').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bloqueado por')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gestionar' })).toBeInTheDocument();
    expect(screen.queryByText(/Estado: Bloqueado por Cliente Principal/i)).toBeNull();
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

    expect(screen.getByText('Sin asignación')).toBeInTheDocument();
    expect(screen.getByText('Este campo todavía no tiene responsable.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Asignar' })).toBeInTheDocument();
  });
});
