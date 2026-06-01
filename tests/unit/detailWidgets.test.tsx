import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPickerWidget } from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.js';

describe('detailWidgets ColorPickerWidget', () => {
  test('renders current value and updates from hex input', async () => {
    const onChange = vi.fn();

    render(
      <ColorPickerWidget
        value="#112233"
        onChange={onChange}
        normalizeHex={(value) => String(value)}
      />,
    );

    const hexInput = screen.getByPlaceholderText('#000000');
    fireEvent.change(hexInput, { target: { value: '#abcdef' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('#abcdef');
  });

  test('supports native color input and is accessible', async () => {
    const onChange = vi.fn();

    render(
      <ColorPickerWidget
        value="#445566"
        onChange={onChange}
        normalizeHex={(value) => String(value)}
      />,
    );

    const nativeInput = screen.getAllByLabelText('Selector nativo de color').find(
      (node) => node instanceof HTMLInputElement,
    ) as HTMLInputElement;
    expect(nativeInput).toBeInTheDocument();

    fireEvent.change(nativeInput, { target: { value: '#123456' } });
    expect(onChange).toHaveBeenCalledWith('#123456');
  });

  test('swatch palette buttons expose descriptive aria labels', () => {
    render(
      <ColorPickerWidget
        value="#000000"
        onChange={vi.fn()}
        normalizeHex={(value) => String(value)}
      />,
    );

    expect(screen.getByRole('button', { name: 'Paleta de colores' })).toBeInTheDocument();
    expect(
      screen.getAllByLabelText('Selector nativo de color').some((node) => node instanceof HTMLInputElement),
    ).toBe(true);
  });
});
