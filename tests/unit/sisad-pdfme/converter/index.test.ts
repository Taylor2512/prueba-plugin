import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/converter/index';

describe('sisad-pdfme/converter/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
