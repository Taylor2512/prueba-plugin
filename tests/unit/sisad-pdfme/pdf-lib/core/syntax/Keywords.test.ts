import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/syntax/Keywords';

describe('sisad-pdfme/pdf-lib/core/syntax/Keywords.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
