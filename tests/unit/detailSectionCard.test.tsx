import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DetailSectionCard from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.js';

describe('DetailSectionCard', () => {
  it('toggles the collapsed state and keeps the content mounted only when expanded', () => {
    render(
      <DetailSectionCard sectionKey="general" title="General">
        <div>Contenido general</div>
      </DetailSectionCard>,
    );

    const toggle = screen.getByRole('button', { name: /General/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Contenido general')).toBeVisible();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Contenido general')).toBeNull();
  });
});
