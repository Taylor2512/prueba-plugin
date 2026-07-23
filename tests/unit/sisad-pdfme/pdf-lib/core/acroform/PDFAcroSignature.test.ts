import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/PDFAcroSignature';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroSignature.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
