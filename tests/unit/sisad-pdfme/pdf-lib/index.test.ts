import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/index';

describe('sisad-pdfme/pdf-lib/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
