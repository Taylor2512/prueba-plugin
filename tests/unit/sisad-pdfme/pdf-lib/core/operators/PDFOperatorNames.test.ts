import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/operators/PDFOperatorNames';

describe('sisad-pdfme/pdf-lib/core/operators/PDFOperatorNames.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
