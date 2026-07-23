import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/rng';

describe('sisad-pdfme/pdf-lib/utils/rng.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
