import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/api/image/alignment';

describe('sisad-pdfme/pdf-lib/api/image/alignment.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
