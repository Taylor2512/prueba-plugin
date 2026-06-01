import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailHeaderCard from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.js';
import type { SchemaForUI } from '../../src/sisad-pdfme/common/index.js';

const schema = {
  id: 'schema-1',
  type: 'text',
  name: 'cliente_nombre',
  content: 'Cliente',
  position: { x: 10, y: 12 },
  width: 80,
  height: 20,
} as unknown as SchemaForUI;

describe('DetailHeaderCard', () => {
  test('renders summary and back action', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(<DetailHeaderCard activeSchema={schema} onBack={onBack} backTooltip="Volver" />);

    const backButton = screen.getByRole('button', { name: 'Volver' });
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('renders overflow indicator when tags exceed maxVisibleTags', () => {
    render(
      <DetailHeaderCard
        activeSchema={schema}
        tags={[
          { label: 'tag-1', color: 'default' },
          { label: 'tag-2', color: 'default' },
          { label: 'tag-3', color: 'default' },
        ]}
        maxVisibleTags={1}
      />,
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
