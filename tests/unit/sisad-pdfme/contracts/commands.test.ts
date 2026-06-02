import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/contracts/commands';

describe('sisad-pdfme/contracts/commands.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
