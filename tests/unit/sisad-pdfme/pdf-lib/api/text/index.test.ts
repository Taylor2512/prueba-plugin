import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/text/index';

describe('sisad-pdfme/pdf-lib/api/text/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
