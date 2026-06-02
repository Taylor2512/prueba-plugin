import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/schemas/text/extraFormatter';

describe('sisad-pdfme/schemas/text/extraFormatter.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
