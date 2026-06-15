import type { OptionItem } from './optionTypes.js';
import {
  buildGroupWrapper,
  buildGroupContainer,
  buildGroupLabel,
  buildOptionRow,
  buildCheckboxIndicator,
  buildRadioIndicator,
  buildOptionLabel,
} from '../groupSchemaRender.js';

export type OptionGroupRuntimeParams = {
  options: OptionItem[];
  selectionMode: 'single' | 'multiple';
  selectedOptionId?: string | null;
  selectedOptionIds?: string[];
  editable?: boolean;
  color?: string;
  orientation?: 'vertical' | 'horizontal';
  spacing?: number;
  groupName?: string;
  resolveSelection?: (params: {
    option: OptionItem;
    currentSelection: {
      selectedOptionId?: string | null;
      selectedOptionIds: string[];
    };
  }) => {
    content: string;
    selectedOptionId?: string;
    selectedOptionIds?: string[];
  } | null;
  onChange?: (arg: { key: string; value: unknown } | Array<{ key: string; value: unknown }>) => void;
};

// Create a DOM runtime representation for an option-based group (radio/checkbox).
export const createOptionGroupRuntime = (params: OptionGroupRuntimeParams): HTMLDivElement => {
  const {
    options,
    selectionMode,
    selectedOptionId,
    selectedOptionIds,
    editable = false,
    color = '#1677ff',
    orientation = 'vertical',
    spacing = 3,
    groupName,
    resolveSelection,
    onChange,
  } = params;

  const wrapper = buildGroupWrapper();
  const container = buildGroupContainer({ color, gap: spacing, isHorizontal: orientation === 'horizontal' });

  if (groupName) container.appendChild(buildGroupLabel(groupName, color));

  const selectedSet = new Set(Array.isArray(selectedOptionIds) ? selectedOptionIds : []);

  options.forEach((opt) => {
    const isSelected = selectionMode === 'single' ? opt.optionId === selectedOptionId : selectedSet.has(opt.optionId);

    const row = buildOptionRow({
      color,
      isHorizontal: orientation === 'horizontal',
      editable,
      role: selectionMode === 'single' ? 'radio' : 'checkbox',
      optionId: opt.optionId,
      dataAttr: selectionMode === 'single' ? 'data-radio-group-option' : 'data-checkbox-group-option',
    });

    const indicator = selectionMode === 'single'
      ? buildRadioIndicator(color, !!isSelected)
      : buildCheckboxIndicator(color, !!isSelected);

    row.appendChild(indicator);
    row.appendChild(buildOptionLabel(opt.label || opt.optionId, color));

    if (editable && typeof onChange === 'function') {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (resolveSelection) {
          const nextSelection = resolveSelection({
            option: opt,
            currentSelection: {
              selectedOptionId,
              selectedOptionIds: Array.from(selectedSet),
            },
          });

          if (nextSelection) {
            const changes: Array<{ key: string; value: unknown }> = [];
            if ('content' in nextSelection) changes.push({ key: 'content', value: nextSelection.content });
            if ('selectedOptionId' in nextSelection) {
              changes.push({ key: 'selectedOptionId', value: nextSelection.selectedOptionId });
            }
            if ('selectedOptionIds' in nextSelection) {
              changes.push({ key: 'selectedOptionIds', value: nextSelection.selectedOptionIds });
            }
            onChange(changes);
          }
          return;
        }

        if (selectionMode === 'single') {
          onChange([
            { key: 'content', value: opt.optionId },
            { key: 'selectedOptionId', value: opt.optionId },
          ]);
          return;
        }

        // multiple
        const current = new Set(selectedSet);
        if (current.has(opt.optionId)) current.delete(opt.optionId);
        else current.add(opt.optionId);
        const next = Array.from(current);
        onChange([
          { key: 'content', value: next.join(',') },
          { key: 'selectedOptionIds', value: next },
        ]);
      });
    }

    container.appendChild(row);
  });

  wrapper.appendChild(container);
  return wrapper;
};

export default createOptionGroupRuntime;
