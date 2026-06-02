import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/objects/PDFInvalidObject';

describe('sisad-pdfme/pdf-lib/core/objects/PDFInvalidObject.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
