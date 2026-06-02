import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/acroform/PDFAcroListBox';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroListBox.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
