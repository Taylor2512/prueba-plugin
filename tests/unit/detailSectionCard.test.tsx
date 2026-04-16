import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DetailSectionCard from '../../src/pdfme/ui/src/components/Designer/RightSidebar/DetailView/DetailSectionCard.js';

describe('DetailSectionCard', () => {
  it('resets the collapsed state when the reset token changes', () => {
    const { rerender } = render(
      <DetailSectionCard sectionKey="general" title="General" resetToken="schema-1">
        <div>Contenido general</div>
      </DetailSectionCard>,
    );

    const toggle = screen.getByRole('button', { name: 'General' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Contenido general')).toBeVisible();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Contenido general')).toBeNull();

    rerender(
      <DetailSectionCard sectionKey="general" title="General" resetToken="schema-2">
        <div>Contenido general</div>
      </DetailSectionCard>,
    );

    expect(screen.getByRole('button', { name: 'General' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Contenido general')).toBeVisible();
  });
});