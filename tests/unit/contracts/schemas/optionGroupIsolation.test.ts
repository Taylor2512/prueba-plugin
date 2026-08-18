import { describe, expect, it, vi } from 'vitest';
import { createOptionGroupRuntime } from '../../../../src/sisad-pdfme/schemas/options/optionGroupRenderer';

const options = [
  { optionId: 'one', label: 'One' },
  { optionId: 'two', label: 'Two' },
];

const clickFirstOption = (root: HTMLDivElement) => {
  const option = root.querySelector<HTMLButtonElement>('[data-radio-group-option]');
  expect(option).not.toBeNull();
  option?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
};

describe('option group Form interaction isolation', () => {
  it('commits every rapid Form click instead of using Designer double-click timing', () => {
    const onChange = vi.fn();
    const root = createOptionGroupRuntime({
      options,
      selectionMode: 'single',
      mode: 'form',
      editable: true,
      schema: { schemaUid: 'group-a' },
      onChange,
    });

    clickFirstOption(root);
    clickFirstOption(root);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[0][0]).toEqual([
      { key: 'content', value: 'one' },
      { key: 'selectedOptionId', value: 'one' },
    ]);
  });

  it('does not share Form commits between two groups with the same option ids', () => {
    const firstChange = vi.fn();
    const secondChange = vi.fn();
    const first = createOptionGroupRuntime({
      options,
      selectionMode: 'single',
      mode: 'form',
      editable: true,
      schema: { schemaUid: 'group-a' },
      onChange: firstChange,
    });
    const second = createOptionGroupRuntime({
      options,
      selectionMode: 'single',
      mode: 'form',
      editable: true,
      schema: { schemaUid: 'group-b' },
      onChange: secondChange,
    });

    clickFirstOption(first);
    clickFirstOption(second);

    expect(firstChange).toHaveBeenCalledTimes(1);
    expect(secondChange).toHaveBeenCalledTimes(1);
  });
});
