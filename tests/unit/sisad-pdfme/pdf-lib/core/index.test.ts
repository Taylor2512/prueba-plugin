import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/index';

describe('sisad-pdfme/pdf-lib/core/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
