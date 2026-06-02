import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/shared/keyboardShortcuts';

describe('sisad-pdfme/shared/keyboardShortcuts.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
