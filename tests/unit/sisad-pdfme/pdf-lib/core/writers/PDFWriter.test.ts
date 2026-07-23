import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/writers/PDFWriter';

describe('sisad-pdfme/pdf-lib/core/writers/PDFWriter.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
