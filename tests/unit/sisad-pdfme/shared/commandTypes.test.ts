import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/shared/commandTypes';

describe('sisad-pdfme/shared/commandTypes.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
