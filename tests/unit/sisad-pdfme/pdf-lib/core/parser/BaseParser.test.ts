import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/parser/BaseParser';

describe('sisad-pdfme/pdf-lib/core/parser/BaseParser.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
