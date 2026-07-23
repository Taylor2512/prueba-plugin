import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/index';

describe('sisad-pdfme/pdf-lib/api/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
