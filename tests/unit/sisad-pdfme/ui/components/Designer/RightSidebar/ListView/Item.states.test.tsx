import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Item from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item';

const baseProps = {
  value: 'Contract stage',
  schemaType: 'select',
  title: 'contract_stage',
  typeLabel: 'Lista Desplegable',
  onClick: () => {},
};

describe('Item visual states', () => {
  it('prevents accidental text selection on the row and grip', () => {
    render(<Item {...baseProps} onDelete={() => {}} />);
    const row = screen.getByTestId('right-sidebar-field-item');
    expect(row.classList.contains('select-none')).toBe(true);

    const grip = screen.getByLabelText('Reordenar campo');
    expect(grip.classList.contains('select-none')).toBe(true);
    // `touch-none` mantiene el drag por puntero/táctil sin gestos del navegador.
    expect(grip.classList.contains('touch-none')).toBe(true);
  });

  it('keeps the delete action neutral at rest (danger only on hover/focus)', () => {
    render(<Item {...baseProps} onDelete={() => {}} />);
    const del = screen.getByLabelText(/Eliminar campo/i);
    // Neutro en reposo…
    expect(del.classList.contains('text-slate-400')).toBe(true);
    expect(del.classList.contains('border-slate-200')).toBe(true);
    // …nunca rojo permanente (el rojo vive en variantes hover:/focus-visible:).
    expect(del.classList.contains('text-rose-600')).toBe(false);
    expect(del.classList.contains('border-rose-200')).toBe(false);
  });

  it('invokes delete without selecting the row', async () => {
    const onDelete = vi.fn();
    const onClick = vi.fn();
    render(<Item {...baseProps} onClick={onClick} onDelete={onDelete} />);
    const del = screen.getByLabelText(/Eliminar campo/i);
    del.click();
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('distinguishes locked from selected', () => {
    const { rerender } = render(<Item {...baseProps} readOnly />);
    const lockedRow = screen.getByTestId('right-sidebar-field-item');
    expect(lockedRow).toHaveAttribute('data-locked', 'true');
    expect(lockedRow).toHaveAttribute('data-selected', 'false');
    expect(screen.getByTestId('right-sidebar-field-badge')).toHaveAttribute('data-badge', 'readonly');

    rerender(<Item {...baseProps} selected />);
    const selectedRow = screen.getByTestId('right-sidebar-field-item');
    expect(selectedRow).toHaveAttribute('data-selected', 'true');
    expect(selectedRow).toHaveAttribute('data-locked', 'false');
  });

  it('marks hidden rows without implying selection', () => {
    render(<Item {...baseProps} hidden />);
    const row = screen.getByTestId('right-sidebar-field-item');
    expect(row).toHaveAttribute('data-hidden', 'true');
    expect(row).toHaveAttribute('data-selected', 'false');
  });
});
