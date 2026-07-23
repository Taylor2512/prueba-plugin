import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/embedders/CMap';

describe('sisad-pdfme/pdf-lib/core/embedders/CMap.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
