import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/text/layout';

describe('sisad-pdfme/pdf-lib/api/text/layout.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
