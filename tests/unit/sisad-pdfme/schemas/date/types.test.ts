import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/schemas/date/types';

describe('sisad-pdfme/schemas/date/types.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
