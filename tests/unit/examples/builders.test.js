import { describe, expect, it } from 'vitest';
import { buildSnapshotFormValues } from '@/examples/builders.js';

describe('buildSnapshotFormValues', () => {
  it('writes values into the runtime input object by schema name', () => {
    const values = buildSnapshotFormValues({
      templateFields: [
        { indexName: 'name', type: 'text', value: 'Ada' },
        { indexName: 'count', type: 'number', value: 0 },
        { indexName: 'enabled', type: 'boolean', value: false },
        { indexName: 'empty', type: 'text', value: '' },
      ],
    });

    expect(values).toEqual([{ name: 'Ada', count: 0, enabled: false, empty: '' }]);
    expect(values[0]).not.toHaveProperty('value');
  });
});
