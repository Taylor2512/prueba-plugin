import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/converter/types.d';

describe('sisad-pdfme/converter/types.d.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
