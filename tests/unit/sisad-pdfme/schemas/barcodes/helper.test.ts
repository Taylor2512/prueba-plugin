import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/schemas/barcodes/helper';

describe('sisad-pdfme/schemas/barcodes/helper.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
