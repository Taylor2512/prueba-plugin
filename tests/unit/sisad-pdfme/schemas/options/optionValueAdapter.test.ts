import { describe, expect, it } from 'vitest';
import { buildCheckboxToGroupPatch } from '@/sisad-pdfme/schemas/options/optionValueAdapter.js';

describe('sisad-pdfme/schemas/options/optionValueAdapter.ts', () => {
  it('builds a checkbox to checkboxGroup patch without regenerating identity fields', () => {
    const patch = buildCheckboxToGroupPatch({ width: 42 }, true);
    const keys = patch.map((entry) => entry.key);

    expect(keys).toContain('type');
    expect(keys).toContain('groupName');
    expect(keys).toContain('groupId');
    expect(keys).toContain('lockedAsGroup');
    expect(keys).toContain('orientation');
    expect(keys).toContain('spacing');
    expect(keys).toContain('options');
    expect(keys).toContain('selectedOptionIds');
    expect(keys).toContain('__designer.group.groupId');
    expect(keys).not.toContain('schemaUid');
    expect(keys).not.toContain('ownerRecipientId');
    expect(keys).not.toContain('recipientId');

    expect(patch.find((entry) => entry.key === 'type')?.value).toBe('checkboxGroup');
    expect(patch.find((entry) => entry.key === 'content')?.value).toBe('option_1');
    expect(patch.find((entry) => entry.key === 'selectedOptionIds')?.value).toEqual(['option_1']);
    expect(patch.find((entry) => entry.key === 'width')?.value).toBe(55);
  });

  it('builds an unchecked patch with empty selection', () => {
    const patch = buildCheckboxToGroupPatch({}, false);

    expect(patch.find((entry) => entry.key === 'content')?.value).toBe('');
    expect(patch.find((entry) => entry.key === 'selectedOptionIds')?.value).toEqual([]);
    expect(patch.find((entry) => entry.key === 'options')?.value).toHaveLength(2);
  });
});
