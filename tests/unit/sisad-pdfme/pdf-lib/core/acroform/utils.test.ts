import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/acroform/utils';

describe('sisad-pdfme/pdf-lib/core/acroform/utils.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
