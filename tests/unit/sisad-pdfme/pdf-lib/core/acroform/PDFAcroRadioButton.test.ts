import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/acroform/PDFAcroRadioButton';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroRadioButton.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
