import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { OptionsContext } from '@/sisad-pdfme/ui/contexts';
import ListViewToolbar from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar';

const baseProps = {
  searchQuery: '',
  typeFilter: 'all',
  schemaTypes: [],
  filteredCount: 0,
  totalCount: 0,
  selectedCount: 1,
  hasActiveSearch: false,
  hasSchemas: true,
  onChangeSearch: () => undefined,
  onChangeType: () => undefined,
  onStartBulk: () => undefined,
  onClearFilters: () => undefined,
  showBulkAction: true,
  showBulkRecipientAction: true,
  collaborationContext: {
    activeRecipient: { id: 'recipient-1', name: 'Recipient 1' },
    canEditStructure: true,
  },
};

describe('ListViewToolbar visibility', () => {
  it('hides the reassign button when visibility.actions.reassign is false', () => {
    render(
      <OptionsContext.Provider value={{ assignment: { enabled: true }, visibility: { actions: { reassign: false } } } as any}>
        <ListViewToolbar {...baseProps} />
      </OptionsContext.Provider>,
    );

    expect(screen.queryByTestId('right-sidebar-reassign')).toBeNull();
  });

  it('hides the reassign button when assignment.enabled is false', () => {
    render(
      <OptionsContext.Provider value={{ assignment: { enabled: false }, visibility: { actions: { reassign: true } } } as any}>
        <ListViewToolbar {...baseProps} />
      </OptionsContext.Provider>,
    );

    expect(screen.queryByTestId('right-sidebar-reassign')).toBeNull();
  });

  it('hides the reassign button when the active recipient is missing', () => {
    render(
      <OptionsContext.Provider value={{ assignment: { enabled: true }, visibility: { actions: { reassign: true } } } as any}>
        <ListViewToolbar
          {...baseProps}
          collaborationContext={{ activeRecipient: null, canEditStructure: true }}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.queryByTestId('right-sidebar-reassign')).toBeNull();
  });

  it('shows a disabled hint in the menu when no selection exists', async () => {
    const user = userEvent.setup();
    render(
      <OptionsContext.Provider value={{ assignment: { enabled: true }, visibility: { actions: { reassign: true }, modals: { assignment: true } } } as any}>
        <ListViewToolbar
          {...baseProps}
          selectedCount={0}
          showBulkRecipientAction={false}
          onBulkAssignRecipient={() => undefined}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.queryByTestId('right-sidebar-reassign')).toBeNull();
    await user.click(screen.getByTestId('right-sidebar-more'));
    expect(await screen.findByTestId('right-sidebar-reassign-hint')).toHaveTextContent('Selecciona campos');
  });
});
