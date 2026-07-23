import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/PDFAcroText';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroText.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
