import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts';

describe('sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
