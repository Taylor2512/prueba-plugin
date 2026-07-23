import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/PDFImage';

describe('sisad-pdfme/pdf-lib/api/PDFImage.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
