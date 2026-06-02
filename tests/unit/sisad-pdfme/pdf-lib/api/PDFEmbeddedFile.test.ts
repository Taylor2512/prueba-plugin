import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/api/PDFEmbeddedFile';

describe('sisad-pdfme/pdf-lib/api/PDFEmbeddedFile.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
