import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/PDFDocument';

describe('sisad-pdfme/pdf-lib/api/PDFDocument.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
