import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/annotation/PDFAnnotation';

describe('sisad-pdfme/pdf-lib/core/annotation/PDFAnnotation.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
