import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CommentsRail from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.js';

describe('CommentsRail', () => {
  it('renders comment threads and delegates add actions', () => {
    const onAdd = vi.fn();

    render(
      <CommentsRail
        onAdd={onAdd}
        items={[
          {
            id: 'comment-1',
            text: 'Revisar el owner del campo',
            authorName: 'Ventas',
            authorColor: '#2563EB',
            pageNumber: 2,
            schemaUid: 'schema-1',
            timestamp: 1700000000000,
            replies: [
              {
                id: 'reply-1',
                text: 'Ya quedó alineado',
                authorName: 'Legal',
                authorColor: '#D946EF',
                timestamp: 1700000001000,
                resolved: true,
              },
            ],
          },
        ]}
      />, 
    );

    expect(screen.getByText('Revisar el owner del campo')).toBeVisible();
    expect(screen.getByText('Campo schema-1')).toBeVisible();
    expect(screen.getByText('Página 2')).toBeVisible();
    expect(screen.getByText('Ya quedó alineado')).toBeVisible();
    expect(screen.getByText('1 hilo · 1 respuesta en la página actual')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state when there are no threads', () => {
    render(<CommentsRail items={[]} emptyTitle="Sin hilos activos" />);

    expect(screen.getAllByText('Sin hilos activos')).toHaveLength(2);
  });

  it('highlights and scrolls the active comment thread into view', () => {
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    try {
      render(
        <CommentsRail
          activeCommentId="comment-2"
          items={[
            {
              id: 'comment-1',
              text: 'Comentario anterior',
              timestamp: 1700000000000,
            },
            {
              id: 'comment-2',
              text: 'Comentario activo',
              timestamp: 1700000001000,
            },
          ]}
        />,
      );

      expect(screen.getByText('Comentario activo').closest('article')).toHaveAttribute('data-active', 'true');
      expect(scrollIntoView).toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    }
  });
});