import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/structures/PDFFlateStream';

describe('sisad-pdfme/pdf-lib/core/structures/PDFFlateStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
