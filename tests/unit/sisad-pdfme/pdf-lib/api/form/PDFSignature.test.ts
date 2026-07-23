import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/form/PDFSignature';

describe('sisad-pdfme/pdf-lib/api/form/PDFSignature.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
