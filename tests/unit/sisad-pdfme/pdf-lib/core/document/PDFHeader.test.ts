import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/document/PDFHeader';

describe('sisad-pdfme/pdf-lib/core/document/PDFHeader.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
