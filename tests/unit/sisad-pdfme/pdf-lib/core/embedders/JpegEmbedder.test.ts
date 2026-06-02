import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/embedders/JpegEmbedder';

describe('sisad-pdfme/pdf-lib/core/embedders/JpegEmbedder.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
