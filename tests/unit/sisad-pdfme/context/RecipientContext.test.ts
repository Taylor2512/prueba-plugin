import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/context/RecipientContext';

describe('sisad-pdfme/context/RecipientContext.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
