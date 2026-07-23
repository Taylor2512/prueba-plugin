import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/parser/PDFParser';

describe('sisad-pdfme/pdf-lib/core/parser/PDFParser.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
