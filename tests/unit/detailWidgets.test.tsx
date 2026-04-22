import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPickerWidget } from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.js';

describe('ColorPickerWidget', () => {
  it('keeps the text input and native picker in sync with the change handler', () => {
    const onChange = vi.fn();

    render(
      <ColorPickerWidget
        value="#123456"
        onChange={onChange}
        normalizeHex={(value) => String(value)}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('#000000'), { target: { value: '#abcdef' } });
    const nativeInput = screen
      .getAllByLabelText('Selector nativo de color')
      .find((element) => element.tagName === 'INPUT');

    expect(nativeInput).toBeDefined();

    fireEvent.change(nativeInput as HTMLInputElement, { target: { value: '#654321' } });

    expect(screen.getByRole('button', { name: 'Paleta de colores' })).toBeVisible();
    expect(onChange).toHaveBeenNthCalledWith(1, '#abcdef');
    expect(onChange).toHaveBeenNthCalledWith(2, '#654321');
  });
});