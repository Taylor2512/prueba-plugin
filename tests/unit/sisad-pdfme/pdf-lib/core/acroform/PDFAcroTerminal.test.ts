import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/acroform/PDFAcroTerminal';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroTerminal.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
