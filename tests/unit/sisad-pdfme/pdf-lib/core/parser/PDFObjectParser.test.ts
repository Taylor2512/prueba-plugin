import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/parser/PDFObjectParser';

describe('sisad-pdfme/pdf-lib/core/parser/PDFObjectParser.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
