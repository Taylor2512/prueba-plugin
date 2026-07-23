import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/Embeddable';

describe('sisad-pdfme/pdf-lib/api/Embeddable.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
