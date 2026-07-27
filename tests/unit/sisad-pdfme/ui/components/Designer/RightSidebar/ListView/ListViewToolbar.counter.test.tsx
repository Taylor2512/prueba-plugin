import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { OptionsContext } from '@/sisad-pdfme/ui/contexts';
import ListViewToolbar from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar';

const baseProps = {
  searchQuery: '',
  typeFilter: 'all',
  schemaTypes: [] as { value: string; label: string }[],
  filteredCount: 11,
  totalCount: 11,
  selectedCount: 0,
  hasActiveSearch: false,
  hasSchemas: true,
  onChangeSearch: () => undefined,
  onChangeType: () => undefined,
  onStartBulk: () => undefined,
  onClearFilters: () => undefined,
  showBulkAction: true,
  showBulkRecipientAction: false,
};

const renderToolbar = (props: Partial<React.ComponentProps<typeof ListViewToolbar>>) =>
  render(
    <OptionsContext.Provider value={{ assignment: { enabled: false } } as any}>
      <ListViewToolbar {...baseProps} {...props} />
    </OptionsContext.Provider>,
  );

describe('ListViewToolbar counter (single semantic count)', () => {
  it('shows "N campos" when there is no active filter', () => {
    renderToolbar({ filteredCount: 11, totalCount: 11, hasActiveSearch: false });
    expect(screen.getByTestId('right-sidebar-fields-counter')).toHaveTextContent('11 campos');
  });

  it('uses the singular form for a single field', () => {
    renderToolbar({ filteredCount: 1, totalCount: 1, hasActiveSearch: false });
    expect(screen.getByTestId('right-sidebar-fields-counter')).toHaveTextContent('1 campo');
  });

  it('shows "F de N" when a filter is active', () => {
    renderToolbar({ filteredCount: 8, totalCount: 11, hasActiveSearch: true });
    expect(screen.getByTestId('right-sidebar-fields-counter')).toHaveTextContent('8 de 11');
  });

  it('shows "0 de N" when the filter has no matches', () => {
    renderToolbar({ filteredCount: 0, totalCount: 11, hasActiveSearch: true });
    expect(screen.getByTestId('right-sidebar-fields-counter')).toHaveTextContent('0 de 11');
  });

  it('does not duplicate the count as "F/N" or "F visibles"', () => {
    renderToolbar({ filteredCount: 8, totalCount: 11, hasActiveSearch: true });
    expect(screen.queryByText('8/11')).toBeNull();
    expect(screen.queryByText(/visibles/i)).toBeNull();
  });

  it('labels the rename menu item by selection count', async () => {
    const user = userEvent.setup();

    const single = renderToolbar({ selectedCount: 1 });
    await user.click(screen.getByTestId('right-sidebar-more'));
    expect(screen.getByTestId('right-sidebar-more-rename')).toHaveTextContent('Renombrar campo');
    single.unmount();

    const many = renderToolbar({ selectedCount: 3 });
    await user.click(screen.getByTestId('right-sidebar-more'));
    expect(screen.getByTestId('right-sidebar-more-rename')).toHaveTextContent('Renombrar 3 campos');
    many.unmount();
  });
});
