import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/embedders/PngEmbedder';

describe('sisad-pdfme/pdf-lib/core/embedders/PngEmbedder.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
