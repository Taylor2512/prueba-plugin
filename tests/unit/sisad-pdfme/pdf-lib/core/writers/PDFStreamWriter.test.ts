import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/writers/PDFStreamWriter';

describe('sisad-pdfme/pdf-lib/core/writers/PDFStreamWriter.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
