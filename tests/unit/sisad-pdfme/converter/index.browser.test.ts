import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/converter/index.browser';

describe('sisad-pdfme/converter/index.browser.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
