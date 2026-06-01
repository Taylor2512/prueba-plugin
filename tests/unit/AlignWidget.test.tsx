import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlignWidget from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.js';

const buildElements = (count: number) =>
  Array.from({ length: count }, (_, idx) => {
    const el = document.createElement('div');
    el.id = `schema-${idx}`;
    return el;
  });

describe('AlignWidget', () => {
  test('invokes align command with expected action', async () => {
    const user = userEvent.setup();
    const alignSelection = vi.fn();
    const distributeSelection = vi.fn();

    render(
      <AlignWidget
        activeElements={buildElements(1)}
        selectionCommands={{
          alignSelection,
          distributeSelection,
        } as any}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Alinear a la izquierda' }));
    expect(alignSelection).toHaveBeenCalledWith('left');
    expect(distributeSelection).not.toHaveBeenCalled();
  });

  test('distribute buttons require at least three selected schemas', () => {
    const alignSelection = vi.fn();
    const distributeSelection = vi.fn();

    const { rerender } = render(
      <AlignWidget
        activeElements={buildElements(2)}
        selectionCommands={{
          alignSelection,
          distributeSelection,
        } as any}
      />,
    );

    expect(screen.getByRole('button', { name: 'Distribuir horizontalmente' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Distribuir verticalmente' })).toBeDisabled();

    rerender(
      <AlignWidget
        activeElements={buildElements(3)}
        selectionCommands={{
          alignSelection,
          distributeSelection,
        } as any}
      />,
    );

    expect(screen.getByRole('button', { name: 'Distribuir horizontalmente' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Distribuir verticalmente' })).toBeEnabled();
  });
});
