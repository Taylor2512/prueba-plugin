import { describe, it, expect } from 'vitest';
import type { Template } from '@sisad-pdfme/common';
import { createDefaultTemplate } from '@/sisad-pdfme/templates/createDefaultTemplate';

describe('createDefaultTemplate', () => {
  it('reproduces the default contract (390x400, padding 12, one empty page)', () => {
    const t = createDefaultTemplate();
    expect(t.basePdf).toEqual({ width: 390, height: 400, padding: [12, 12, 12, 12] });
    expect(t.schemas).toEqual([[]]);
  });

  it('honors a custom pageSize and padding', () => {
    const t = createDefaultTemplate({ pageSize: { width: 595, height: 842 }, padding: [0, 0, 0, 0] });
    expect(t.basePdf).toEqual({ width: 595, height: 842, padding: [0, 0, 0, 0] });
  });

  it('uses explicit basePdf over pageSize/padding', () => {
    const t = createDefaultTemplate({ basePdf: 'data:application/pdf;base64,AAA', pageSize: { width: 1, height: 1 } });
    expect(t.basePdf).toBe('data:application/pdf;base64,AAA');
  });

  it('uses provided schema pages', () => {
    const schemas = [[{ name: 'a', type: 'text' }]] as Template['schemas'];
    const t = createDefaultTemplate({ schemas });
    expect(t.schemas).toBe(schemas);
  });
});
