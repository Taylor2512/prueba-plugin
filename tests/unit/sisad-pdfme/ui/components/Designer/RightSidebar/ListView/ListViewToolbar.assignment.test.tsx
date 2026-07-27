import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

const enabledOptions = { assignment: { enabled: true }, visibility: { actions: { reassign: true } } };

describe('ListViewToolbar assignment action', () => {
  it('emits onBulkAssignRecipient when the reassign button is clicked', async () => {
    const onBulkAssignRecipient = vi.fn();
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar {...baseProps} onBulkAssignRecipient={onBulkAssignRecipient} />
      </OptionsContext.Provider>,
    );

    await userEvent.click(screen.getByTestId('right-sidebar-reassign'));
    expect(onBulkAssignRecipient).toHaveBeenCalledTimes(1);
  });

  it('shows the reassign button when a selection exists and recipients are assignable', () => {
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar
          {...baseProps}
          selectedCount={2}
          showBulkRecipientAction
          onBulkAssignRecipient={() => undefined}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('right-sidebar-reassign')).toBeVisible();
  });

  it('does not emit when the action is disabled (bulkRecipientDisabled)', async () => {
    const onBulkAssignRecipient = vi.fn();
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar
          {...baseProps}
          bulkRecipientDisabled
          onBulkAssignRecipient={onBulkAssignRecipient}
        />
      </OptionsContext.Provider>,
    );

    const button = screen.getByTestId('right-sidebar-reassign');
    expect(button).toBeDisabled();
    await userEvent.click(button).catch(() => undefined);
    expect(onBulkAssignRecipient).not.toHaveBeenCalled();
  });

  it('keeps the action visible but disabled when the handler is missing', () => {
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar {...baseProps} onBulkAssignRecipient={undefined} />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('right-sidebar-reassign')).toBeDisabled();
  });

  it('keeps the action visible but disabled when there are no assignable recipients', () => {
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar
          {...baseProps}
          selectedCount={1}
          showBulkRecipientAction={false}
          onBulkAssignRecipient={() => undefined}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('right-sidebar-reassign')).toBeDisabled();
  });

  it('hides the action when collaboration forbids structure edits', () => {
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar
          {...baseProps}
          collaborationContext={{ activeRecipient: { id: 'r', name: 'R' }, canEditStructure: false }}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.queryByTestId('right-sidebar-reassign')).toBeNull();
  });

  it('keeps the action visible but disabled when no selection exists', () => {
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar {...baseProps} selectedCount={0} showBulkRecipientAction={false} />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('right-sidebar-reassign')).toBeDisabled();
  });

  it('keeps an accessible label for the reassign intent', () => {
    render(
      <OptionsContext.Provider value={enabledOptions as any}>
        <ListViewToolbar
          {...baseProps}
          hasSchemas
          showBulkAction
          showBulkRecipientAction
          onBulkAssignRecipient={() => undefined}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('right-sidebar-reassign')).toHaveAttribute(
      'aria-label',
      'Reasignar responsable',
    );
  });
});
