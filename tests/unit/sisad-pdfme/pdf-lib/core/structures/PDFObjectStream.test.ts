import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/structures/PDFObjectStream';

describe('sisad-pdfme/pdf-lib/core/structures/PDFObjectStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
