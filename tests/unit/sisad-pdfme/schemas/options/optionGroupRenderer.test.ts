import { describe, expect, it, vi, beforeEach } from 'vitest';
import { buildAddOptionButton } from '@/sisad-pdfme/schemas/groupSchemaRender.js';
import { createOptionGroupEditor } from '@/sisad-pdfme/schemas/options/optionGroupEditorFactory.js';
import { createOptionGroupRuntime } from '@/sisad-pdfme/schemas/options/optionGroupRenderer.js';

const createOption = (optionId: string, label: string) => ({ optionId, label });

describe('option group runtime/editor contracts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps the form option toggle to a single commit on a rapid double click', () => {
    const onChange = vi.fn();
    const wrapper = createOptionGroupRuntime({
      options: [createOption('option_1', 'Pendiente')],
      selectionMode: 'single',
      selectedOptionId: '',
      editable: true,
      color: '#1677ff',
      mode: 'form',
      onChange,
    });

    const row = wrapper.querySelector('[data-option-id="option_1"]') as HTMLButtonElement | null;
    expect(row).not.toBeNull();
    if (!row) return;

    row.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    expect(onChange).toHaveBeenCalledTimes(1);

    row.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('keeps the add-option button free of native title and exposes aria metadata', () => {
    const addButton = buildAddOptionButton('#1677ff', 'Convertir en grupo de casillas', 'data-checkbox-convert-to-group-btn');

    expect(addButton.getAttribute('title')).toBeNull();
    expect(addButton.getAttribute('aria-label')).toBe('Convertir en grupo de casillas');
    expect(addButton.getAttribute('data-tooltip')).toBe('Convertir en grupo de casillas');
  });

  it('renders option editor rows without native title tooltips', () => {
    const rootElement = document.createElement('div');
    const options = [createOption('option_1', 'Opción 1')];

    createOptionGroupEditor({
      rootElement,
      headerText: 'Opciones',
      rowClassName: 'sisad-option-editor-row',
      newInputPlaceholder: 'Nueva opción…',
      optionInputPlaceholder: () => 'Opción 1',
      createIndicator: () => document.createElement('span'),
      getOptions: () => options,
      setOptions: () => undefined,
      createRenamedOptions: (current, index, label) => current.map((item, optionIndex) => (
        optionIndex === index ? { ...item, label } : item
      )),
      createRemovedOptions: (current) => current,
      createAddedOptions: (current) => current,
      onCommitOptions: () => undefined,
    }).render();

    const removeButton = rootElement.querySelector('[data-testid="option-delete-button"]');
    expect(removeButton?.getAttribute('title')).toBeNull();
  });
});
