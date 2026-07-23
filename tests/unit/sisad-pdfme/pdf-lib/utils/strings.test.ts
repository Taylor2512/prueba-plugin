import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/strings';

describe('sisad-pdfme/pdf-lib/utils/strings.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
