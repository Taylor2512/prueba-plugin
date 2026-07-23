import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/PDFEmbeddedPage';

describe('sisad-pdfme/pdf-lib/api/PDFEmbeddedPage.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
