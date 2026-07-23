import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/objects';

describe('sisad-pdfme/pdf-lib/utils/objects.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
