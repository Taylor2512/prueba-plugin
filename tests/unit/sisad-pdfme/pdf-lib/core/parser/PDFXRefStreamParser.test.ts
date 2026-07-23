import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/parser/PDFXRefStreamParser';

describe('sisad-pdfme/pdf-lib/core/parser/PDFXRefStreamParser.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
