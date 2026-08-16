import { clearSchemaRoot } from '@sisad-pdfme/schemas/shared/schemaDom';
import { createOptionIndicatorElement, type OptionIndicatorShape } from '@sisad-pdfme/schemas/options/optionIndicator';
import { markInspectorInteractive, stopInspectorPointerEvent } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';
import { normalizeOptionText } from '@sisad-pdfme/schemas/options/optionModel';

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

export type CreateOptionGroupOptionsEditorConfig<TOption extends OptionGroupEditorItem> = Omit<
  OptionGroupEditorConfig<TOption>,
  'createIndicator'
> & {
  indicatorShape: OptionIndicatorShape;
  indicatorColor: string;
  indicatorSize?: number;
};

const normalizeOptionGroupEditorText = normalizeOptionText;

const joinClassNames = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');

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
    config.rootElement.setAttribute('data-testid', 'detail-options-section');
    markInspectorInteractive(config.rootElement);

    const header = document.createElement('div');
    header.className = joinClassNames(
      'sisad-option-editor-header',
      'mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
    );
    header.textContent = config.headerText;
    config.rootElement.appendChild(header);

    const list = document.createElement('div');
    list.className = joinClassNames(
      'sisad-option-editor-list',
      'mb-2 flex max-h-[220px] flex-col gap-1.5 overflow-y-auto pr-0.5',
    );

    const currentOptions = config.getOptions();

    currentOptions.forEach((option, index) => {
      const row = document.createElement('div');
      row.className = joinClassNames(
        config.rowClassName,
        'grid items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-1.5 py-1 shadow-sm transition-colors hover:border-slate-300',
      );
      row.style.gridTemplateColumns = '16px minmax(0, 1fr) 26px';
      row.setAttribute('data-testid', 'option-row');
      markInspectorInteractive(row);

      row.appendChild(config.createIndicator(option, index));

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = option.label;
      labelInput.placeholder = config.optionInputPlaceholder(index, option);
      labelInput.className = joinClassNames(
        'sisad-option-editor-input',
        'w-full min-w-0 rounded-md border-0 bg-transparent px-1.5 py-1 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500/40',
      );
      labelInput.setAttribute('data-testid', 'option-label-input');
      labelInput.setAttribute('aria-label', `Opción ${index + 1}`);
      labelInput.addEventListener('pointerdown', stopInspectorPointerEvent);
      labelInput.addEventListener('mousedown', stopInspectorPointerEvent);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.className = joinClassNames(
        'sisad-option-editor-remove-btn',
        'inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-[16px] leading-none text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-40',
      );
      removeBtn.setAttribute('data-testid', 'option-delete-button');
      removeBtn.setAttribute('aria-label', `Eliminar opción ${index + 1}`);
      removeBtn.addEventListener('pointerdown', stopInspectorPointerEvent);
      removeBtn.addEventListener('mousedown', stopInspectorPointerEvent);

      labelInput.addEventListener('change', createAction((currentOptions) =>
        config.createRenamedOptions(currentOptions, index, normalizeOptionGroupEditorText(labelInput.value)),
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
    addRow.className = joinClassNames(
      'sisad-option-editor-add-row',
      'grid items-center gap-1.5 [grid-template-columns:1fr_auto]',
    );

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = config.newInputPlaceholder;
    newInput.className = joinClassNames(
      'sisad-option-editor-input',
      'w-full min-w-0 rounded-lg border border-dashed border-slate-300 bg-white/85 px-2 py-1 text-[12px] text-slate-700 outline-none placeholder:text-slate-400 focus-visible:border-solid focus-visible:ring-2 focus-visible:ring-sky-500/40',
    );
    newInput.setAttribute('data-testid', 'option-new-input');
    newInput.addEventListener('pointerdown', stopInspectorPointerEvent);
    newInput.addEventListener('mousedown', stopInspectorPointerEvent);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = joinClassNames(
      'sisad-option-editor-add-btn',
      'inline-flex h-[26px] flex-none items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-sky-200 bg-sky-50 px-2.5 text-[11px] font-semibold text-sky-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40',
    );
    addBtn.setAttribute('data-testid', 'option-add-button');
    addBtn.setAttribute('aria-label', 'Agregar opción');
    const addIcon = document.createElement('span');
    addIcon.textContent = '+';
    addIcon.setAttribute('aria-hidden', 'true');
    addIcon.className = 'text-[14px] font-bold leading-none';
    const addLabel = document.createTextNode('Agregar opción');
    addBtn.appendChild(addIcon);
    addBtn.appendChild(addLabel);

    const doAdd = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const label = normalizeOptionGroupEditorText(newInput.value);
      commitOptions(config.createAddedOptions(config.getOptions(), label));
      newInput.value = '';
    };

    addBtn.addEventListener('pointerdown', stopInspectorPointerEvent);
    addBtn.addEventListener('mousedown', stopInspectorPointerEvent);
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

export const createOptionGroupOptionsEditor = <TOption extends OptionGroupEditorItem>(
  config: CreateOptionGroupOptionsEditorConfig<TOption>,
): { render: () => void } =>
  createOptionGroupEditor<TOption>({
    ...config,
    createIndicator: (_option, index) =>
      createOptionIndicatorElement({
        shape: config.indicatorShape,
        checked: false,
        color: config.indicatorColor,
        mode: 'designer',
        size: config.indicatorSize ?? (config.indicatorShape === 'circle' ? 18 : 16),
        readOnly: true,
        disabled: true,
      }),
  });
