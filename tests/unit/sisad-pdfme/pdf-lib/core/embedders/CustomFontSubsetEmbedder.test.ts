import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/embedders/CustomFontSubsetEmbedder';

describe('sisad-pdfme/pdf-lib/core/embedders/CustomFontSubsetEmbedder.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
