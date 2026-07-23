import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/operators/PDFOperator';

describe('sisad-pdfme/pdf-lib/core/operators/PDFOperator.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
