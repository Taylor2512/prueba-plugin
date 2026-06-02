import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/converter/img2pdf';

describe('sisad-pdfme/converter/img2pdf.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
