import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');

  function ModalMock({
    open,
    children,
    centered,
    getContainer,
  }: {
    open?: boolean;
    children?: React.ReactNode;
    centered?: boolean;
    getContainer?: unknown;
  }) {
    return (
      <div
        data-testid="compact-config-modal"
        data-open={String(Boolean(open))}
        data-centered={String(Boolean(centered))}
        data-getcontainer={getContainer === undefined ? 'undefined' : 'defined'}
      >
        {open ? children : null}
      </div>
    );
  }

  return {
    ...actual,
    Modal: ModalMock,
  };
});

import CompactConfigPanel from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.js';

describe('CompactConfigPanel', () => {
  it('opens the shared detail modal centered on the viewport', () => {
    render(
      <CompactConfigPanel
        title="Conexiones y persistencia"
        modalTitle="Configurar conexiones y persistencia"
      >
        <div>contenido avanzado</div>
      </CompactConfigPanel>,
    );

    expect(screen.getByRole('button', { name: 'Configurar' })).toBeVisible();
    expect(screen.getByTestId('compact-config-modal')).toHaveAttribute('data-open', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Configurar' }));

    expect(screen.getByTestId('compact-config-modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('compact-config-modal')).toHaveAttribute('data-centered', 'true');
    expect(screen.getByTestId('compact-config-modal')).toHaveAttribute('data-getcontainer', 'undefined');
    expect(screen.getByText('contenido avanzado')).toBeInTheDocument();
  });
});
