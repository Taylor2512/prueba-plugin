import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/PDFAcroButton';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroButton.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
