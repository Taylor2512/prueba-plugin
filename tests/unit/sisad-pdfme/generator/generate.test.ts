import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/generator/generate';

describe('sisad-pdfme/generator/generate.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
