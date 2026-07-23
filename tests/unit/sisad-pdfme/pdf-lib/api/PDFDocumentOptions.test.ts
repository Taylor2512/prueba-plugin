import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/PDFDocumentOptions';

describe('sisad-pdfme/pdf-lib/api/PDFDocumentOptions.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
