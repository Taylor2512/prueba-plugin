import React from 'react';
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DetailSectionCard from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx', ()=>{
  it('renders a high-contrast section title in the inspector', ()=>{
    render(React.createElement(
      DetailSectionCard,
      { sectionKey: 'identity', title: 'Información del campo', description: 'Nombre visible y metadatos.' },
      React.createElement('div', null, 'Contenido'),
    ));

    expect(screen.getByText('Información del campo')).toHaveClass('text-slate-950');
    expect(screen.getByText('Nombre visible y metadatos.')).toHaveClass('text-slate-600');
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('preserves the expanded state across rerenders and only resets on resetToken changes', async () => {
    const { rerender } = render(
      React.createElement(
        DetailSectionCard,
        {
          sectionKey: 'identity',
          title: 'Información del campo',
          description: 'Nombre visible y metadatos.',
          defaultCollapsed: true,
          resetToken: 'schema-1',
        },
        React.createElement('div', null, 'Contenido'),
      ),
    );

    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expandir sección Información del campo' }));
    expect(screen.getByText('Contenido')).toBeInTheDocument();

    rerender(
      React.createElement(
        DetailSectionCard,
        {
          sectionKey: 'identity',
          title: 'Información del campo',
          description: 'Nombre visible y metadatos actualizados.',
          defaultCollapsed: true,
          resetToken: 'schema-1',
        },
        React.createElement('div', null, 'Contenido actualizado'),
      ),
    );

    expect(screen.getByText('Contenido actualizado')).toBeInTheDocument();

    rerender(
      React.createElement(
        DetailSectionCard,
        {
          sectionKey: 'identity',
          title: 'Información del campo',
          description: 'Nombre visible y metadatos actualizados.',
          defaultCollapsed: true,
          resetToken: 'schema-2',
        },
        React.createElement('div', null, 'Contenido final'),
      ),
    );

    await waitFor(() => {
      expect(screen.queryByText('Contenido final')).not.toBeInTheDocument();
    });
  });
});
