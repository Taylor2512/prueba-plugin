import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/base64';

describe('sisad-pdfme/pdf-lib/utils/base64.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
