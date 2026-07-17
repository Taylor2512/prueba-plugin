import { describe, expect, it } from 'vitest';
import { buildCheckboxToGroupPatch, resolveSelectedOptionId } from '@/sisad-pdfme/schemas/options/optionValueAdapter';

describe('option value adapter', () => {
  it('convierte checkbox a checkboxGroup preservando ancho mínimo y selección', () => {
    const patch = buildCheckboxToGroupPatch({ width: 30 }, true);
    const values = Object.fromEntries(patch.map(({ key, value }) => [key, value]));

    expect(values.type).toBe('checkboxGroup');
    expect(values.width).toBe(55);
    expect(values.lockedAsGroup).toBe(true);
    expect(values.orientation).toBe('vertical');
    expect(values.selectedOptionIds).toEqual(['option_1']);
    expect((values.options as any[])).toHaveLength(2);
  });

  it('checkbox unchecked genera grupo sin selección', () => {
    const values = Object.fromEntries(buildCheckboxToGroupPatch({ width: 80 }, false).map(({ key, value }) => [key, value]));
    expect(values.width).toBe(80);
    expect(values.content).toBe('');
    expect(values.selectedOptionIds).toEqual([]);
  });

  it('resuelve selección por optionId o value', () => {
    const options = [{ optionId: 'one', label: 'Uno', value: '1' }] as any;
    expect(resolveSelectedOptionId('one', options)).toBe('one');
    expect(resolveSelectedOptionId('1', options)).toBe('one');
  });
});
