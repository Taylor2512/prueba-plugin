import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/flags';

describe('sisad-pdfme/pdf-lib/core/acroform/flags.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
