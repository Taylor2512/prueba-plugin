import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/generator/constants';

describe('sisad-pdfme/generator/constants.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
