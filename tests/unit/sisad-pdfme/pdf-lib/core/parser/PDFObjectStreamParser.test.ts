import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/parser/PDFObjectStreamParser';

describe('sisad-pdfme/pdf-lib/core/parser/PDFObjectStreamParser.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
