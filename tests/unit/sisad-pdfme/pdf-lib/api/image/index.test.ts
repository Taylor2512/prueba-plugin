import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/image/index';

describe('sisad-pdfme/pdf-lib/api/image/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
