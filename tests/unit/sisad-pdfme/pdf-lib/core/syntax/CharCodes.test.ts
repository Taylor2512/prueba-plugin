import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/syntax/CharCodes';

describe('sisad-pdfme/pdf-lib/core/syntax/CharCodes.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
