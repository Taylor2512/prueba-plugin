import { describe, expect, it } from 'vitest';
import {
  createTableEditingState,
  resetTableEditingState,
} from '../../../../src/sisad-pdfme/schemas/tables/uiRender';

describe('table editing lifecycle isolation', () => {
  it('resetting one table does not close another table instance', () => {
    const first = createTableEditingState();
    const second = createTableEditingState();
    first.body = { rowIndex: 2, colIndex: 1 };
    second.body = { rowIndex: 4, colIndex: 0 };

    resetTableEditingState(first);

    expect(first.body).toEqual({ rowIndex: -1, colIndex: -1 });
    expect(second.body).toEqual({ rowIndex: 4, colIndex: 0 });
  });
});
