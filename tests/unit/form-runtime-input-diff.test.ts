import { describe, expect, it } from 'vitest';
import { collectChangedInputs } from '../../src/sisad-pdfme/ui/Form';

describe('collectChangedInputs', () => {
  it('returns no changes when inputs are identical', () => {
    const previous = [{ firstName: 'Ada', lastName: 'Lovelace' }];
    const next = [{ firstName: 'Ada', lastName: 'Lovelace' }];

    expect(collectChangedInputs(previous, next)).toEqual([]);
  });

  it('detects updates, removals and new fields', () => {
    const previous = [
      { firstName: 'Ada', lastName: 'Lovelace', city: 'London' },
      { company: 'Analytical Engines' },
    ];
    const next = [
      { firstName: 'Ada', lastName: 'Byron' },
      { company: 'Analytical Engines', role: 'Mathematician' },
    ];

    expect(collectChangedInputs(previous, next)).toEqual([
      { index: 0, name: 'lastName', value: 'Byron' },
      { index: 0, name: 'city', value: undefined },
      { index: 1, name: 'role', value: 'Mathematician' },
    ]);
  });
});
