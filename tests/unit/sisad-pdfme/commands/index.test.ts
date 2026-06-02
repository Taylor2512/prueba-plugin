import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/commands/index';

describe('sisad-pdfme/commands/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
