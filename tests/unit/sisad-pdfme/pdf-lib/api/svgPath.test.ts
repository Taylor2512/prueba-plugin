import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/svgPath';

describe('sisad-pdfme/pdf-lib/api/svgPath.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
