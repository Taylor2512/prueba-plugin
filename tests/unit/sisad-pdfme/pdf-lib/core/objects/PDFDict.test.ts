import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/objects/PDFDict';

describe('sisad-pdfme/pdf-lib/core/objects/PDFDict.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
