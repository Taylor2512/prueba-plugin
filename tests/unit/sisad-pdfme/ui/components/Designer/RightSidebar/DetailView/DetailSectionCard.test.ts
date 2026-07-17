import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
