import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/generator/index';

describe('sisad-pdfme/generator/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
