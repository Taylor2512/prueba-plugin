import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Item from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx', () => {
  it('exposes explicit selection state without relying on owner accent', () => {
    render(
      <Item
        value="Contract stage"
        schemaType="select"
        title="contract_stage"
        typeLabel="Select"
        selected
        accentColor="#2563eb"
        onClick={() => {}}
      />,
    );

    const row = screen.getByTestId('right-sidebar-field-item');

    expect(row).toHaveAttribute('data-selected', 'true');
    expect(row).toHaveAttribute('data-schema-owner-color', '#2563eb');
    expect(screen.getByTestId('right-sidebar-field-label')).toHaveTextContent('Contract stage');
  });
});
