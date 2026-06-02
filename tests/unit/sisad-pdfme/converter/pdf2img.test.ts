import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/converter/pdf2img';

describe('sisad-pdfme/converter/pdf2img.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
