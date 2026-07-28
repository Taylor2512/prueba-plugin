import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DetailSectionCard from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard';

const renderCard = (props: Record<string, unknown> = {}) =>
  render(
    <DetailSectionCard sectionKey="identity" title="Información del campo" description="Nombre visible y metadatos." {...props}>
      <div>Contenido</div>
    </DetailSectionCard>,
  );

const head = () => document.querySelector('.sisad-pdfme-designer-detail-section-card-head') as HTMLElement;
const body = () => document.querySelector('.sisad-pdfme-designer-detail-section-card-body') as HTMLElement;

/**
 * Una sola superficie por sección: el encabezado desplegable no dibuja su propia
 * caja dentro de la tarjeta (docs/03-designer/12-inspector-taxonomy.md §6).
 */
describe('DetailSectionCard surface', () => {
  it('el desplegable no dibuja borde ni sombra propios', () => {
    renderCard();
    const classes = head().className;
    // `border-0` es obligatorio: sin preflight de Tailwind, un <button> sin
    // borde declarado hereda el `2px outset` del navegador.
    expect(classes).toMatch(/(^|\s)border-0(\s|$)/);
    expect(classes).not.toMatch(/(^|\s)border-(?!0)/);
    expect(classes).not.toMatch(/shadow-\[/);
    expect(classes).not.toMatch(/(^|\s)bg-white(\s|$)/);
  });

  it('la sección se separa por fondo y sombra, no por una línea', () => {
    renderCard();
    const card = screen.getByTestId('detail-section-info');
    expect(card.className).toMatch(/(^|\s)border-0(\s|$)/);
    expect(card.className).not.toMatch(/(^|\s)border-(?!0)/);
    expect(card.className).toMatch(/bg-white/);
    expect(card.className).toMatch(/shadow-\[/);
    expect(card.className).toMatch(/rounded-\[0\.9rem\]/);
  });

  it('conserva el contrato accesible del desplegable', () => {
    renderCard({ defaultCollapsed: true });
    const button = screen.getByRole('button', { name: 'Expandir sección Información del campo' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'identity-body');
  });

  it('la sección colapsada no reserva espacio en el cuerpo', () => {
    renderCard({ defaultCollapsed: true });
    expect(body().className).toMatch(/h-0/);
    expect(body().className).toMatch(/p-0/);
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });

  it('la sección abierta recupera el padding del cuerpo', () => {
    renderCard();
    expect(body().className).not.toMatch(/h-0/);
    expect(body().className).toMatch(/px-2/);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });
});
