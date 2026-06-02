import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/acroform/PDFAcroChoice';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroChoice.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
