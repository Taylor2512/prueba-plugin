import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/Designer';

describe('sisad-pdfme/ui/Designer.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
