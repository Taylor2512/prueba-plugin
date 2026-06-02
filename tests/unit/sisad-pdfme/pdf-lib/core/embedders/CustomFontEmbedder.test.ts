import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/embedders/CustomFontEmbedder';

describe('sisad-pdfme/pdf-lib/core/embedders/CustomFontEmbedder.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
