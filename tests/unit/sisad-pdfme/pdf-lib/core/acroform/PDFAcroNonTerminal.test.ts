import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/PDFAcroNonTerminal';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroNonTerminal.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
