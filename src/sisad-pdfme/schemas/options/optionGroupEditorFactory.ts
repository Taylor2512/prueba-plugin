import { clearSchemaRoot } from '../shared/schemaDom.js';

export type OptionGroupEditorItem = {
  optionId: string;
  label: string;
};

export type OptionGroupEditorConfig<TOption extends OptionGroupEditorItem> = {
  rootElement: HTMLElement;
  headerText: string;
  rowClassName: string;
  newInputPlaceholder: string;
  optionInputPlaceholder: (index: number, option: TOption) => string;
  createIndicator: (option: TOption, index: number) => HTMLElement;
  getOptions: () => TOption[];
  setOptions: (nextOptions: TOption[]) => void;
  createRenamedOptions: (currentOptions: TOption[], index: number, label: string) => TOption[];
  createRemovedOptions: (currentOptions: TOption[], index: number) => TOption[];
  createAddedOptions: (currentOptions: TOption[], label: string) => TOption[];
  onCommitOptions: (nextOptions: TOption[]) => void;
};

const normalizeText = (value: unknown): string => String(value || '').trim();

export const createOptionGroupEditor = <TOption extends OptionGroupEditorItem>(
  config: OptionGroupEditorConfig<TOption>,
): { render: () => void } => {
  const commitOptions = (nextOptions: TOption[]) => {
    config.setOptions(nextOptions);
    config.onCommitOptions(nextOptions);
    render();
  };

  const createAction = (action: (currentOptions: TOption[]) => TOption[]) => () => {
    commitOptions(action(config.getOptions()));
  };

  const render = () => {
    clearSchemaRoot(config.rootElement);

    const header = document.createElement('div');
    header.className = 'sisad-option-editor-header';
    header.textContent = config.headerText;
    config.rootElement.appendChild(header);

    const list = document.createElement('div');
    list.className = 'sisad-option-editor-list';

    const currentOptions = config.getOptions();

    currentOptions.forEach((option, index) => {
      const row = document.createElement('div');
      row.className = config.rowClassName;

      row.appendChild(config.createIndicator(option, index));

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = option.label;
      labelInput.placeholder = config.optionInputPlaceholder(index, option);
      labelInput.className = 'sisad-option-editor-input';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.className = 'sisad-option-editor-remove-btn';

      labelInput.addEventListener('change', createAction((currentOptions) =>
        config.createRenamedOptions(currentOptions, index, normalizeText(labelInput.value)),
      ));

      removeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        commitOptions(config.createRemovedOptions(config.getOptions(), index));
      });

      row.appendChild(labelInput);
      row.appendChild(removeBtn);
      list.appendChild(row);
    });

    config.rootElement.appendChild(list);

    const addRow = document.createElement('div');
    addRow.className = 'sisad-option-editor-add-row';

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = config.newInputPlaceholder;
    newInput.className = 'sisad-option-editor-input';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '+';
    addBtn.className = 'sisad-option-editor-add-btn';

    const doAdd = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const label = normalizeText(newInput.value);
      commitOptions(config.createAddedOptions(config.getOptions(), label));
      newInput.value = '';
    };

    addBtn.addEventListener('pointerdown', (event) => event.stopPropagation());
    addBtn.addEventListener('click', doAdd);
    newInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        doAdd(event);
      }
    });

    addRow.appendChild(newInput);
    addRow.appendChild(addBtn);
    config.rootElement.appendChild(addRow);
  };

  return { render };
};
