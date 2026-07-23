import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/structures/PDFPageTree';

describe('sisad-pdfme/pdf-lib/core/structures/PDFPageTree.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
