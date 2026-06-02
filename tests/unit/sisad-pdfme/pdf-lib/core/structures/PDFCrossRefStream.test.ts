import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/structures/PDFCrossRefStream';

describe('sisad-pdfme/pdf-lib/core/structures/PDFCrossRefStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
