import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/embedders/PDFPageEmbedder';

describe('sisad-pdfme/pdf-lib/core/embedders/PDFPageEmbedder.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
