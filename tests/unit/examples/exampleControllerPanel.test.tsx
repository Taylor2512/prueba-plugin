import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/sisad-pdfme/react', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@/sisad-pdfme', () => ({
  SisadPdfmeInstance: () => null,
  defineSisadPdfmeInstance: (value: unknown) => value,
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@/sisad-pdfme/react/hostSurface', () => ({
  SISAD_PDFME_HOST_SURFACE_CLASS: 'h-full min-h-0 w-full min-w-0 overflow-hidden',
}));

import { ExampleControllerPanel } from '@/examples/index.jsx';

describe('ExampleControllerPanel', () => {
  it('muestra el estado de capacidad en lugar de ocultarlo como ok genérico', async () => {
    const user = userEvent.setup();
    const controller = {
      getCapabilityState: vi.fn(() => ({
        domain: 'selection',
        supported: false,
        available: false,
        reason: 'selection-unavailable',
        methods: ['selectSchemas', 'clearSelection'],
      })),
    };

    render(<ExampleControllerPanel getController={() => controller} />);

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Estado selection' }));
    });

    expect(controller.getCapabilityState).toHaveBeenCalledWith('selection');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Estado selection: selection: no soportado · inactivo (selection-unavailable)',
    );
  });
});
