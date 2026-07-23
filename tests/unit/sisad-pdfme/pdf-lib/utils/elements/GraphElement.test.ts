import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/elements/GraphElement';

describe('sisad-pdfme/pdf-lib/utils/elements/GraphElement.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
