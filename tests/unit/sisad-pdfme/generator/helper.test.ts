import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/generator/helper';

describe('sisad-pdfme/generator/helper.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
