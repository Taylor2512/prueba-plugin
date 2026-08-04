import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('keeps the reassign button visible when the active recipient is missing', () => {
    render(
      <OptionsContext.Provider value={{ assignment: { enabled: true }, visibility: { actions: { reassign: true } } } as any}>
        <ListViewToolbar
          {...baseProps}
          hasSchemas
          showBulkAction
          showBulkRecipientAction
          onBulkAssignRecipient={() => undefined}
          collaborationContext={{ activeRecipient: null, canEditStructure: true }}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('right-sidebar-reassign')).toBeVisible();
  });

  it('shows a disabled hint in the menu when no selection exists', async () => {
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

    expect(screen.getByTestId('right-sidebar-reassign')).toBeDisabled();
    await act(async () => {
      fireEvent.click(screen.getByTestId('right-sidebar-more'));
    });
    await waitFor(() =>
      expect(screen.getByTestId('right-sidebar-reassign-hint')).toHaveTextContent(
        'Selecciona uno o más campos',
      ),
    );
  });

  it('keeps the title row horizontal in minimal density (never stacks title/counter/actions)', () => {
    const { container } = render(
      <OptionsContext.Provider value={{ assignment: { enabled: true }, visibility: { actions: { reassign: true } } } as any}>
        <ListViewToolbar
          {...baseProps}
          densityMode="minimal"
          selectedCount={2}
          onBulkAssignRecipient={() => undefined}
        />
      </OptionsContext.Provider>,
    );

    // El header ya no apila título/contador/acciones en tres bloques verticales.
    const header = container.querySelector('.sisad-pdfme-designer-sidebar-surface-header');
    expect(header).not.toHaveClass('flex-col');
    // Título, contador y acciones conviven en la fila principal…
    expect(screen.getByTestId('right-sidebar-fields-counter')).toBeVisible();
    expect(screen.getByTestId('right-sidebar-reassign')).toBeVisible();
    // …y la búsqueda vive en la sección de controles debajo del header.
    expect(screen.getByPlaceholderText('Buscar campo o nombre')).toBeVisible();
  });
});
