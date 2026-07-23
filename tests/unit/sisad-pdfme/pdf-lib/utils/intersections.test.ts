import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/intersections';

describe('sisad-pdfme/pdf-lib/utils/intersections.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
