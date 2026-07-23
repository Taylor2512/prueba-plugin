import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/PDFAcroComboBox';

describe('sisad-pdfme/pdf-lib/core/acroform/PDFAcroComboBox.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
