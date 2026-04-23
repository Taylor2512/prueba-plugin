import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import type { Schema } from '@sisad-pdfme/common';
import SchemaDropSetupModal from '../../src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.js';

const baseSchema = {
  name: 'tmp',
  type: 'text',
  position: { x: 0, y: 0 },
  width: 40,
  height: 10,
} as Schema;

describe('SchemaDropSetupModal', () => {
  it('disables confirmation for blank or duplicate variable name', () => {
    const onConfirm = vi.fn();
    const onChange = vi.fn();

    const { rerender } = render(
      <SchemaDropSetupModal
        open
        draft={{
          schema: baseSchema,
          position: { x: 12, y: 16 },
          name: 'texto_01',
          ownerRecipientId: '',
          width: 40,
          height: 10,
        }}
        existingNames={['texto_01']}
        recipients={[]}
        onChange={onChange}
        onCancel={() => undefined}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('button', { name: 'Crear campo' })).toBeDisabled();

    rerender(
      <SchemaDropSetupModal
        open
        draft={{
          schema: baseSchema,
          position: { x: 12, y: 16 },
          name: '',
          ownerRecipientId: '',
          width: 40,
          height: 10,
        }}
        existingNames={[]}
        recipients={[]}
        onChange={onChange}
        onCancel={() => undefined}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('button', { name: 'Crear campo' })).toBeDisabled();
  });

  it('allows confirmation and propagates draft updates when inputs are valid', () => {
    const onConfirm = vi.fn();
    const onChange = vi.fn();

    render(
      <SchemaDropSetupModal
        open
        draft={{
          schema: baseSchema,
          position: { x: 12, y: 16 },
          name: 'texto_02',
          ownerRecipientId: 'user-1',
          width: 40,
          height: 10,
        }}
        existingNames={['texto_01']}
        recipients={[{ id: 'user-1', name: 'Usuario 1' }]}
        onChange={onChange}
        onCancel={() => undefined}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('button', { name: 'Crear campo' })).toBeEnabled();

    fireEvent.change(screen.getByPlaceholderText('texto_01'), { target: { value: 'texto_03' } });
    expect(onChange).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Crear campo' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('requires recipient when collaborative recipient list exists', () => {
    render(
      <SchemaDropSetupModal
        open
        draft={{
          schema: baseSchema,
          position: { x: 12, y: 16 },
          name: 'texto_04',
          ownerRecipientId: '',
          width: 40,
          height: 10,
        }}
        existingNames={[]}
        recipients={[{ id: 'user-1', name: 'Usuario 1' }]}
        onChange={() => undefined}
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Crear campo' })).toBeDisabled();
    expect(screen.getByText('Selecciona un destinatario.')).toBeInTheDocument();
  });

  it('treats variable name duplicates as case-insensitive', () => {
    render(
      <SchemaDropSetupModal
        open
        draft={{
          schema: baseSchema,
          position: { x: 12, y: 16 },
          name: 'Texto_05',
          ownerRecipientId: '',
          width: 40,
          height: 10,
        }}
        existingNames={['texto_05']}
        recipients={[]}
        onChange={() => undefined}
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Crear campo' })).toBeDisabled();
    expect(screen.getByText('El nombre ya existe en esta página.')).toBeInTheDocument();
  });
});
