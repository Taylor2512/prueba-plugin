import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/acroform/PDFAcroCheckBox';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroCheckBox.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
