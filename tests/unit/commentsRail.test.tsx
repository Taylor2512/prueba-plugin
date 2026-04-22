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
          },
        ]}
      />, 
    );

    expect(screen.getByText('Revisar el owner del campo')).toBeVisible();
    expect(screen.getByText('Campo schema-1')).toBeVisible();
    expect(screen.getByText('Página 2')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state when there are no threads', () => {
    render(<CommentsRail items={[]} emptyTitle="Sin hilos activos" />);

    expect(screen.getAllByText('Sin hilos activos')).toHaveLength(2);
  });
});