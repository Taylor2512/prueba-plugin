import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OptionsContext } from '@/sisad-pdfme/ui/contexts';
import ListViewToolbar from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar';

const schemaTypes = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'text', label: 'Texto' },
  { value: 'attachment', label: 'Adjunto' },
  { value: 'note', label: 'Nota' },
];

const baseProps = {
  searchQuery: '',
  typeFilter: 'all',
  schemaTypes,
  filteredCount: 4,
  totalCount: 4,
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

const renderToolbar = (props: Partial<React.ComponentProps<typeof ListViewToolbar>> = {}) =>
  render(
    <OptionsContext.Provider value={{ assignment: { enabled: false } } as any}>
      <ListViewToolbar {...baseProps} {...props} />
    </OptionsContext.Provider>,
  );

describe('ListViewToolbar type filter (accessible controlled select)', () => {
  it('renders a combobox button instead of a native <select>', () => {
    const { container } = renderToolbar();
    const trigger = screen.getByTestId('right-sidebar-fields-type-filter');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // Ya no existe el <select> nativo (menú oscuro macOS que salía del panel).
    expect(container.querySelector('select')).toBeNull();
  });

  it('opens a listbox with localized options and selects one', async () => {
    const user = userEvent.setup();
    const onChangeType = vi.fn();
    renderToolbar({ onChangeType });

    await user.click(screen.getByTestId('right-sidebar-fields-type-filter'));

    const listbox = await screen.findByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(within(listbox).getByText('Adjunto')).toBeVisible();
    expect(within(listbox).getByText('Nota')).toBeVisible();
    // No hay etiquetas crudas en inglés en el filtro.
    expect(within(listbox).queryByText('Attachment')).toBeNull();

    await user.click(within(listbox).getByText('Adjunto'));
    expect(onChangeType).toHaveBeenCalledWith('attachment');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes the listbox with Escape', async () => {
    const user = userEvent.setup();
    renderToolbar();

    await user.click(screen.getByTestId('right-sidebar-fields-type-filter'));
    expect(await screen.findByRole('listbox')).toBeVisible();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
