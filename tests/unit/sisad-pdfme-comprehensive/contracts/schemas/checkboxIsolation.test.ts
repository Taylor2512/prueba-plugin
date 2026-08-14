import { describe, expect, it, vi } from 'vitest';
import checkbox from '../../../../../src/sisad-pdfme/schemas/checkbox';

const renderCheckbox = async (schemaUid: string, onChange: ReturnType<typeof vi.fn>) => {
  const rootElement = document.createElement('div');
  await checkbox.ui({
    schema: {
      id: schemaUid,
      schemaUid,
      type: 'checkbox',
      name: schemaUid,
      content: 'false',
      position: { x: 0, y: 0 },
      width: 8,
      height: 8,
      readOnly: false,
    },
    value: 'false',
    mode: 'form',
    rootElement,
    onChange,
  } as never);
  return rootElement;
};

describe('checkbox Form interaction isolation', () => {
  it('commits one click per Form checkbox without Designer double-click timing', async () => {
    const onChange = vi.fn();
    const root = await renderCheckbox('checkbox-a', onChange);
    root.querySelector('[role="checkbox"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([{ key: 'content', value: 'true' }]);
  });

  it('does not share Form checkbox clicks between two instances', async () => {
    const firstChange = vi.fn();
    const secondChange = vi.fn();
    const first = await renderCheckbox('checkbox-a', firstChange);
    const second = await renderCheckbox('checkbox-a', secondChange);

    first.querySelector('[role="checkbox"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    second.querySelector('[role="checkbox"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(firstChange).toHaveBeenCalledTimes(1);
    expect(secondChange).toHaveBeenCalledTimes(1);
  });

  it('does not interpret first clicks from two Designer roots as one double click', async () => {
    const firstChange = vi.fn();
    const secondChange = vi.fn();
    const first = document.createElement('div');
    const second = document.createElement('div');

    const renderDesigner = async (rootElement: HTMLDivElement, onChange: ReturnType<typeof vi.fn>) => {
      await checkbox.ui({
        schema: {
          id: 'shared-id',
          schemaUid: 'shared-id',
          type: 'checkbox',
          name: 'checkbox',
          content: 'false',
          position: { x: 0, y: 0 },
          width: 8,
          height: 8,
          readOnly: false,
        },
        value: 'false',
        mode: 'designer',
        rootElement,
        onChange,
      } as never);
    };

    await renderDesigner(first, firstChange);
    await renderDesigner(second, secondChange);
    first.querySelector('[role="checkbox"]')?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    second.querySelector('[role="checkbox"]')?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    expect(firstChange).not.toHaveBeenCalled();
    expect(secondChange).not.toHaveBeenCalled();
  });
});
