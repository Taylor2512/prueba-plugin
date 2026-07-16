import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { template2SchemasList } from '@/sisad-pdfme/ui/helper';
import * as moduleUnderTest from '@/sisad-pdfme/ui/helper';

describe('sisad-pdfme/ui/helper.ts', ()=>{
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('fetch failed');
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('falls back to schema pages when basePdf preprocessing fails', async () => {
    const result = await template2SchemasList({
      basePdf: 'https://example.invalid/bad.pdf',
      schemas: [[{ name: 'field-1', type: 'text', position: { x: 10, y: 10 }, width: 10, height: 10 }]] as any,
    } as any);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
    expect(result[0][0].id).toBeTruthy();
  });
});
