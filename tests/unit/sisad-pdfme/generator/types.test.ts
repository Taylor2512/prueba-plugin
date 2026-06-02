import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/generator/types';

describe('sisad-pdfme/generator/types.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
